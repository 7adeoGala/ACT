from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from parser.replay_runner import run_replay_parser
import os
import json
import math

app = FastAPI()

# CORS para permitir conexión desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Podés restringir a ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generar_current_lap(x, y, tolerancia=1.0, min_puntos_vuelta=500):
    """Genera el array currentLap detectando cruces por el punto inicial."""
    if not x or not y or len(x) != len(y):
        return [0] * len(x)
    current_lap = []
    lap = 0
    start_x, start_y = x[0], y[0]
    cruzando = False
    ultimo_cruce = -min_puntos_vuelta  # Para evitar doble conteo
    for i in range(len(x)):
        distancia = math.hypot(x[i] - start_x, y[i] - start_y)
        if distancia < tolerancia:
            if not cruzando and (i - ultimo_cruce) > min_puntos_vuelta:
                lap += 1
                cruzando = True
                ultimo_cruce = i
        else:
            cruzando = False
        current_lap.append(lap)
    return current_lap

def calcular_tiempos_vuelta(times, current_lap):
    laps = []
    laps_idx = sorted(set(current_lap))
    for lap in laps_idx:
        indices = [i for i, l in enumerate(current_lap) if l == lap]
        if indices:
            t0 = times[indices[0]]
            t1 = times[indices[-1]]
            laps.append({
                "lap_number": lap + 1,
                "lap_time": round(t1 - t0, 3)
            })
    return laps

@app.get("/")
def root():
    return {"message": "API ACT funcionando"}

@app.post("/upload-replay/")
async def upload_replay(file: UploadFile = File(...)):
    print("📥 Archivo recibido:", file.filename)
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

        trazado = leer_json("trazado.json")
        # Generar currentLap realista si no existe
        if trazado and "currentLap" not in trazado and "x" in trazado and "y" in trazado:
            trazado["currentLap"] = generar_current_lap(trazado["x"], trazado["y"])

        # Calcular tiempos de vuelta usando el tiempo real si existe
        laps = []
        if "currentLap" in trazado and "time" in trazado:
            laps = calcular_tiempos_vuelta(trazado["time"], trazado["currentLap"])

        # Calcular el mejor tiempo de vuelta y la diferencia (delta) para cada vuelta
        bestLap = min(lap["lap_time"] for lap in laps) if laps else 0
        lapsWithDelta = [
            {
                "lap_number": lap["lap_number"],
                "lap_time": lap["lap_time"],
                "delta": round(lap["lap_time"] - bestLap, 3)
            }
            for lap in laps
        ]

        return {
            "resumen": data,
            "trazado": trazado,
            "rpm_marcha": leer_json("rpm_marcha.json"),
            "gas_brake": leer_json("gas_brake.json"),
            "fuel": leer_json("fuel.json"),
            "laps": lapsWithDelta  # Incluir datos de vueltas con delta
        }
    except Exception as e:
        print("❌ ERROR:", e)
        return {"error": str(e)}


