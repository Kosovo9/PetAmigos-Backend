# PLAN DE ACCIÓN DETALLADO - ETAPA 1: FUNCIONALIDADES DE FACEBOOK

**Objetivo:** Generar el código exacto para la fundación social de la plataforma, replicando y mejorando las funcionalidades core de Facebook. Este documento proporciona la estructura de carpetas y archivos que Kimi.com debe generar, con instrucciones precisas para cada archivo.

---

## ESTRUCTURA DE CARPETAS Y ARCHIVOS EXACTA PARA KIMI.COM

```
petamigos-global/
├── services/
│   ├── 1-auth-service/         # Autenticación y registro
│   ├── 2-user-service/         # Perfiles y amistades
│   ├── 3-social-service/       # Feed, posts, comentarios, reacciones
│   ├── 8-group-service/        # Grupos y comunidades
│   ├── 9-marketplace-service/  # Compra/venta entre usuarios
│   ├── 10-notification-service/ # Notificaciones push, in-app, email
│   └── 18-event-service/       # Eventos y RSVP
│
├── packages/
│   ├── db-main/                # Esquema y migraciones de la base de datos
│   ├── config-main/            # Configuración centralizada
│   └── types-main/             # Tipos de TypeScript compartidos
│
├── client/                     # Frontend (Next.js)
│
└── docker-compose.yml          # Orquestación de todos los servicios
```

---

## DETALLE DE ARCHIVOS A GENERAR POR KIMI.COM

### 1. `services/1-auth-service/`

**Propósito:** Gestionar todo el ciclo de vida de autenticación del usuario de forma segura y escalable.

- **`src/index.ts`**: Punto de entrada. Inicia el servidor Fastify, conecta a la DB y registra las rutas.
- **`src/routes/auth.routes.ts`**: Define las rutas: `POST /register`, `POST /login`, `POST /refresh`, `POST /logout`, `POST /verify-email`, `POST /forgot-password`, `POST /reset-password`, `GET /me`.
- **`src/controllers/auth.controller.ts`**: Lógica para cada ruta. Orquesta los servicios.
- **`src/services/token.service.ts`**: Lógica para generar y validar JWTs (access y refresh tokens).
- **`src/services/password.service.ts`**: Lógica para hashear contraseñas con `bcrypt` y compararlas.
- **`src/services/email.service.ts`**: Lógica para enviar emails (verificación, reseteo de contraseña) usando `nodemailer`.
- **`src/validators/auth.validator.ts`**: Esquemas de validación con `zod` para los cuerpos de las peticiones.
- **`package.json`**: Dependencias: `fastify`, `pg`, `jsonwebtoken`, `bcrypt`, `zod`, `nodemailer`.
- **`Dockerfile`**: Para containerizar el servicio.

### 2. `services/2-user-service/`

**Propósito:** Gestionar los perfiles de usuario y las relaciones de amistad.

- **`src/index.ts`**: Punto de entrada del servicio.
- **`src/routes/user.routes.ts`**: Rutas para perfiles: `GET /:username`, `PUT /profile`, `PUT /avatar`.
- **`src/routes/friendship.routes.ts`**: Rutas para amistades: `GET /friends`, `POST /friends/add`, `PUT /friends/accept`, `DELETE /friends/remove`.
- **`src/controllers/user.controller.ts`**: Lógica para obtener y actualizar perfiles.
- **`src/controllers/friendship.controller.ts`**: Lógica para gestionar solicitudes de amistad.
- **`src/models/user.model.ts`**: Consultas a la DB para la tabla `users`.
- **`src/models/friendship.model.ts`**: Consultas a la DB para la tabla `friendships`.
- **`package.json`**: Dependencias: `fastify`, `pg`, `zod`.
- **`Dockerfile`**: Para containerizar el servicio.

### 3. `services/3-social-service/`

**Propósito:** El corazón de la red social. Gestiona el feed, posts, comentarios y reacciones.

- **`src/index.ts`**: Punto de entrada del servicio.
- **`src/routes/feed.routes.ts`**: Ruta `GET /feed` para obtener el feed del usuario.
- **`src/routes/post.routes.ts`**: Rutas CRUD para posts: `POST /posts`, `GET /posts/:id`, `PUT /posts/:id`, `DELETE /posts/:id`.
- **`src/routes/comment.routes.ts`**: Rutas CRUD para comentarios: `POST /posts/:postId/comments`, etc.
- **`src/routes/reaction.routes.ts`**: Ruta `POST /posts/:postId/react` para agregar/quitar reacciones.
- **`src/controllers/...`**: Lógica para cada entidad (feed, post, comment, reaction).
- **`src/services/feed.service.ts`**: Lógica para construir el feed del usuario, combinando posts de amigos y contenido recomendado. Usa Redis para cachear el feed.
- **`src/services/cache.service.ts`**: Cliente de Redis para invalidar y actualizar el cache.
- **`src/models/...`**: Modelos para `posts`, `comments`, `reactions`.
- **`package.json`**: Dependencias: `fastify`, `pg`, `redis`, `zod`.
- **`Dockerfile`**: Para containerizar el servicio.

### 4. `packages/db-main/`

**Propósito:** Centralizar el esquema de la base de datos y las migraciones.

- **`schema.sql`**: Archivo SQL con las sentencias `CREATE TABLE` para todas las tablas de la Etapa 1 (`users`, `posts`, `comments`, `reactions`, `friendships`, `groups`, `group_members`, `marketplace_listings`, `events`).
- **`migrations/001-initial-schema.js`**: Migración inicial usando `node-pg-migrate` que ejecuta el `schema.sql`.

### 5. `client/` (Frontend - Archivos a Agregar/Modificar)

**Instrucción para Kimi.com:** Agregar los componentes de UI para las funcionalidades de Facebook.

- **`src/components/feed/Feed.tsx`**: Componente que renderiza el feed con scroll infinito.
- **`src/components/feed/Post.tsx`**: Componente para un post individual, con reacciones y comentarios.
- **`src/components/feed/Comment.tsx`**: Componente para un comentario, con soporte para respuestas anidadas.
- **`src/components/feed/CreatePost.tsx`**: Formulario para crear un nuevo post.
- **`src/app/(main)/feed/page.tsx`**: Página principal que muestra el feed.
- **`src/app/(main)/profile/[username]/page.tsx`**: Página de perfil de usuario.

---

## INSTRUCCIONES ADICIONALES PARA KIMI.COM

1.  **Framework Backend:** Usar **Fastify** para todos los servicios. Es 2x más rápido que Express.
2.  **Base de Datos:** Usar **PostgreSQL** con el driver `pg`. Implementar connection pooling.
3.  **Validación:** Usar **zod** para validar todos los inputs del cliente.
4.  **Autenticación:** Proteger todas las rutas (excepto login/register) con un middleware que valide el JWT.
5.  **Paginación:** Usar paginación basada en cursor para todos los feeds y listas.
6.  **Tests:** Generar tests unitarios con **Jest** para cada controller y service.

Este plan detallado asegura que Kimi.com genere el código exacto necesario para construir la base de la plataforma social, siguiendo las mejores prácticas de la industria.
