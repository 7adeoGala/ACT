import os
import subprocess
import uuid
import shutil
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "backend"))
TOOLS_DIR = os.path.join(BACKEND_DIR, "tools")
TOOL_PATH = os.path.join(TOOLS_DIR, "acrp.exe")
REPLAY_DATA_DIR = os.path.join(TOOLS_DIR, "replay_data")

def run_replay_parser(replay_bytes: bytes) -> dict:
    replay_id = str(uuid.uuid4())
    replay_filename = f"{replay_id}.acReplay"
    replay_path = os.path.join(TOOLS_DIR, replay_filename)

    # Guardar replay directamente en tools/
    with open(replay_path, "wb") as f:
        f.write(replay_bytes)

    # Ejecutar acrp.exe desde la misma carpeta donde está el ejecutable
    result = subprocess.run(
    f'acrp.exe "{replay_filename}"',
    cwd=TOOLS_DIR,
    capture_output=True,
    text=True,
    shell=True  # NECESARIO para que interprete bien las comillas en Windows
)

    print(">>> Ejecutando:", TOOL_PATH)
    print(">>> STDOUT:", result.stdout)
    print(">>> STDERR:", result.stderr)

    if result.returncode != 0:
        raise RuntimeError(f"Error al ejecutar acrp.exe: {result.stderr}")

    # Buscar JSON generado
    car_json = os.path.join(REPLAY_DATA_DIR, "car_0.json")
    if not os.path.exists(car_json):
        raise FileNotFoundError("❌ No se generó car_0.json")

    with open(car_json, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Limpieza
    try:
        os.remove(replay_path)
        shutil.rmtree(REPLAY_DATA_DIR, ignore_errors=True)
    except Exception as e:
        print("⚠️ Limpieza fallida:", e)

    return data
