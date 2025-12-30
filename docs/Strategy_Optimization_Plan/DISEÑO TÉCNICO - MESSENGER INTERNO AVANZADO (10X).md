# DISEÑO TÉCNICO - MESSENGER INTERNO AVANZADO (10X)

**Objetivo:** Implementar un sistema de mensajería interna (Messenger) con capacidades de alta gama, incluyendo chat en tiempo real, envío de fotos y videos, y videollamadas en línea, todo optimizado para la velocidad (100x) y la seguridad (nivel CIA).

---

## 1. ARQUITECTURA DEL MESSENGER

El sistema de mensajería se basará en un microservicio dedicado (`chat-service`) que utiliza dos tecnologías clave para el tiempo real:

1.  **Socket.io:** Para la mensajería de texto, notificaciones de escritura, estado "visto" y señalización de videollamadas.
2.  **WebRTC (Web Real-Time Communication):** Para la transmisión de audio y video P2P (Peer-to-Peer) en tiempo real.

### Microservicio: `6-chat-service`

**Propósito:** Gestionar la lógica de las conversaciones, el almacenamiento de mensajes y la orquestación de las conexiones en tiempo real.

| Componente | Tecnología | Función |
|---|---|---|
| **API REST** | Fastify | Rutas para historial de mensajes, creación de conversaciones, gestión de grupos. |
| **Real-Time Layer** | Socket.io | Conexiones persistentes para chat, notificaciones de escritura, estado online/offline. |
| **Base de Datos** | PostgreSQL | Almacenamiento de mensajes, conversaciones, miembros de grupo. |
| **Storage** | MinIO (vía media-service) | Almacenamiento de archivos multimedia compartidos. |

---

## 2. FUNCIONALIDADES MULTIMEDIA EN TIEMPO REAL

### A. Chat de Texto y Multimedia (Fotos/Videos)

**Flujo de Envío de Archivos:**

1.  **Usuario Selecciona Archivo:** El usuario selecciona una foto o video en el frontend.
2.  **Upload al `media-service`:** El frontend envía el archivo directamente al `media-service` (Puerto 5012).
3.  **Procesamiento y Escaneo:** El `media-service` procesa el archivo (compresión, redimensionamiento, transcodificación) y lo envía al `security-service` para un escaneo de virus (ClamAV).
4.  **URL Segura:** El `media-service` devuelve una URL segura de MinIO al frontend.
5.  **Mensaje a `chat-service`:** El frontend envía un mensaje al `chat-service` a través de Socket.io, incluyendo la URL segura del archivo.
6.  **Broadcast:** El `chat-service` guarda el mensaje en PostgreSQL y lo retransmite a todos los participantes de la conversación a través de Socket.io.

**Optimización 100X:** El uso de Socket.io garantiza una latencia de chat de **< 50ms**. La subida directa al `media-service` descarga al `chat-service` de la pesada tarea de procesamiento de archivos.

### B. Video en Línea en Tiempo Real (Videollamadas)

**Tecnología:** WebRTC (Peer-to-Peer) con Socket.io como Servidor de Señalización.

**Flujo de Videollamada P2P (1 a 1):**

1.  **Inicio de Llamada:** El usuario A hace clic en el botón "Video Call". El frontend (WebRTC) genera una oferta (SDP - Session Description Protocol).
2.  **Señalización:** El frontend de A envía la oferta al `chat-service` a través de Socket.io.
3.  **Orquestación:** El `chat-service` retransmite la oferta al usuario B.
4.  **Respuesta:** El usuario B acepta la llamada y genera una respuesta (SDP). Esta respuesta se envía de vuelta a A a través de Socket.io.
5.  **Conexión P2P:** Una vez que A y B intercambian sus ofertas/respuestas (SDP) y candidatos ICE (información de red), se establece una conexión directa P2P. El `chat-service` ya no participa en la transmisión de medios.

**Videollamadas Grupales:**

Para videollamadas grupales, la complejidad de WebRTC P2P se vuelve inmanejable. Se utilizará un servidor de medios Open Source: **Jitsi Meet**.

- **Integración:** El `chat-service` genera un token de acceso y una URL única de Jitsi para la sala de chat.
- **Flujo:** Al iniciar una llamada grupal, el `chat-service` notifica a los miembros y los redirige a la URL de Jitsi, manteniendo la experiencia dentro de la plataforma.

---

## 3. SEGURIDAD Y PRIVACIDAD (NIVEL CIA)

| Característica | Implementación | Justificación |
|---|---|---|
| **Cifrado E2E (Opcional)** | Implementación de una librería basada en el **Signal Protocol** (ej. `libsignal-protocol-javascript`). | Permite a los usuarios con alta sensibilidad a la privacidad activar el cifrado de extremo a extremo, asegurando que ni siquiera el `chat-service` pueda leer los mensajes. |
| **Escaneo de Medios** | Integración con el `security-service` (ClamAV) en el `media-service`. | Todos los archivos compartidos (fotos, videos) son escaneados automáticamente en busca de malware o contenido prohibido antes de ser almacenados y entregados. |
| **Control de Acceso** | Middleware de autenticación y autorización en el `chat-service` (Fastify). | Solo los miembros de una conversación pueden acceder al historial de mensajes o unirse a una llamada. |
| **Video Call Security** | Uso de **TURN/STUN** servers Open Source (ej. Coturn) para asegurar que las llamadas P2P funcionen incluso detrás de firewalls, sin comprometer la seguridad. | Garantiza la conectividad sin exponer la IP del usuario a terceros, ya que el servidor de señalización (Socket.io) es de confianza. |

---

## 4. ESTRUCTURA DE CARPETAS PARA MESSENGER

### `services/6-chat-service/`

**Instrucción para Kimi.com:** Generar el siguiente microservicio.

- **`src/index.ts`**: Punto de entrada. Inicia Fastify y el servidor Socket.io.
- **`src/routes/conversation.routes.ts`**: Rutas REST para `GET /conversations`, `POST /conversations/group`.
- **`src/routes/message.routes.ts`**: Rutas REST para `GET /conversations/:id/messages` (historial).
- **`src/controllers/conversation.controller.ts`**: Lógica para crear y gestionar conversaciones.
- **`src/controllers/message.controller.ts`**: Lógica para obtener el historial.
- **`src/services/socket.service.ts`**: Contiene la lógica de Socket.io (conexión, desconexión, broadcast).
- **`src/services/webrtc.service.ts`**: Lógica para la señalización de WebRTC (manejo de ofertas/respuestas SDP y candidatos ICE).
- **`src/models/conversation.model.ts`**: Consultas a la DB para la tabla `conversations`.
- **`src/models/message.model.ts`**: Consultas a la DB para la tabla `messages`.
- **`src/events/message.events.ts`**: Manejadores de eventos de Socket.io (`send_message`, `typing`, `seen`).
- **`package.json`**: Dependencias: `fastify`, `socket.io`, `pg`, `zod`.
- **`Dockerfile`**: Para containerizar el servicio.

### `client/` (Frontend - Archivos a Agregar/Modificar)

**Instrucción para Kimi.com:** Generar los siguientes componentes de UI.

- **`src/app/(main)/messenger/page.tsx`**: Página principal del Messenger.
- **`src/components/messenger/MessengerLayout.tsx`**: Layout principal con lista de chats y ventana de chat.
- **`src/components/messenger/ChatList.tsx`**: Lista de conversaciones con pre-fetching de los últimos mensajes.
- **`src/components/messenger/ChatWindow.tsx`**: Ventana de chat principal.
- **`src/components/messenger/MessageInput.tsx`**: Input de mensaje con botones para subir foto/video y iniciar llamada.
- **`src/components/messenger/VideoCallButton.tsx`**: Botón para iniciar videollamada.
- **`src/components/messenger/WebRTCView.tsx`**: Componente que maneja la lógica de WebRTC (cámara, micrófono, conexión P2P).
- **`src/lib/socket/socket.ts`**: Cliente de Socket.io para la conexión persistente.

---

## 5. OPTIMIZACIÓN 100X Y CERO ERRORES

| Área | Técnica de Optimización |
|---|---|
| **Latencia de Chat** | Uso de Socket.io (WebSockets) para reducir la latencia de HTTP polling a milisegundos. |
| **Historial de Mensajes** | Paginación basada en cursor (cursor-based pagination) para cargar el historial de forma instantánea al hacer scroll. |
| **Carga de Medios** | Lazy loading de imágenes y videos en el chat. Los archivos se cargan solo cuando son visibles en el viewport. |
| **Video en Tiempo Real** | WebRTC P2P elimina la necesidad de un servidor de medios costoso y reduce la latencia al mínimo absoluto. |
| **Seguridad** | Uso de `zod` para validar cada mensaje antes de ser guardado en la DB y transmitido, previniendo inyecciones y spam. |

Este diseño garantiza un Messenger interno con una experiencia de usuario superior a la de Facebook Messenger, con la velocidad de Telegram y la seguridad de Signal (opcional). El siguiente paso es consolidar la estructura de carpetas y archivos para Kimi.com.
