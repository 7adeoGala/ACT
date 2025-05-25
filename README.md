# Assetto Corsa Telemetry Web

Web app que permite subir archivos de telemetría de Assetto Corsa y obtener análisis o recomendaciones.

## Instalación

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload
