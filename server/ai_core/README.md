# PetAmigos AI Microservices 20X

Colección de microservicios de IA altamente optimizados para PetAmigos.

## Requisitos Previos

- Python 3.9+
- Redis Server (corriendo en localhost:6379)
- CUDA Toolkit (opcional, para aceleración GPU)
- 16GB RAM mínimo recomendado

## Instalación

```bash
cd server/ai_core
pip install -r requirements.txt
```

## Configuración

Asegúrate de tener las siguientes variables de entorno configuradas (o pasar en configuración):

- `AWS_ACCESS_KEY_ID` (para ImageModeration)
- `AWS_SECRET_ACCESS_KEY` (para ImageModeration)
- `S3_QUARANTINE_BUCKET` (para ImageModeration)
- `REDIS_URL` (default: redis://localhost:6379)

## Servicios

### 1. Sentiment Analysis Engine 20X
Análisis de texto multilingüe, emociones, toxicidad y sarcasmo.

- **Puerto**: 8000
- **Ejecutar**:
  ```bash
  python SentimentAnalysis.py
  ```
- **Endpoints**:
  - `POST /analyze`: Análisis de texto individual
  - `POST /analyze-batch`: Análisis por lotes (10k+ textos)
  - `GET /health`: Estado del servicio

### 2. Image Moderation Engine 20X
Moderación de imágenes en tiempo real, detección de NSFW, violencia, rostros.

- **Puerto**: 8001
- **Ejecutar**:
  ```bash
  python ImageModeration.py
  ```
- **Endpoints**:
  - `POST /moderate`: Moderar imagen (File o URL)
  - `GET /health`: Estado del servicio

### 3. Churn Prediction Engine 20X
Predicción de abandono de usuarios usando Ensemble Learning.

- **Puerto**: 8002
- **Ejecutar**:
  ```bash
  python ChurnPrediction.py
  ```
- **Endpoints**:
  - `POST /predict`: Predecir probabilidad de churn
  - `POST /predict-batch`: Predicción por lotes
  - `POST /retrain`: Reentrenar modelos
  - `GET /health`: Estado del servicio

## Notas de Rendimiento

- Los servicios usan `asyncio` para concurrencia masiva.
- Modelos pesados se cargan en GPU si está disponible.
- Redis se usa para caché de predicciones y deduplicación.
- Prometheus metrics expuestas para monitoreo.
