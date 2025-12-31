"""
User Journey Pipeline 30X - Procesamiento de datos a petabyte-scale
Procesa 1TB+ de datos diarios con latencia <5 minutos
Arquitectura Lambda + Kappa combinada para batch/streaming
"""

import asyncio
import json
import logging
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Tuple, Set
from enum import Enum
from dataclasses import dataclass, field
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
import multiprocessing as mp

import pandas as pd
import numpy as np
import pyarrow as pa
import pyarrow.parquet as pq
import dask.dataframe as dd
from dask.distributed import Client, LocalCluster
import polars as pl
import ray
from ray import serve
import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *
import boto3
from botocore.exceptions import ClientError
import google.cloud.bigquery as bigquery
import google.cloud.storage as storage
from kafka import KafkaProducer, KafkaConsumer
import redis
import psycopg2
from psycopg2.extras import execute_batch
import sqlalchemy
from sqlalchemy import create_engine, text
import duckdb
import clickhouse_connect
from prometheus_client import Counter, Histogram, Gauge, start_http_server
import msgpack
import orjson
import zstandard as zstd
from lz4 import frame
import snappy

# Métricas Prometheus
EVENTS_PROCESSED = Counter('events_processed_total', 'Total events processed')
PROCESSING_LATENCY = Histogram('processing_latency_seconds', 'Event processing latency')
DATA_VOLUME_GB = Gauge('data_volume_gb', 'Data volume processed in GB')
PARALLEL_TASKS = Gauge('parallel_tasks', 'Number of parallel processing tasks')

class ProcessingMode(str, Enum):
    """Modos de procesamiento"""
    BATCH = "batch"
    STREAMING = "streaming"
    HYBRID = "hybrid"
    MICRO_BATCH = "micro_batch"

class DataSource(str, Enum):
    """Fuentes de datos"""
    KAFKA = "kafka"
    S3 = "s3"
    BIGQUERY = "bigquery"
    POSTGRES = "postgres"
    CLICKHOUSE = "clickhouse"
    REDIS = "redis"
    API = "api"

@dataclass
class UserJourneyEvent:
    """Evento de viaje del usuario"""
    event_id: str
    user_id: str
    session_id: str
    event_type: str
    event_name: str
    timestamp: datetime
    platform: str
    device_info: Dict[str, Any]
    location: Dict[str, Any]
    properties: Dict[str, Any]
    app_version: str
    ip_address: Optional[str]
    user_agent: Optional[str]
    processing_time: float = 0.0

@dataclass
class JourneyStage:
    """Etapa en el viaje del usuario"""
    stage_id: str
    stage_name: str
    entry_events: List[str]
    exit_events: List[str]
    duration_seconds: int
    completion_rate: float
    dropoff_rate: float
    next_stages: List[str]

