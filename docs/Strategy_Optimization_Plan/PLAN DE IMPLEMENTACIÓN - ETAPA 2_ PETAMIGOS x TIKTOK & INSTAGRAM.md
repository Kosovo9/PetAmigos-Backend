# PLAN DE IMPLEMENTACIÓN - ETAPA 2: PETAMIGOS x TIKTOK & INSTAGRAM

**Objetivo:** Integrar funcionalidades de contenido multimedia efímero y de formato corto, inspiradas en TikTok e Instagram. Este documento detalla la estructura de carpetas y archivos que Kimi.com debe generar.

---

## ESTRUCTURA DE CARPETAS Y ARCHIVOS (NUEVOS MICROSERVICIOS)

```
petamigos-global/
├── services/                   # Contenedor de todos los microservicios
│   ├── ... (servicios existentes)
│   ├── 4-story-service/        # Stories tipo Instagram
│   ├── 5-reel-service/         # Videos cortos tipo TikTok/Reels
│   ├── 12-media-service/       # Procesamiento y storage de media
│   └── 17-recommendation-service/ # Algoritmo de recomendación para Reels
│
├── packages/
│   └── ... (paquetes existentes)
│
├── client/                     # Frontend principal (Next.js)
│
└── docker-compose.yml          # Actualizado con los nuevos servicios
```

---

## DETALLE DE ARCHIVOS A GENERAR POR KIMI.COM

### 1. `services/4-story-service/`

**Propósito:** Gestionar la creación, visualización y expiración de contenido efímero (24 horas) similar a las Stories de Instagram.

- **`src/index.ts`**: Punto de entrada del servicio. Inicia el servidor Fastify.
- **`src/routes/story.routes.ts`**: Rutas CRUD para stories (`/stories`, `/stories/:id`, `/users/:userId/stories`).
- **`src/controllers/story.controller.ts`**: Lógica para crear, obtener (por usuario y por ID), y eliminar stories. También una ruta para registrar una vista de una story.
- **`src/models/story.model.ts`**: Consultas a la base de datos para la tabla `stories`.
- **`src/services/story.service.ts`**: Lógica de negocio, como la validación de que un usuario solo puede tener una story activa a la vez (o un conjunto de slides).
- **`src/jobs/story.cleanup.ts`**: Un job recurrente (usando `node-cron` o similar) que se ejecuta cada hora para eliminar las stories que ya expiraron (con más de 24 horas).
- **`package.json`**: Dependencias (`fastify`, `pg`, `node-cron`).
- **`Dockerfile`**: Para containerizar el servicio.

### 2. `services/5-reel-service/`

**Propósito:** Gestionar videos de formato corto (verticales) con un feed de descubrimiento algorítmico, similar a TikTok y Reels.

- **`src/index.ts`**: Punto de entrada del servicio.
- **`src/routes/reel.routes.ts`**: Rutas CRUD para reels (`/reels`, `/reels/:id`) y la ruta principal del feed (`/reels/feed`).
- **`src/controllers/reel.controller.ts`**: Lógica para subir, obtener, y interactuar con los reels (likes, comentarios).
- **`src/controllers/feed.controller.ts`**: Lógica para obtener el feed de reels, interactuando con el `recommendation-service`.
- **`src/models/reel.model.ts`**: Consultas a la base de datos para la tabla `reels`.
- **`src/services/reel.service.ts`**: Lógica de negocio, como la validación de formato de video, duración, etc.
- **`package.json`**: Dependencias (`fastify`, `pg`).
- **`Dockerfile`**: Para containerizar el servicio.

### 3. `services/12-media-service/`

**Propósito:** Centralizar toda la lógica de subida y procesamiento de archivos multimedia para evitar duplicación en otros servicios.

- **`src/index.ts`**: Punto de entrada del servicio.
- **`src/routes/upload.routes.ts`**: Ruta principal (`/upload`) que acepta archivos (imágenes, videos).
- **`src/controllers/upload.controller.ts`**: Lógica para manejar la subida de archivos (`multipart/form-data`).
- **`src/services/image.service.ts`**: Lógica para procesar imágenes: redimensionar, comprimir, convertir a WebP, generar thumbnails. Usa la librería `sharp`.
- **`src/services/video.service.ts`**: Lógica para procesar videos. Encola un trabajo para transcodificación.
- **`src/services/storage.service.ts`**: Lógica para subir el archivo procesado a un object storage (MinIO).
- **`src/workers/video.worker.ts`**: Worker que procesa videos en segundo plano usando `BullMQ` y `ffmpeg`. Transcodifica a H.264, genera diferentes calidades (480p, 720p, 1080p) y extrae un thumbnail.
- **`package.json`**: Dependencias (`fastify`, `multer`, `sharp`, `bullmq`, `@minio/client`).
- **`Dockerfile`**: Para containerizar el servicio.

