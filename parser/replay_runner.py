import os
import subprocess
import uuid
import shutil
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "..", "backend")
TOOL_PATH = os.path.abspath(os.path.join(BACKEND_DIR, "tools", "acrp.exe"))
TEMP_DIR = os.path.abspath(os.path.join(BACKEND_DIR, "temp"))

def run_replay_parser(replay_bytes: bytes) -> dict:
    os.makedirs(TEMP_DIR, exist_ok=True)
    
    replay_id = str(uuid.uuid4())
    replay_file = os.path.join(TEMP_DIR, f"{replay_id}.acReplay")

    # 🔹 Guardamos la replay
    with open(replay_file, "wb") as f:
        f.write(replay_bytes)

    # 🔹 Ejecutamos el parser
    result = subprocess.run(
        [TOOL_PATH, replay_file],
        cwd=TEMP_DIR,
        capture_output=True,
        text=True
    )

    # 🔹 DEBUG: Mostrar salida del parser
    print(">>> Ejecutando:", TOOL_PATH)
    print(">>> Archivo replay:", replay_file)
    print(">>> STDOUT:")
    print(result.stdout)
    print(">>> STDERR:")
    print(result.stderr)

    # 🔹 Si falla, mostrar error
    if result.returncode != 0:
        raise RuntimeError(f"Error al ejecutar acrp.exe: {result.stderr}")

    # 🔹 Buscar car_0.json generado
    car_json = os.path.join(TEMP_DIR, "replay_data", "car_0.json")
    if not os.path.exists(car_json):
        raise FileNotFoundError("❌ No se generó car_0.json")

    # 🔹 Cargar contenido del JSON
    with open(car_json, "r", encoding="utf-8") as f:
        data = json.load(f)

    # 🔹 Limpieza
    shutil.rmtree(os.path.join(TEMP_DIR, "replay_data"), ignore_errors=True)
    os.remove(replay_file)

    return data
