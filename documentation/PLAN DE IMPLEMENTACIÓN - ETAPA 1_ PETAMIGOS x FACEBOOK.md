# PLAN DE IMPLEMENTACIÓN - ETAPA 1: PETAMIGOS x FACEBOOK

**Objetivo:** Integrar las funcionalidades principales de una red social tipo Facebook en la plataforma PetAmigos. Este documento detalla la estructura de carpetas y archivos que Kimi.com debe generar.

---

## ESTRUCTURA DE CARPETAS Y ARCHIVOS (MICROSERVICIOS)

```
petamigos-global/
├── services/                   # Contenedor de todos los microservicios
│   ├── 1-auth-service/         # Autenticación y registro
│   ├── 2-user-service/         # Perfiles y amigos
│   ├── 3-social-service/       # Feed, posts, comentarios, reacciones
│   ├── 8-group-service/        # Grupos y comunidades
│   ├── 9-marketplace-service/  # Compra/venta de productos
│   ├── 10-notification-service/ # Notificaciones
│   └── 18-event-service/       # Eventos
│
├── packages/                   # Paquetes compartidos (código, config, etc.)
│   ├── db-main/                # Esquema y migraciones de PostgreSQL
│   ├── config-main/            # Configuración centralizada (env, etc.)
│   ├── types-main/             # Tipos de TypeScript compartidos
│   └── ui-main/                # Componentes de UI compartidos (React)
│
├── client/                     # Frontend principal (Next.js)
│
└── docker-compose.yml          # Orquestación de desarrollo local
```

---

## DETALLE DE ARCHIVOS A GENERAR POR KIMI.COM

### 1. `services/1-auth-service/`

**Propósito:** Gestionar todo lo relacionado con la autenticación, registro y seguridad de cuentas de usuario.

- **`src/index.ts`**: Punto de entrada del servicio. Inicia el servidor Fastify, conecta a la base de datos y registra las rutas.
- **`src/routes/auth.routes.ts`**: Define las rutas de la API (`/register`, `/login`, `/refresh`, `/logout`, `/verify-email`, `/forgot-password`).
- **`src/controllers/auth.controller.ts`**: Lógica de negocio para cada ruta. Orquesta la validación, interacción con la base de datos y generación de tokens.
- **`src/services/token.service.ts`**: Lógica para generar, firmar y verificar tokens JWT (access y refresh tokens).
- **`src/services/password.service.ts`**: Lógica para hashear y comparar contraseñas usando `bcryptjs`.
- **`src/services/email.service.ts`**: Lógica para enviar correos electrónicos (verificación, reseteo de contraseña) usando `nodemailer`.
- **`src/validators/auth.validator.ts`**: Esquemas de validación de datos de entrada (usando `zod` o `joi`) para el registro, login, etc.
- **`package.json`**: Dependencias (`fastify`, `jsonwebtoken`, `bcryptjs`, `nodemailer`, `pg`, `zod`).
- **`Dockerfile`**: Para containerizar el servicio.

### 2. `services/2-user-service/`

**Propósito:** Gestionar perfiles de usuario, relaciones de amistad y configuraciones.

- **`src/index.ts`**: Punto de entrada del servicio.
- **`src/routes/user.routes.ts`**: Rutas para (`/users/:id`, `/users/me`, `/users/search`).
- **`src/routes/friendship.routes.ts`**: Rutas para (`/friends`, `/friends/requests`, `/friends/add`, `/friends/remove`, `/friends/block`).
- **`src/controllers/user.controller.ts`**: Lógica para obtener, actualizar y buscar perfiles.
- **`src/controllers/friendship.controller.ts`**: Lógica para gestionar solicitudes de amistad, bloqueos, etc.
- **`src/models/user.model.ts`**: Consultas a la base de datos para la tabla `users`.
- **`src/models/friendship.model.ts`**: Consultas a la base de datos para la tabla `friendships`.
- **`package.json`**: Dependencias (`fastify`, `pg`).
- **`Dockerfile`**: Para containerizar el servicio.

### 3. `services/3-social-service/`

**Propósito:** El corazón de la red social. Gestiona posts, comentarios y reacciones.

