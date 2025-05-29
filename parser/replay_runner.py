import os
import subprocess
import uuid
import shutil
import json
import glob
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TOOLS_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "backend", "tools"))
TOOL_PATH = os.path.join(TOOLS_DIR, "acrp.exe")

if not os.path.exists(TOOL_PATH):
    raise FileNotFoundError(f"No se encontró acrp.exe en {TOOL_PATH}")

def run_replay_parser(replay_bytes: bytes) -> dict:
    # Generar nombre único para la replay
    replay_id = str(uuid.uuid4())
    replay_filename = f"{replay_id}.acReplay"
    replay_path = os.path.join(TOOLS_DIR, replay_filename)
    output_json_path = os.path.join(TOOLS_DIR, f"{replay_id}.json")

    # Guardar el archivo en la carpeta del parser
    with open(replay_path, "wb") as f:
        f.write(replay_bytes)

    # Ejecutar acrp.exe correctamente (sin shell)
    print(f"🟡 Ejecutando parser: acrp.exe {replay_filename}")
    result = subprocess.run(
        [TOOL_PATH, replay_filename],
        cwd=TOOLS_DIR,
        capture_output=True,
        text=True
    )

    # Buscar el JSON generado que empiece con el UUID
    json_pattern = os.path.join(TOOLS_DIR, f"{replay_id}*.json")
    json_files = glob.glob(json_pattern)
    if not json_files:
        raise FileNotFoundError(f"❌ No se generó ningún archivo JSON con patrón {json_pattern}")
    output_json_path = json_files[0]

    with open(output_json_path, "r", encoding="utf-8") as f:
        raw = f.read()
        # Elimina comas finales antes de cerrar arrays/objetos (no es perfecto, pero ayuda)
        raw = re.sub(r',(\s*[\]}])', r'\1', raw)
        try:
            data = json.loads(raw)
        except json.JSONDecodeError as e:
            raise ValueError(f"JSON inválido: {e}\nPrimeros 500 caracteres:\n{raw[:500]}")

    # Limpieza
    try:
        os.remove(replay_path)
        os.remove(output_json_path)
    except Exception as e:
        print("⚠️ Limpieza fallida:", e)

    return data
