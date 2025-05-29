from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from parser.replay_runner import run_replay_parser
import os
import json

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
        # Leer los datos de los gráficos
        def leer_json(nombre):
            path = os.path.join("backend", "tools", nombre)
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
            return None
        return {
            "resumen": data,
            "trazado": leer_json("trazado.json"),
            "rpm_marcha": leer_json("rpm_marcha.json"),
            "gas_brake": leer_json("gas_brake.json"),
            "fuel": leer_json("fuel.json"),
        }
    except Exception as e:
        print("❌ ERROR:", e)  # AGREGADO
        return {"error": str(e)}

@app.get("/grafico/trazado")
def get_trazado():
    path = os.path.join("backend", "tools", "trazado.json")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Datos de trazado no encontrados")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/grafico/rpm-marcha")
def get_rpm_marcha():
    path = os.path.join("backend", "tools", "rpm_marcha.json")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Datos de RPM/marcha no encontrados")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/grafico/gas-brake")
def get_gas_brake():
    path = os.path.join("backend", "tools", "gas_brake.json")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Datos de gas/freno no encontrados")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/grafico/fuel")
def get_fuel():
    path = os.path.join("backend", "tools", "fuel.json")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Datos de fuel no encontrados")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