- **`src/index.ts`**: Punto de entrada del servicio.
- **`src/routes/feed.routes.ts`**: Ruta para (`/feed`) que obtiene el timeline del usuario.
- **`src/routes/post.routes.ts`**: Rutas CRUD para posts (`/posts`, `/posts/:id`).
- **`src/routes/comment.routes.ts`**: Rutas CRUD para comentarios (`/posts/:id/comments`).
- **`src/routes/reaction.routes.ts`**: Rutas para dar/quitar reacciones (`/posts/:id/reactions`, `/comments/:id/reactions`).
- **`src/controllers/feed.controller.ts`**: Lógica para construir el feed del usuario (combinando posts de amigos, grupos, etc.).
- **`src/controllers/post.controller.ts`**: Lógica para crear, leer, actualizar y eliminar posts.
- **`src/controllers/comment.controller.ts`**: Lógica para los comentarios.
- **`src/controllers/reaction.controller.ts`**: Lógica para las reacciones.
- **`src/services/feed.service.ts`**: Lógica de negocio compleja para el algoritmo del feed (inicialmente cronológico, luego algorítmico).
- **`src/services/cache.service.ts`**: Lógica para interactuar con Redis (cachear feeds, contadores, etc.).
- **`src/models/post.model.ts`**: Consultas a la tabla `posts`.
- **`src/models/comment.model.ts`**: Consultas a la tabla `comments`.
- **`src/models/reaction.model.ts`**: Consultas a la tabla `reactions`.
- **`package.json`**: Dependencias (`fastify`, `pg`, `redis`).
- **`Dockerfile`**: Para containerizar el servicio.

### 4. `packages/db-main/`

**Propósito:** Centralizar el esquema de la base de datos y las migraciones.

- **`schema.sql`**: Archivo SQL con la definición completa de todas las tablas (users, posts, comments, etc.) como se definió en el documento de arquitectura.
- **`migrations/`**: Carpeta para las migraciones de la base de datos (usando `node-pg-migrate` o similar).
  - **`001-initial-schema.js`**: Primera migración que crea todas las tablas.

### 5. `packages/config-main/`

**Propósito:** Centralizar la configuración para todos los servicios.

- **`.env.example`**: Archivo de ejemplo con todas las variables de entorno necesarias (DB_HOST, JWT_SECRET, etc.).
- **`index.ts`**: Exporta un objeto de configuración parseado desde `process.env`.

### 6. `packages/types-main/`

**Propósito:** Definir interfaces de TypeScript compartidas para evitar duplicación.

- **`src/user.types.ts`**: Interface `User`.
- **`src/post.types.ts`**: Interfaces `Post`, `Comment`, `Reaction`.
- **`src/index.ts`**: Exporta todos los tipos.

### 7. `client/` (Frontend)

**Instrucción para Kimi.com:** Reestructurar el frontend existente para consumir los nuevos microservicios. Crear componentes reutilizables para el feed, posts, comentarios, etc.

- **`src/components/feed/Feed.tsx`**: Componente principal que muestra el feed.
- **`src/components/feed/Post.tsx`**: Componente para renderizar un solo post.
- **`src/components/feed/Comment.tsx`**: Componente para un solo comentario.
- **`src/components/feed/CreatePost.tsx`**: Formulario para crear un nuevo post.
- **`src/lib/api/`**: Carpeta con funciones para hacer fetch a cada microservicio (`auth.ts`, `user.ts`, `social.ts`).
- **`src/app/(main)/feed/page.tsx`**: Página principal del feed.

---

## INSTRUCCIONES ADICIONALES PARA KIMI.COM

1.  **Framework:** Utilizar **Fastify** en lugar de Express para todos los nuevos servicios de backend para un rendimiento 2x superior.
2.  **Base de Datos:** Todo el código de base de datos debe usar el driver `pg` para PostgreSQL. No usar Mongoose ni MongoDB para los servicios de esta etapa.
3.  **Comunicación entre servicios:** Inicialmente, la comunicación puede ser a través de llamadas API REST directas. En una etapa posterior, se implementará un bus de eventos (event bus).
4.  **Cache:** Implementar caching con **Redis** en el `social-service` para los feeds de usuario. La clave podría ser `feed:{userId}` y el valor una lista de `postId`.
5.  **Estilo de Código:** Seguir las mejores prácticas de TypeScript, con tipos estrictos y configuración de ESLint/Prettier.

Este plan proporciona una base sólida para construir las funcionalidades de Facebook. Una vez completada esta etapa, se procederá con la Etapa 2 (TikTok e Instagram).
