from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from parser.replay_parser import parse_replay  # Asegurate que esto existe

app = FastAPI()

# CORS para permitir que el frontend acceda al backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Podés restringir a ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API ACT funcionando"}

@app.post("/upload-replay/")
async def upload_replay(file: UploadFile = File(...)):
    contents = await file.read()
    # Supongamos que parse_replay toma un string de texto plano y devuelve un diccionario
    parsed_data = parse_replay(contents.decode("utf-8"))
    return parsed_data
