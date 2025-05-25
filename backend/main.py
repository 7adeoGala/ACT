from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from parser.replay_parser import parse_replay_file
from io import BytesIO

app = FastAPI()

# Habilitá CORS si te conectás desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambiar a ["http://localhost:3000"] si hace falta
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-replay")
async def upload_replay(file: UploadFile = File(...)):
    content = await file.read()
    replay_data = parse_replay_file(BytesIO(content))  # análisis en memoria
    return replay_data
