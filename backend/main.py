from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Agregamos el path al parser
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "parser")))
from replay_runner import run_replay_parser

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # o ["http://localhost:5173"] si preferís
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API ACT funcionando"}

@app.post("/upload-replay/")
async def upload_replay(file: UploadFile = File(...)):
    content = await file.read()
    try:
        data = run_replay_parser(content)
        return data
    except Exception as e:
        return {"error": str(e)}