### 4. `services/17-recommendation-service/`

**Propósito:** Contener el algoritmo de recomendación para el feed de Reels. Es un servicio sin estado que recibe datos y devuelve una lista ordenada de IDs de reels.

- **`src/index.ts`**: Punto de entrada del servicio.
- **`src/routes/recommend.routes.ts`**: Ruta principal (`/recommend/reels`) que recibe un `userId` y devuelve una lista de `reelId`s.
- **`src/controllers/recommend.controller.ts`**: Orquesta la obtención de datos y la ejecución del algoritmo.
- **`src/services/recommendation.service.ts`**: Contiene la lógica del algoritmo de recomendación.
    - **`get_candidate_reels()`**: Obtiene una lista de reels candidatos (ej. de las últimas 48 horas).
    - **`get_user_features()`**: Obtiene el perfil de intereses del usuario (ej. hashtags de reels que le gustaron, perfiles que sigue).
    - **`get_reel_features()`**: Obtiene las características de cada reel (hashtags, sonido, creador).
    - **`rank_reels()`**: Calcula un score de relevancia para cada reel basado en la similitud coseno entre los features del usuario y los del reel. Devuelve una lista ordenada de `reelId`s.
- **`src/services/feature.service.ts`**: Lógica para convertir texto (hashtags, captions) en vectores numéricos (embeddings) usando `sentence-transformers`.
- **`package.json`**: Dependencias (`fastify`, `pg`, `@xenova/transformers`).
- **`Dockerfile`**: Para containerizar el servicio.

### 5. `client/` (Frontend - Archivos a Agregar/Modificar)

**Instrucción para Kimi.com:** Agregar los nuevos componentes de UI para Stories y Reels.

- **`src/components/stories/StoryViewer.tsx`**: Componente que muestra las stories en pantalla completa, con barras de progreso y navegación (tap left/right).
- **`src/components/stories/StoryTray.tsx`**: Barra horizontal en la parte superior del feed principal que muestra los avatares de los usuarios con stories activas.
- **`src/components/reels/ReelPlayer.tsx`**: Componente que muestra el feed de Reels. Ocupa toda la pantalla y permite scroll vertical infinito. Cada video se reproduce automáticamente.
- **`src/components/reels/Reel.tsx`**: Componente para un solo video de Reel, incluyendo los botones de like, comment, share y la información del creador.
- **`src/app/(main)/reels/page.tsx`**: Página dedicada al feed de Reels, que renderiza el `ReelPlayer`.
- **`src/app/(main)/stories/[userId]/page.tsx`**: Página para ver las stories de un usuario específico.

---

## INSTRUCCIONES ADICIONALES PARA KIMI.COM

1.  **Procesamiento de Video:** El `media-service` es crítico. Debe usar `ffmpeg` para la transcodificación. La subida de un reel debe devolver una respuesta inmediata al usuario, mientras el video se procesa en segundo plano. El estado del reel en la DB debe ser `PROCESSING` y cambiar a `READY` cuando el worker termine.
2.  **Algoritmo de Recomendación:** La primera versión del `recommendation-service` puede ser simple. Puede basarse en la popularidad (más likes/views) y luego evolucionar para usar embeddings y similitud coseno.
3.  **Optimización del Frontend:** El feed de Reels (`ReelPlayer`) debe ser altamente optimizado. Usar `react-window` o `react-virtual` para renderizar solo los videos visibles y precargar el siguiente y el anterior para un scroll fluido.
4.  **Base de Datos:** Kimi debe generar los archivos de migración en `packages/db-main/migrations/` para agregar las nuevas tablas (`stories`, `reels`, `story_views`, etc.).

Este plan cubre la adición de funcionalidades de contenido multimedia, sentando las bases para una experiencia de usuario moderna y competitiva.
