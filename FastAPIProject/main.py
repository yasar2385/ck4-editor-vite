import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
import requests

load_dotenv()

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
HF_MODEL = os.getenv("HF_MODEL", "microsoft/DialoGPT-small")

app = FastAPI()
templates = Jinja2Templates(directory="templates")

class ChatMessage(BaseModel):
    message: str

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/chat")
async def chat(msg: ChatMessage):
    prompt = msg.message
    reply = await fetch_hf_reply(prompt)
    return JSONResponse({"reply": reply})


async def fetch_hf_reply(prompt: str) -> str:
    """Call Hugging Face inference API and return generated text."""
    api_url = f"https://api-inference.huggingface.co/models/{HF_MODEL}"
    headers = {
        "Authorization": f"Bearer {HF_API_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "inputs": prompt,
        # optional parameters: e.g. max_length, temperature, etc.
        "parameters": {
            "max_new_tokens": 50,
            "temperature": 0.7,
            "return_full_text": False
        }
    }
    try:
        resp = requests.post(api_url, headers=headers, json=payload, timeout=30)
        resp.raise_for_status()
        output = resp.json()
        # The structure depends on model, often as a list of { “generated_text”: ... }
        if isinstance(output, dict) and output.get("error"):
            return f"Error: {output['error']}"
        if isinstance(output, list):
            # e.g. [{"generated_text": " … reply …"}]
            return output[0].get("generated_text", "No response")
        # fallback
        return str(output)
    except Exception as e:
        print("HF API error:", e)
        return "Oops, something went wrong with AI."

