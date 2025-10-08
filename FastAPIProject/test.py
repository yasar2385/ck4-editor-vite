from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Tell FastAPI where your HTML templates are located
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "name": "Yasar"}
    )
@app.post("/chat")
async def chat(msg: ChatMessage):
    user_text = msg.message.lower()
    if "hi" in user_text or "hello" in user_text:
        reply = "Hi there 👋! How can I help you today?"
    elif "bye" in user_text:
        reply = "Goodbye! 👋 Have a nice day."
    else:
        reply = f"You said: {msg.message}"
    return {"reply": reply}