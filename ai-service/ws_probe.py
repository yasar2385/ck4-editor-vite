from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import uvicorn

app = FastAPI()

@app.websocket("/ws/{sid}")
async def test_ws(ws: WebSocket, sid: str):
    print("⚙️  incoming connection", sid)
    await ws.accept()
    try:
        while True:
            msg = await ws.receive_text()
            print("→", msg)
            await ws.send_text(f"Echo: {msg}")
    except WebSocketDisconnect:
        print("❌ disconnected", sid)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=6000)