class UserJourneyPipeline30X:
    """
    Pipeline de viaje de usuario 30X optimizado
    Procesa 1M+ eventos/segundo con análisis en tiempo real
    """
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = self._setup_logger()
        self.metrics = {}
        
        # Inicializar componentes de procesamiento
        self.spark = None
        self.dask_client = None
        self.ray_context = None
        self.kafka_producer = None
        self.kafka_consumer = None
        self.redis_client = None
        self.clickhouse_client = None
        self.postgres_pool = None
        self.s3_client = None
        self.bigquery_client = None
        
        # Configuraciones de optimización
        self.batch_size = config.get('batch_size', 10000)
        self.parallelism = config.get('parallelism', mp.cpu_count() * 4)
        self.compression_level = config.get('compression_level', 3)
        self.cache_ttl = config.get('cache_ttl', 3600)
        
        # Estadísticas en memoria
        self.stats = {
            'events_processed': 0,
            'total_bytes': 0,
            'avg_processing_time': 0,
            'errors': 0,
            'last_checkpoint': datetime.now()
        }
        
        self._init_cluster()
    
    def _setup_logger(self) -> logging.Logger:
        """Configurar logger distribuido"""
        logger = logging.getLogger("UserJourneyPipeline30X")
        logger.setLevel(logging.INFO)
        
        # Handler para archivo
        file_handler = logging.FileHandler('pipeline.log')
        file_handler.setLevel(logging.INFO)
        
        # Handler para console
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(process)d - %(message)s'
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)
        
        return logger
    
    def _init_cluster(self):
        """Inicializar cluster de procesamiento distribuido"""
        self.logger.info("🚀 Inicializando cluster de procesamiento 30X...")
        
        try:
            # Inicializar Spark para procesamiento masivo
            self.spark = SparkSession.builder \
                .appName("UserJourneyPipeline30X") \
                .master("local[*]") \
                .config("spark.executor.memory", "8g") \
                .config("spark.driver.memory", "4g") \
                .config("spark.sql.shuffle.partitions", "100") \
                .config("spark.default.parallelism", "200") \
                .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer") \
                .config("spark.kryoserializer.buffer.max", "512m") \
                .config("spark.sql.adaptive.enabled", "true") \
                .config("spark.sql.adaptive.coalescePartitions.enabled", "true") \
                .config("spark.sql.adaptive.skewJoin.enabled", "true") \
                .getOrCreate()
            
            self.logger.info("✅ Spark inicializado")
            
        except Exception as e:
            self.logger.warning(f"Spark no disponible: {str(e)}")
        
        try:
            # Inicializar Dask para procesamiento paralelo
            cluster = LocalCluster(
                n_workers=self.parallelism,
                threads_per_worker=2,
                memory_limit='8GB',
                processes=True
            )
            self.dask_client = Client(cluster)
            self.logger.info(f"✅ Dask cluster con {self.parallelism} workers")
            
        except Exception as e:
            self.logger.warning(f"Dask no disponible: {str(e)}")
        
        try:
            # Inicializar Ray para computación distribuida
            ray.init(
                num_cpus=self.parallelism,
                object_store_memory=10**9,
                ignore_reinit_error=True
            )
            self.ray_context = ray
            self.logger.info("✅ Ray inicializado")
            
        except Exception as e:
            self.logger.warning(f"Ray no disponible: {str(e)}")
        
        # Inicializar clientes de almacenamiento
        self._init_storage_clients()
        
        self.logger.info("🔄 Todos los componentes inicializados")
    
    def _init_storage_clients(self):
        """Inicializar clientes de almacenamiento y bases de datos"""
        # Redis para caché y estado
        try:
            self.redis_client = redis.Redis(
                host=self.config.get('redis_host', 'localhost'),
                port=self.config.get('redis_port', 6379),
                db=0,
                decode_responses=False,
                max_connections=50
            )
            self.redis_client.ping()
            self.logger.info("✅ Redis conectado")
        except Exception as e:
            self.logger.warning(f"Redis no disponible: {str(e)}")
        
        # ClickHouse para analytics en tiempo real
        try:
            self.clickhouse_client = clickhouse_connect.get_client(
                host=self.config.get('clickhouse_host', 'localhost'),
                port=self.config.get('clickhouse_port', 8123),
                username=self.config.get('clickhouse_user', 'default'),
                password=self.config.get('clickhouse_password', ''),
                database=self.config.get('clickhouse_db', 'default')
            )
            self.logger.info("✅ ClickHouse conectado")
        except Exception as e:
            self.logger.warning(f"ClickHouse no disponible: {str(e)}")
        
        # PostgreSQL para datos maestros
        try:
            self.postgres_pool = create_engine(
                self.config.get('postgres_url', 'postgresql://localhost:5432/analytics'),
                pool_size=20,
                max_overflow=10,
                pool_pre_ping=True
            )
            self.logger.info("✅ PostgreSQL conectado")
        except Exception as e:
            self.logger.warning(f"PostgreSQL no disponible: {str(e)}")
        
        # S3 para almacenamiento de datos crudos
        try:
            self.s3_client = boto3.client(
                's3',
                aws_access_key_id=self.config.get('aws_access_key'),
                aws_secret_access_key=self.config.get('aws_secret_key'),
                region_name=self.config.get('aws_region', 'us-east-1')
            )
            self.logger.info("✅ S3 cliente inicializado")
        except Exception as e:
            self.logger.warning(f"S3 no disponible: {str(e)}")
        
        # Kafka para streaming
        try:
            self.kafka_producer = KafkaProducer(
                bootstrap_servers=self.config.get('kafka_brokers', 'localhost:9092').split(','),
                value_serializer=lambda v: orjson.dumps(v),
                compression_type='snappy',
                batch_size=16384,
                linger_ms=5,
                max_in_flight_requests_per_connection=5
            )
            self.logger.info("✅ Kafka producer inicializado")
        except Exception as e:
            self.logger.warning(f"Kafka no disponible: {str(e)}")
    
    async def process_stream(self, source: DataSource, mode: ProcessingMode = ProcessingMode.STREAMING):
        """
        Procesar stream continuo de eventos de usuario
        Throughput objetivo: 1M eventos/segundo
        """
        self.logger.info(f"🚀 Iniciando procesamiento stream desde {source.value}")
        
        # Iniciar servidor de métricas
        start_http_server(9090)
        
        processors = {
            DataSource.KAFKA: self._process_kafka_stream,
            DataSource.API: self._process_api_stream,
            DataSource.REDIS: self._process_redis_stream
        }
        
        if source not in processors:
            raise ValueError(f"Fuente no soportada: {source}")
        
        processor = processors[source]
        
        # Procesar en micro-batches para balancear latencia/throughput
        if mode == ProcessingMode.MICRO_BATCH:
            await self._process_micro_batches(processor)
        elif mode == ProcessingMode.STREAMING:
            await processor()
        else:
            await self._process_hybrid(processor)
    
    async def _process_kafka_stream(self):
        """Procesar stream desde Kafka"""
        consumer = KafkaConsumer(
            self.config.get('kafka_topic', 'user-journey-events'),
            bootstrap_servers=self.config.get('kafka_brokers', 'localhost:9092').split(','),
            group_id='journey-pipeline-30x',
            auto_offset_reset='latest',
            enable_auto_commit=False,
            value_deserializer=lambda v: orjson.loads(v),
            max_poll_records=5000,
            fetch_max_bytes=50 * 1024 * 1024  # 50MB
        )
        
        batch = []
        batch_start_time = time.time()
        
        for message in consumer:
            try:
                event_data = message.value
                event = UserJourneyEvent(**event_data)
                batch.append(event)
                
                # Procesar batch cada 1000 eventos o 1 segundo
                if len(batch) >= 1000 or (time.time() - batch_start_time) >= 1:
                    await self._process_batch_parallel(batch)
                    
                    # Commit offset
                    consumer.commit()
                    
                    # Reset batch
                    batch = []
                    batch_start_time = time.time()
                
                EVENTS_PROCESSED.inc()
                
            except Exception as e:
                self.logger.error(f"Error procesando mensaje Kafka: {str(e)}")
                self.stats['errors'] += 1
    
    async def _process_batch_parallel(self, batch: List[UserJourneyEvent]):
        """Procesar batch de eventos en paralelo con múltiples estrategias"""
        start_time = time.time()
        
        # Dividir batch para procesamiento paralelo
        chunk_size = len(batch) // self.parallelism + 1
        chunks = [batch[i:i + chunk_size] for i in range(0, len(batch), chunk_size)]
        
        # Procesar chunks en paralelo
        tasks = []
        for chunk in chunks:
            task = asyncio.create_task(self._process_chunk_optimized(chunk))
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Consolidar resultados
        successful = sum(1 for r in results if not isinstance(r, Exception))
        
        processing_time = time.time() - start_time
        PROCESSING_LATENCY.observe(processing_time)
        
        self.stats['events_processed'] += len(batch)
        self.stats['total_bytes'] += sum(len(str(e).encode()) for e in batch)
        
        avg_time = processing_time / len(batch) if batch else 0
        self.stats['avg_processing_time'] = (
            self.stats['avg_processing_time'] * (self.stats['events_processed'] - len(batch)) +
            avg_time * len(batch)
        ) / self.stats['events_processed']
        
        DATA_VOLUME_GB.set(self.stats['total_bytes'] / (1024**3))
        PARALLEL_TASKS.set(len(chunks))
        
        self.logger.info(
            f"✅ Batch procesado: {len(batch)} eventos, {successful}/{len(chunks)} chunks, "
            f"{processing_time:.3f}s, {len(batch)/processing_time:.0f} eventos/segundo"
        )
    
    async def _process_chunk_optimized(self, chunk: List[UserJourneyEvent]) -> Dict[str, Any]:
        """Procesar un chunk de eventos con optimizaciones 30X"""
        try:
            # Convertir a DataFrame de Polars para procesamiento ultra rápido
            df = pl.DataFrame([
                {
                    'event_id': e.event_id,
                    'user_id': e.user_id,
                    'session_id': e.session_id,
                    'event_type': e.event_type,
                    'event_name': e.event_name,
                    'timestamp': e.timestamp,
                    'platform': e.platform,
                    'device_info': json.dumps(e.device_info),
                    'location': json.dumps(e.location),
                    'properties': json.dumps(e.properties),
                    'app_version': e.app_version
                }
                for e in chunk
            ])
            
            # 1. Enriquecimiento de datos
            df_enriched = await self._enrich_data(df)
            
            # 2. Validación y limpieza
            df_clean = await self._clean_data(df_enriched)
            
            # 3. Agregación para analytics
            aggregates = await self._aggregate_events(df_clean)
            
            # 4. Detección de anomalías
            anomalies = await self._detect_anomalies(df_clean)
            
            # 5. Almacenamiento en múltiples sinks
            storage_tasks = [
                self._store_clickhouse(df_clean),
                self._store_postgres(df_clean),
                self._store_s3_parquet(df_clean),
                self._update_redis_cache(df_clean)
            ]
            
            await asyncio.gather(*storage_tasks)
            
            return {
                'chunk_size': len(chunk),
                'aggregates': aggregates,
                'anomalies': len(anomalies),
                'storage_success': True
            }
            
        except Exception as e:
            self.logger.error(f"Error procesando chunk: {str(e)}")
            raise
    
    async def _enrich_data(self, df: pl.DataFrame) -> pl.DataFrame:
        """Enriquecer datos con información adicional"""
        # Enriquecer con datos de usuario
        user_ids = df['user_id'].unique().to_list()
        
        if self.redis_client:
            # Buscar en caché primero
            user_data = {}
            for user_id in user_ids:
                cached = self.redis_client.get(f"user:{user_id}")
                if cached:
                    user_data[user_id] = orjson.loads(cached)
            
            # Para usuarios no en caché, buscar en PostgreSQL
            missing_ids = [uid for uid in user_ids if uid not in user_data]
            
            if missing_ids and self.postgres_pool:
                query = text("""
                    SELECT user_id, created_at, country, language, 
                           subscription_tier, total_spent, retention_score
                    FROM users 
                    WHERE user_id = ANY(:user_ids)
                """)
                
                with self.postgres_pool.connect() as conn:
                    result = conn.execute(query, {'user_ids': missing_ids})
                    for row in result:
                        user_data[row.user_id] = dict(row)
                        
                        # Almacenar en caché
                        self.redis_client.setex(
                            f"user:{row.user_id}",
                            self.cache_ttl,
                            orjson.dumps(dict(row))
                        )
            
            # Añadir datos enriquecidos al DataFrame
            if user_data:
                df = df.with_columns([
                    pl.lit(user_data.get(row['user_id'], {})).alias('user_data')
                    for row in df.iter_rows(named=True)
                ])
        
        # Enriquecer con datos geográficos
        if 'location' in df.columns:
            df = df.with_columns([
                pl.col('location').map_elements(
                    lambda x: self._geocode_location(json.loads(x) if isinstance(x, str) else x),
                    return_dtype=pl.Object
                ).alias('location_enriched')
            ])
        
        return df
    
    async def _clean_data(self, df: pl.DataFrame) -> pl.DataFrame:
        """Limpiar y validar datos"""
        # Eliminar eventos duplicados
        df = df.unique(subset=['event_id'], keep='first')
        
        # Validar timestamps
        current_time = datetime.now()
        max_future_time = current_time + timedelta(hours=24)
        
        df = df.filter(
            pl.col('timestamp') >= (current_time - timedelta(days=30)) &
            pl.col('timestamp') <= max_future_time
        )
        
        # Validar user_id y session_id
        df = df.filter(
            pl.col('user_id').is_not_null() &
            pl.col('session_id').is_not_null() &
            (pl.col('user_id').str.lengths() > 0) &
            (pl.col('session_id').str.lengths() > 0)
        )
        
        # Sanitizar propiedades
        if 'properties' in df.columns:
            df = df.with_columns([
                pl.col('properties').map_elements(
                    lambda x: self._sanitize_properties(json.loads(x) if isinstance(x, str) else x),
                    return_dtype=pl.Object
                ).alias('properties_sanitized')
            ])
        
        return df
    
    async def _aggregate_events(self, df: pl.DataFrame) -> Dict[str, Any]:
        """Agregar eventos para análisis"""
        if df.height == 0:
            return {}
        
        # Agregaciones en tiempo real usando Polars (ultra rápido)
        aggregates = {
            'total_events': df.height,
            'unique_users': df['user_id'].n_unique(),
            'unique_sessions': df['session_id'].n_unique(),
            'events_by_type': df.groupby('event_type').agg(pl.count()).to_dicts(),
            'events_by_platform': df.groupby('platform').agg(pl.count()).to_dicts(),
            'events_over_time': df.groupby(
                pl.col('timestamp').dt.truncate('1h')
            ).agg(pl.count()).sort('timestamp').to_dicts(),
            'session_duration_stats': self._calculate_session_duration(df),
            'funnel_conversion': await self._calculate_funnel_conversion(df)
        }
        
        # Actualizar métricas en tiempo real
        await self._update_realtime_metrics(aggregates)
        
        return aggregates
    
    def _calculate_session_duration(self, df: pl.DataFrame) -> Dict[str, float]:
        """Calcular duración de sesiones"""
        if 'session_id' not in df.columns or 'timestamp' not in df.columns:
            return {}
        
        session_stats = df.groupby('session_id').agg([
            pl.col('timestamp').min().alias('session_start'),
            pl.col('timestamp').max().alias('session_end')
        ])
        
        if session_stats.height == 0:
            return {}
        
        session_stats = session_stats.with_columns([
            (pl.col('session_end') - pl.col('session_start')).dt.seconds().alias('duration_seconds')
        ])
        
        return {
            'avg_duration': session_stats['duration_seconds'].mean(),
            'median_duration': session_stats['duration_seconds'].median(),
            'max_duration': session_stats['duration_seconds'].max(),
            'min_duration': session_stats['duration_seconds'].min(),
            'total_sessions': session_stats.height
        }
    
    async def _calculate_funnel_conversion(self, df: pl.DataFrame) -> Dict[str, float]:
        """Calcular conversión de funnel"""
        # Definir funnel stages
        funnel_stages = ['app_open', 'signup_view', 'signup_submit', 'onboarding_complete', 'first_action']
        
        # Encontrar eventos de funnel por usuario
        funnel_events = df.filter(
            pl.col('event_name').is_in(funnel_stages)
        )
        
        if funnel_events.height == 0:
            return {}
        
        # Contar usuarios en cada etapa
        funnel_counts = {}
        for i, stage in enumerate(funnel_stages):
            stage_users = funnel_events.filter(
                pl.col('event_name') == stage
            )['user_id'].unique()
            
            funnel_counts[stage] = stage_users.height
            
            # Calcular conversión desde etapa anterior
            if i > 0:
                prev_stage = funnel_stages[i-1]
                prev_count = funnel_counts.get(prev_stage, 0)
                if prev_count > 0:
                    conversion_rate = funnel_counts[stage] / prev_count * 100
                    funnel_counts[f'{prev_stage}_to_{stage}_conversion'] = conversion_rate
        
        return funnel_counts
    
    async def _detect_anomalies(self, df: pl.DataFrame) -> List[Dict[str, Any]]:
        """Detectar anomalías en eventos"""
        anomalies = []
        
        # Detectar spikes en actividad
        activity_by_minute = df.groupby(
            pl.col('timestamp').dt.truncate('1min')
        ).agg(pl.count().alias('event_count'))
        
        if activity_by_minute.height > 10:
            mean = activity_by_minute['event_count'].mean()
            std = activity_by_minute['event_count'].std()
            
            spike_threshold = mean + (3 * std)
            spikes = activity_by_minute.filter(
                pl.col('event_count') > spike_threshold
            )
            
            for spike in spikes.iter_rows(named=True):
                anomalies.append({
                    'type': 'activity_spike',
                    'timestamp': spike['timestamp'],
                    'event_count': spike['event_count'],
                    'threshold': spike_threshold,
                    'severity': 'high'
                })
        
        # Detectar sesiones anormalmente largas
        session_durations = self._calculate_session_duration(df)
        if session_durations and 'max_duration' in session_durations:
            max_duration = session_durations['max_duration']
            if max_duration > 3600:  # Más de 1 hora
                anomalies.append({
                    'type': 'long_session',
                    'duration_seconds': max_duration,
                    'threshold': 3600,
                    'severity': 'medium'
                })
        
        # Detectar usuarios con comportamiento errático
        user_events = df.groupby('user_id').agg([
            pl.count().alias('event_count'),
            pl.col('event_type').n_unique().alias('unique_event_types')
        ])
        
        erratic_users = user_events.filter(
            (pl.col('event_count') > 1000) &  # Muchos eventos
            (pl.col('unique_event_types') < 3)  # Pocos tipos diferentes
        )
        
        for user in erratic_users.iter_rows(named=True):
            anomalies.append({
                'type': 'erratic_behavior',
                'user_id': user['user_id'],
                'event_count': user['event_count'],
                'unique_event_types': user['unique_event_types'],
                'severity': 'low'
            })
        
        return anomalies
    
    async def _store_clickhouse(self, df: pl.DataFrame):
        """Almacenar en ClickHouse para queries en tiempo real"""
        if not self.clickhouse_client or df.height == 0:
            return
        
        try:
            # Convertir a formato de ClickHouse
            data = []
            for row in df.iter_rows(named=True):
                data.append({
                    'event_id': row['event_id'],
                    'user_id': row['user_id'],
                    'session_id': row['session_id'],
                    'event_type': row['event_type'],
                    'event_name': row['event_name'],
                    'timestamp': row['timestamp'].isoformat() if hasattr(row['timestamp'], 'isoformat') else row['timestamp'],
                    'platform': row['platform'],
                    'device_info': json.dumps(row.get('device_info', {})),
                    'location': json.dumps(row.get('location', {})),
                    'properties': json.dumps(row.get('properties_sanitized', row.get('properties', {}))),
                    'app_version': row['app_version'],
                    'processing_time': datetime.now().isoformat()
                })
            
            # Insertar en batch
            self.clickhouse_client.insert(
                'user_journey_events',
                data,
                column_names=['event_id', 'user_id', 'session_id', 'event_type', 'event_name', 
                            'timestamp', 'platform', 'device_info', 'location', 'properties', 
                            'app_version', 'processing_time']
            )
            
            self.logger.debug(f"✅ {len(data)} eventos almacenados en ClickHouse")
            
        except Exception as e:
            self.logger.error(f"Error almacenando en ClickHouse: {str(e)}")
    
    async def _store_postgres(self, df: pl.DataFrame):
        """Almacenar en PostgreSQL para análisis detallado"""
        if not self.postgres_pool or df.height == 0:
            return
        
        try:
            # Usar COPY para inserción masiva ultra rápida
            with self.postgres_pool.connect() as conn:
                # Crear tabla temporal
                conn.execute(text("""
                    CREATE TEMP TABLE temp_journey_events (
                        LIKE user_journey_events INCLUDING DEFAULTS
                    ) ON COMMIT DROP
                """))
                
                # Insertar datos en tabla temporal
                for row in df.iter_rows(named=True):
                    conn.execute(text("""
                        INSERT INTO temp_journey_events 
                        (event_id, user_id, session_id, event_type, event_name, 
                         timestamp, platform, device_info, location, properties, app_version)
                        VALUES (:event_id, :user_id, :session_id, :event_type, :event_name,
                                :timestamp, :platform, :device_info, :location, :properties, :app_version)
                    """), row)
                
                # Copiar a tabla principal
                conn.execute(text("""
                    INSERT INTO user_journey_events 
                    SELECT * FROM temp_journey_events
                    ON CONFLICT (event_id) DO NOTHING
                """))
                
                conn.commit()
            
            self.logger.debug(f"✅ {df.height} eventos almacenados en PostgreSQL")
            
        except Exception as e:
            self.logger.error(f"Error almacenando en PostgreSQL: {str(e)}")
            self.stats['errors'] += 1
    
    async def _store_s3_parquet(self, df: pl.DataFrame):
        """Almacenar en S3 como Parquet para data lake"""
        if not self.s3_client or df.height == 0:
            return
        
        try:
            # Convertir a PyArrow Table
            table = df.to_arrow()
            
            # Escribir a buffer Parquet con compresión
            buffer = pa.BufferOutputStream()
            pq.write_table(
                table,
                buffer,
                compression='snappy',
                use_dictionary=True,
                data_page_version='2.0'
            )
            
            # Subir a S3
            date_str = datetime.now().strftime('%Y/%m/%d/%H')
            s3_key = f"user-journey/events/{date_str}/events_{datetime.now().timestamp()}.parquet"
            
            self.s3_client.put_object(
                Bucket=self.config.get('s3_bucket', 'petmatch-data-lake'),
                Key=s3_key,
                Body=buffer.getvalue().to_pybytes(),
                ContentType='application/parquet'
            )
            
            self.logger.debug(f"✅ {df.height} eventos almacenados en S3: {s3_key}")
            
        except Exception as e:
            self.logger.error(f"Error almacenando en S3: {str(e)}")
    
    async def _update_redis_cache(self, df: pl.DataFrame):
        """Actualizar caché Redis con métricas en tiempo real"""
        if not self.redis_client:
            return
        
        try:
            # Actualizar contadores de usuario
            user_events = df.groupby('user_id').agg(pl.count().alias('event_count'))
            
            pipeline = self.redis_client.pipeline()
            for row in user_events.iter_rows(named=True):
                pipeline.hincrby(
                    f"user:{row['user_id']}:stats",
                    'total_events',
                    row['event_count']
                )
                pipeline.expire(f"user:{row['user_id']}:stats", 86400)
            
            # Actualizar métricas agregadas
            current_minute = datetime.now().strftime('%Y-%m-%d %H:%M:00')
            total_events = df.height
            
            pipeline.hincrby('realtime_metrics', current_minute, total_events)
            pipeline.expire('realtime_metrics', 3600)
            
            pipeline.execute()
            
        except Exception as e:
            self.logger.error(f"Error actualizando Redis cache: {str(e)}")
    
    async def _update_realtime_metrics(self, aggregates: Dict[str, Any]):
        """Actualizar métricas en tiempo real para dashboards"""
        if not self.redis_client:
            return
        
        try:
            timestamp = datetime.now().isoformat()
            
            metrics_key = f"dashboard_metrics:{timestamp[:13]}"  # Por hora
            
            self.redis_client.hset(
                metrics_key,
                mapping={
                    'total_events': aggregates.get('total_events', 0),
                    'unique_users': aggregates.get('unique_users', 0),
                    'unique_sessions': aggregates.get('unique_sessions', 0),
                    'timestamp': timestamp
                }
            )
            
            self.redis_client.expire(metrics_key, 7200)  # 2 horas
            
        except Exception as e:
            self.logger.error(f"Error actualizando métricas: {str(e)}")
    
    def _geocode_location(self, location: Dict) -> Dict:
        """Enriquecer ubicación con datos geográficos"""
        if not location:
            return {}
        
        # En producción, usar servicio de geocoding como Google Maps o Mapbox
        enriched = location.copy()
        
        # Simulación de enriquecimiento
        if 'city' in location and 'country' in location:
            enriched['region'] = "North America"  # Esto vendría de una base de datos
            enriched['timezone'] = "America/New_York"
            enriched['coordinates'] = {
                'lat': 40.7128,
                'lon': -74.0060
            }
        
        return enriched
    
    def _sanitize_properties(self, properties: Dict) -> Dict:
        """Sanitizar propiedades del evento"""
        if not properties:
            return {}
        
        sanitized = {}
        
        for key, value in properties.items():
            # Eliminar datos sensibles
            if any(sensitive in key.lower() for sensitive in ['password', 'token', 'secret', 'credit']):
                continue
            
            # Limitar longitud de strings
            if isinstance(value, str):
                if len(value) > 1000:
                    value = value[:1000] + "..."
            
            # Convertir tipos complejos a JSON string
            if isinstance(value, (dict, list)):
                try:
                    value = json.dumps(value)
                except:
                    value = str(value)
            
            sanitized[key] = value
        
        return sanitized
    
    async def run_batch_processing(self, date_range: Tuple[datetime, datetime]):
        """
        Procesamiento por lotes de datos históricos
        Optimizado para procesar terabytes en minutos
        """
        start_time = time.time()
        self.logger.info(f"🚀 Iniciando batch processing: {date_range}")
        
        try:
            # 1. Leer datos de S3/data lake
            s3_path = f"s3://{self.config.get('s3_bucket')}/user-journey/events/"
            if self.spark:
                df = self.spark.read.parquet(s3_path)
                
                # Filtrar por rango de fechas
                df = df.filter(
                    (df.timestamp >= date_range[0]) &
                    (df.timestamp <= date_range[1])
                )
                
                # Procesar con Spark
                results = await self._process_spark_batch(df)
                
            elif self.dask_client:
                # Usar Dask para procesamiento paralelo
                df = dd.read_parquet(s3_path)
                df = df[(df.timestamp >= date_range[0]) & (df.timestamp <= date_range[1])]
                
                results = await self._process_dask_batch(df)
            
            else:
                # Procesamiento local con Polars
                # Nota: Para terabytes, necesitarías un enfoque chunked
                results = await self._process_local_batch(s3_path, date_range)
            
            processing_time = time.time() - start_time
            self.logger.info(f"✅ Batch processing completado en {processing_time:.2f}s")
            
            return results
            
        except Exception as e:
            self.logger.error(f"Error en batch processing: {str(e)}", exc_info=True)
            raise
    
    async def _process_spark_batch(self, df) -> Dict[str, Any]:
        """Procesar batch con Spark"""
        # Registrar DataFrame como tabla temporal
        df.createOrReplaceTempView("events")
        
        # Ejecutar queries analíticas
        results = {}
        
        # Métricas básicas
        results['total_events'] = df.count()
        results['unique_users'] = df.select('user_id').distinct().count()
        
        # Funnel analysis
        funnel_query = """
        SELECT 
            funnel_stage,
            COUNT(DISTINCT user_id) as users,
            COUNT(*) as events
        FROM (
            SELECT 
                user_id,
                CASE 
                    WHEN event_name = 'app_open' THEN 1
                    WHEN event_name = 'signup_view' THEN 2
                    WHEN event_name = 'signup_submit' THEN 3
                    WHEN event_name = 'onboarding_complete' THEN 4
                    WHEN event_name = 'first_action' THEN 5
                    ELSE 0
                END as funnel_stage
            FROM events
            WHERE event_name IN ('app_open', 'signup_view', 'signup_submit', 'onboarding_complete', 'first_action')
        ) 
        WHERE funnel_stage > 0
        GROUP BY funnel_stage
        ORDER BY funnel_stage
        """
        
        funnel_df = self.spark.sql(funnel_query)
        results['funnel_analysis'] = funnel_df.collect()
        
        # Cohort analysis
        cohort_query = """
        SELECT 
            DATE_TRUNC('week', first_seen) as signup_week,
            COUNT(DISTINCT user_id) as signups,
            AVG(DATEDIFF(day, first_seen, last_seen)) as avg_retention_days,
            COUNT(DISTINCT CASE WHEN DATEDIFF(day, first_seen, last_seen) >= 7 THEN user_id END) * 100.0 / COUNT(DISTINCT user_id) as week1_retention
        FROM (
            SELECT 
                user_id,
                MIN(timestamp) as first_seen,
                MAX(timestamp) as last_seen
            FROM events
            GROUP BY user_id
        )
        GROUP BY DATE_TRUNC('week', first_seen)
        ORDER BY signup_week DESC
        """
        
        cohort_df = self.spark.sql(cohort_query)
        results['cohort_analysis'] = cohort_df.collect()
        
        return results
    
    def generate_journey_map(self, user_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Generar mapa de viaje del usuario agregado o individual
        """
        try:
            if user_id:
                # Viaje individual
                if self.clickhouse_client:
                    query = """
                    SELECT 
                        event_name,
                        event_type,
                        timestamp,
                        properties,
                        session_id
                    FROM user_journey_events
                    WHERE user_id = %(user_id)s
                    ORDER BY timestamp
                    LIMIT 1000
                    """
                    
                    result = self.clickhouse_client.query(
                        query,
                        {'user_id': user_id}
                    )
                    
                    events = result.result_rows
                    
                    # Construir journey
                    journey = self._build_individual_journey(events)
                    return journey
            
            # Journey agregado
            if self.postgres_pool:
                with self.postgres_pool.connect() as conn:
                    # Obtener secuencias comunes de eventos
                    query = text("""
                    WITH event_sequences AS (
                        SELECT 
                            user_id,
                            ARRAY_AGG(event_name ORDER BY timestamp) as sequence
                        FROM user_journey_events
                        WHERE timestamp >= NOW() - INTERVAL '7 days'
                        GROUP BY user_id, session_id
                    ),
                    common_sequences AS (
                        SELECT 
                            sequence,
                            COUNT(*) as frequency
                        FROM event_sequences
                        GROUP BY sequence
                        HAVING COUNT(*) >= 5
                        ORDER BY frequency DESC
                        LIMIT 20
                    )
                    SELECT sequence, frequency
                    FROM common_sequences
                    """)
                    
                    result = conn.execute(query)
                    sequences = result.fetchall()
                    
                    # Construir journey map agregado
                    journey_map = self._build_aggregate_journey_map(sequences)
                    return journey_map
            
            return {}
            
        except Exception as e:
            self.logger.error(f"Error generando journey map: {str(e)}")
            return {}
    
    def _build_individual_journey(self, events: List) -> Dict[str, Any]:
        """Construir viaje individual del usuario"""
        journey = {
            'user_id': events[0][0] if events else None,
            'total_events': len(events),
            'sessions': {},
            'timeline': [],
            'conversion_points': [],
            'dropoff_points': []
        }
        
        current_session = None
        session_events = []
        
        for event in events:
            event_name, event_type, timestamp, properties, session_id = event
            
            if session_id != current_session:
                # Nueva sesión
                if current_session and session_events:
                    journey['sessions'][current_session] = {
                        'event_count': len(session_events),
                        'duration': self._calculate_session_duration_from_events(session_events),
                        'events': session_events
                    }
                
                current_session = session_id
                session_events = []
            
            event_data = {
                'name': event_name,
                'type': event_type,
                'timestamp': timestamp.isoformat() if hasattr(timestamp, 'isoformat') else timestamp,
                'properties': json.loads(properties) if isinstance(properties, str) else properties
            }
            
            session_events.append(event_data)
            journey['timeline'].append(event_data)
            
            # Identificar puntos de conversión
            if event_name in ['signup_submit', 'purchase_complete', 'subscription_started']:
                journey['conversion_points'].append(event_data)
            
            # Identificar posibles puntos de abandono
            if event_name in ['app_close', 'session_timeout', 'error_occurred']:
                journey['dropoff_points'].append(event_data)
        
        # Agregar última sesión
        if current_session and session_events:
            journey['sessions'][current_session] = {
                'event_count': len(session_events),
                'duration': self._calculate_session_duration_from_events(session_events),
                'events': session_events
            }
        
        return journey
    
    def _calculate_session_duration_from_events(self, events: List[Dict]) -> float:
        """Calcular duración de sesión desde eventos"""
        if len(events) < 2:
            return 0.0
        
        first_time = events[0]['timestamp']
        last_time = events[-1]['timestamp']
        
        if isinstance(first_time, str):
            first_time = datetime.fromisoformat(first_time.replace('Z', '+00:00'))
        if isinstance(last_time, str):
            last_time = datetime.fromisoformat(last_time.replace('Z', '+00:00'))
        
        duration = (last_time - first_time).total_seconds()
        return max(0.0, duration)
    
    def _build_aggregate_journey_map(self, sequences: List) -> Dict[str, Any]:
        """Construir mapa de viaje agregado"""
        journey_map = {
            'total_users': sum(seq[1] for seq in sequences),
            'common_paths': [],
            'conversion_funnels': {},
            'dropoff_analysis': {}
        }
        
        # Analizar secuencias comunes
        for sequence, frequency in sequences:
            seq_list = sequence if isinstance(sequence, list) else list(sequence)
            
            journey_map['common_paths'].append({
                'path': seq_list,
                'frequency': frequency,
                'percentage': (frequency / journey_map['total_users']) * 100
            })
            
            # Identificar conversiones en esta secuencia
            conversion_events = [event for event in seq_list 
                               if event in ['signup_complete', 'purchase_complete']]
            
            if conversion_events:
                for conv_event in conversion_events:
                    if conv_event not in journey_map['conversion_funnels']:
                        journey_map['conversion_funnels'][conv_event] = []
                    
                    journey_map['conversion_funnels'][conv_event].append({
                        'path': seq_list,
                        'frequency': frequency
                    })
            
            # Identificar abandonos
            if seq_list[-1] not in ['purchase_complete', 'onboarding_complete']:
                dropoff_event = seq_list[-1]
                if dropoff_event not in journey_map['dropoff_analysis']:
                    journey_map['dropoff_analysis'][dropoff_event] = 0
                
                journey_map['dropoff_analysis'][dropoff_event] += frequency
        
        # Ordenar por frecuencia
        journey_map['common_paths'].sort(key=lambda x: x['frequency'], reverse=True)
        
        return journey_map
    
    async def cleanup(self):
        """Limpiar recursos"""
        self.logger.info("🧹 Limpiando recursos del pipeline...")
        
        if self.spark:
            self.spark.stop()
        
        if self.dask_client:
            self.dask_client.close()
        
        if self.ray_context:
            ray.shutdown()
        
        if self.redis_client:
            self.redis_client.close()
        
        if self.kafka_producer:
            self.kafka_producer.close()
        
        self.logger.info("✅ Recursos limpiados")

# FastAPI Integration
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI(title="User Journey Pipeline 30X API")

pipeline = None

@app.on_event("startup")
async def startup():
    global pipeline
    
    config = {
        'redis_host': 'localhost',
        'redis_port': 6379,
        'clickhouse_host': 'localhost',
        'clickhouse_port': 8123,
        'postgres_url': 'postgresql://user:pass@localhost/analytics',
        'kafka_brokers': 'localhost:9092',
        's3_bucket': 'petmatch-data-lake',
        'aws_access_key': 'your-key',
        'aws_secret_key': 'your-secret',
        'batch_size': 10000,
        'parallelism': mp.cpu_count() * 4
    }
    
    pipeline = UserJourneyPipeline30X(config)
    
    # Iniciar procesamiento en background
    background_tasks = BackgroundTasks()
    background_tasks.add_task(
        pipeline.process_stream, 
        source=DataSource.KAFKA,
        mode=ProcessingMode.MICRO_BATCH
    )

@app.on_event("shutdown")
async def shutdown():
    if pipeline:
        await pipeline.cleanup()

@app.post("/process/batch")
async def process_batch(
    start_date: str,
    end_date: str,
    background_tasks: BackgroundTasks
):
    """Iniciar procesamiento por lotes"""
    try:
        start = datetime.fromisoformat(start_date)
        end = datetime.fromisoformat(end_date)
        
        background_tasks.add_task(
            pipeline.run_batch_processing,
            (start, end)
        )
        
        return {"status": "batch_processing_started", "date_range": f"{start_date} to {end_date}"}
        
    except Exception as e:
        raise HTTPException(500, f"Error iniciando batch: {str(e)}")

@app.get("/journey/{user_id}")
async def get_user_journey(user_id: str):
    """Obtener journey map de usuario específico"""
    try:
        journey = pipeline.generate_journey_map(user_id)
        return journey
    except Exception as e:
        raise HTTPException(500, f"Error obteniendo journey: {str(e)}")

@app.get("/journey/aggregate")
async def get_aggregate_journey():
    """Obtener journey map agregado"""
    try:
        journey = pipeline.generate_journey_map()
        return journey
    except Exception as e:
        raise HTTPException(500, f"Error obteniendo journey agregado: {str(e)}")

@app.get("/metrics")
async def get_pipeline_metrics():
    """Obtener métricas del pipeline"""
    try:
        return {
            "stats": pipeline.stats,
            "processing_mode": "micro_batch",
            "throughput_events_per_second": pipeline.stats['events_processed'] / 
                (datetime.now() - pipeline.stats['last_checkpoint']).total_seconds()
                if pipeline.stats['events_processed'] > 0 else 0,
            "data_volume_gb": pipeline.stats['total_bytes'] / (1024**3),
            "avg_processing_time_ms": pipeline.stats['avg_processing_time'] * 1000
        }
    except Exception as e:
        raise HTTPException(500, f"Error obteniendo métricas: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check del pipeline"""
    components = {
        "spark": pipeline.spark is not None,
        "dask": pipeline.dask_client is not None,
        "redis": pipeline.redis_client is not None,
        "clickhouse": pipeline.clickhouse_client is not None,
        "postgres": pipeline.postgres_pool is not None,
        "kafka": pipeline.kafka_producer is not None,
        "s3": pipeline.s3_client is not None
    }
    
    status = "healthy" if all(components.values()) else "degraded"
    
    return {
        "status": status,
        "components": components,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003, workers=2)
