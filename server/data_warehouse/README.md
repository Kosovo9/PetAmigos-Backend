# PetMatch Data Warehouse & User Journey Pipeline 30X

Este directorio contiene los componentes de procesamiento de datos a petabyte-scale y analytics avanzados.

## Estructura

- `etl/UserJourneyPipeline.py`: Pipeline principal que procesa eventos de usuario usando arquitectura Lambda/Kappa.
- `requirements.txt`: Dependencias necesarias para ejecutar el pipeline.

## Prerrequisitos

1. Python 3.9+
2. Java 8+ (para Spark)
3. Redis
4. Kafka (opcional para streaming)
5. ClickHouse (opcional para analytics realtime)
6. PostgreSQL (para metadatos)

## Instalación

```bash
cd server/data_warehouse/etl
pip install -r requirements.txt
```

## Ejecución del Pipeline

### Modo API (Recomendado)

Inicia el servidor API que maneja tanto streaming como batch processing:

```bash
cd server/data_warehouse/etl
uvicorn UserJourneyPipeline:app --host 0.0.0.0 --port 8003 --workers 4
```

### Endpoints Principales

- `POST /process/batch`: Inicia procesamiento histórico
- `GET /journey/{user_id}`: Obtiene el user journey map para un usuario
- `GET /metrics`: Métricas de rendimiento del pipeline
- `GET /health`: Estado de los servicios conectados

## Configuración

Las variables de entorno se pueden configurar en un archivo `.env` o exportándolas directamente:

- `REDIS_HOST`, `REDIS_PORT`
- `CLICKHOUSE_HOST`, `CLICKHOUSE_PORT`
- `KAFKA_BROKERS`
- `POSTGRES_URL`
- `AWS_ACCESS_KEY`, `AWS_SECRET_KEY` (para S3)

## Optimizaciones 30X implementadas

- **Polars**: Procesamiento de dataframes ultra-rápido en Rust.
- **Ray & Dask**: Computación distribuida.
- **Spark**: Procesamiento masivo de petabytes.
- **Compresión**: Zstd, Snappy y LZ4 para minimizar I/O.
- **Formatos columnares**: Parquet y Arrow para eficiencia.
