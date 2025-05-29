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

    # Extraer datos útiles de la salida estándar
    acrp_stdout = result.stdout

    def buscar_valor(patron, texto):
        m = re.search(patron, texto, re.MULTILINE)
        return m.group(1).strip() if m else None

    info_extra = {
        "version": buscar_valor(r"Version:\s*(.+)", acrp_stdout),
        "recording_interval": buscar_valor(r"Recording Interval:\s*(.+)", acrp_stdout),
        "recording_quality": buscar_valor(r"Recording Quality \(FPS\):\s*(.+)", acrp_stdout),
        "weather_id": buscar_valor(r"Weather ID:\s*(.+)", acrp_stdout),
        "track_id": buscar_valor(r"Track ID:\s*(.+)", acrp_stdout),
        "track_config": buscar_valor(r"Track Config:\s*(.*)", acrp_stdout),
        "num_cars": buscar_valor(r"Number of Cars:\s*(.+)", acrp_stdout),
        "driver_names": buscar_valor(r"Driver Names:\s*(.*)", acrp_stdout),
        "num_frames": buscar_valor(r"Number of Frames:\s*(.+)", acrp_stdout),
        "num_track_objects": buscar_valor(r"Number of Track Objects:\s*(.+)", acrp_stdout),
        "car_id": buscar_valor(r"Car ID:\s*(.+)", acrp_stdout),
        "driver_name": buscar_valor(r"Driver Name:\s*(.+)", acrp_stdout),
        "nation_code": buscar_valor(r"Nation Code:\s*(.*)", acrp_stdout),
        "driver_team": buscar_valor(r"Driver Team:\s*(.*)", acrp_stdout),
        "car_skin_id": buscar_valor(r"Car Skin ID:\s*(.+)", acrp_stdout),
    }

    # Buscar el JSON generado que empiece con el UUID
    json_pattern = os.path.join(TOOLS_DIR, f"{replay_id}*.json")
    json_files = glob.glob(json_pattern)
    if not json_files:
        raise FileNotFoundError(f"❌ No se generó ningún archivo JSON con patrón {json_pattern}")
    output_json_path = json_files[0]

    with open(output_json_path, "r", encoding="utf-8") as f:
        raw = f.read()
        raw = re.sub(r',(\s*[\]}])', r'\1', raw)
        try:
            data = json.loads(raw)
        except json.JSONDecodeError as e:
            raise ValueError(f"JSON inválido: {e}\nPrimeros 500 caracteres:\n{raw[:500]}")

    # Combinar info del JSON y de la consola
    resultado = {
        "info_extra": info_extra,
        "json_data": data
    }

    # Crear un resumen amigable para el usuario
    resumen = {
        "Versión del parser": info_extra.get("version"),
        "Intervalo de grabación": info_extra.get("recording_interval"),
        "Calidad de grabación": info_extra.get("recording_quality"),
        "Clima": info_extra.get("weather_id"),
        "Circuito": info_extra.get("track_id"),
        "Configuración de pista": info_extra.get("track_config"),
        "Cantidad de autos": info_extra.get("num_cars"),
        "Pilotos": info_extra.get("driver_names"),
        "Frames": info_extra.get("num_frames"),
        "Objetos en pista": info_extra.get("num_track_objects"),
        "Auto": info_extra.get("car_id"),
        "Piloto principal": info_extra.get("driver_name"),
        "Nacionalidad": info_extra.get("nation_code"),
        "Equipo": info_extra.get("driver_team"),
        "Skin del auto": info_extra.get("car_skin_id"),
    }

    # Guardar datos para gráficos (sobrescribe en cada replay)
    # Trazado (trayectoria)
    with open(os.path.join(TOOLS_DIR, "trazado.json"), "w", encoding="utf-8") as f:
        json.dump({
            "x": data.get("x", []),
            "y": data.get("y", []),
            "z": data.get("z", [])
        }, f)

    # RPM y marcha (si existieran en el JSON)
    with open(os.path.join(TOOLS_DIR, "rpm_marcha.json"), "w", encoding="utf-8") as f:
        json.dump({
            "rpm": data.get("rpm", []),
            "gear": data.get("gear", [])
        }, f)

    # Gas/Brake (si existieran en el JSON)
    with open(os.path.join(TOOLS_DIR, "gas_brake.json"), "w", encoding="utf-8") as f:
        json.dump({
            "gas": data.get("gas", []),
            "brake": data.get("brake", [])
        }, f)

    # Fuel (si existiera en el JSON)
    with open(os.path.join(TOOLS_DIR, "fuel.json"), "w", encoding="utf-8") as f:
        json.dump({
            "fuel": data.get("fuel", [])
        }, f)

    # Limpieza
    try:
        os.remove(replay_path)
        os.remove(output_json_path)
    except Exception as e:
        print("⚠️ Limpieza fallida:", e)

    return resumen
