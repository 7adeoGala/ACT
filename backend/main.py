from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from parser.replay_runner import run_replay_parser

app = FastAPI()

# CORS para permitir conexión desde el frontend
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
    print("📥 Archivo recibido:", file.filename)  # AGREGADO

    content = await file.read()

    try:
        data = run_replay_parser(content)
        return data
    except Exception as e:
        print("❌ ERROR:", e)  # AGREGADO
        return {"error": str(e)}

