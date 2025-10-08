import uuid, json, asyncio, os
import redis.asyncio as redis
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI
# from database import SessionLocal, Conversation
import uvicorn

# -------------------------------------------------------------------
# FASTAPI APP
# -------------------------------------------------------------------
app = FastAPI(title="DocBot Realtime Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # loosen for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------
# REDIS CONFIG
# -------------------------------------------------------------------
REDIS_URL = "redis://localhost:6379"

@app.on_event("startup")
async def startup_event():
    """Connect to Redis at startup."""
    print("🚀 FastAPI startup_event fired")
    try:
        app.state.redis_client = redis.from_url(REDIS_URL, decode_responses=True)
        await app.state.redis_client.ping()
        print("✅ Redis connected successfully")
    except Exception as e:
        app.state.redis_client = None
        print("❌ Redis connection failed:", e)

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up Redis connection."""
    rc = getattr(app.state, "redis_client", None)
    if rc:
        await rc.close()
        print("🧹 Redis connection closed")

# -------------------------------------------------------------------
# LLAMA INDEX CONFIG
# -------------------------------------------------------------------
Settings.llm = OpenAI(model="gpt-3.5-turbo", temperature=0)
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")

indexes = {}

# -------------------------------------------------------------------
# DATA MODELS
# -------------------------------------------------------------------
class QueryRequest(BaseModel):
    session_id: str
    question: str

class QueryResponse(BaseModel):
    session_id: str
    answer: str
    sources: list = []

# -------------------------------------------------------------------
# UPLOAD DOCUMENTS
# -------------------------------------------------------------------
@app.post("/upload")
async def upload_documents(session_id: str, files: list[UploadFile]):
    """Upload and index documents."""
    try:
        os.makedirs(f"./temp/{session_id}", exist_ok=True)
        for f in files:
            path = f"./temp/{session_id}/{f.filename}"
            with open(path, "wb") as fp:
                fp.write(await f.read())

        docs = SimpleDirectoryReader(f"./temp/{session_id}").load_data()
        index = VectorStoreIndex.from_documents(docs)
        indexes[session_id] = index
        return {"status": "indexed", "session_id": session_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------------------------------------------------
# WEBSOCKET ENDPOINT
# -------------------------------------------------------------------
@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    print(f"🟢 WebSocket connected: {session_id}")

    redis_client = getattr(app.state, "redis_client", None)
    if not redis_client:
        # handle case where Redis not connected
        await websocket.send_text(json.dumps({"error": "Redis not connected"}))
        await websocket.close()
        print("⚠️ Redis unavailable, connection closed.")
        return

    # create pubsub listener
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(session_id)

    async def listener():
        async for msg in pubsub.listen():
            if msg["type"] == "message":
                await websocket.send_text(msg["data"])

    listener_task = asyncio.create_task(listener())

    try:
        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
            except Exception:
                await websocket.send_text(json.dumps({"error": "Invalid JSON"}))
                continue

            question = msg.get("question")
            if not question:
                await websocket.send_text(json.dumps({"error": "Missing question"}))
                continue

            if session_id not in indexes:
                await websocket.send_text(json.dumps({"error": "Session not indexed"}))
                continue

            # --- LlamaIndex query ---
            query_engine = indexes[session_id].as_query_engine(similarity_top_k=3)
            response = query_engine.query(question)
            answer = str(response)
            sources = [node.node.text[:150] for node in response.source_nodes]

            # --- Save to DB ---
            db = SessionLocal()
            try:
                conv = Conversation(
                    id=str(uuid.uuid4()),
                    session_id=session_id,
                    question=question,
                    answer=answer,
                    sources=json.dumps(sources),
                )
                db.add(conv)
                db.commit()
            finally:
                db.close()

            # --- Publish back via Redis ---
            await redis_client.publish(
                session_id,
                json.dumps({"user": "bot", "answer": answer, "sources": sources}),
            )

    except WebSocketDisconnect:
        print(f"🔴 WebSocket disconnected: {session_id}")
    except Exception as e:
        print(f"❌ WebSocket error for {session_id}:", e)
    finally:
        await pubsub.unsubscribe(session_id)
        await pubsub.close()
        listener_task.cancel()

# -------------------------------------------------------------------
# MAIN ENTRY
# -------------------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=6000, reload=True)
