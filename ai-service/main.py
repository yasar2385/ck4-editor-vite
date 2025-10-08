# ai-service/main.py
import uuid, json, os
from fastapi import FastAPI, UploadFile, HTTPException
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
app = FastAPI(title="DocBot HTTP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # loosen for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------
# LLAMA INDEX CONFIG
# -------------------------------------------------------------------
Settings.llm = OpenAI(model="gpt-3.5-turbo", temperature=0)
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")

indexes = {}  # in-memory session indexes

# -------------------------------------------------------------------
# REQUEST / RESPONSE MODELS
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
    """Upload and index documents for a session."""
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
# ASK A QUESTION
# -------------------------------------------------------------------
@app.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    if request.session_id not in indexes:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        query_engine = indexes[request.session_id].as_query_engine(similarity_top_k=3)
        response = query_engine.query(request.question)
        answer = str(response)
        sources = [node.node.text[:200] for node in response.source_nodes]

        # store in DB
        db = SessionLocal()
        try:
            convo = Conversation(
                id=str(uuid.uuid4()),
                session_id=request.session_id,
                question=request.question,
                answer=answer,
                sources=json.dumps(sources),
            )
            db.add(convo)
            db.commit()
        finally:
            db.close()

        return QueryResponse(
            session_id=request.session_id,
            answer=answer,
            sources=sources,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------------------------------------------------
# GET HISTORY
# -------------------------------------------------------------------
@app.get("/history/{session_id}")
async def get_history(session_id: str):
    db = SessionLocal()
    try:
        rows = (
            db.query(Conversation)
            .filter(Conversation.session_id == session_id)
            .order_by(Conversation.timestamp)
            .all()
        )
        return [
            {
                "question": r.question,
                "answer": r.answer,
                "sources": json.loads(r.sources or "[]"),
                "timestamp": r.timestamp.isoformat(),
            }
            for r in rows
        ]
    finally:
        db.close()

# -------------------------------------------------------------------
# MAIN ENTRY
# -------------------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
