from fastapi import FastAPI, WebSocket
import uvicorn

app = FastAPI()

@app.websocket("/ws/{sid}")
async def test_ws(ws: WebSocket, sid: str):
    await ws.accept()
    print("Connected:", sid)
    while True:
        msg = await ws.receive_text()
        await ws.send_text(f"Echo: {msg}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=6000)
