# ESTRUCTURA DE CARPETAS Y ARCHIVOS PARA DASHBOARDS Y MESSENGER

**Objetivo:** Consolidar la estructura de carpetas y archivos para que Kimi.com genere el código del Dashboard de Usuario, Dashboard de Administración y el Messenger Interno.

---

## 1. ESTRUCTURA DE CARPETAS (BACKEND)

### `services/6-chat-service/` (Messenger)

```
petamigos-global/
└── services/
    └── 6-chat-service/
        ├── src/
        │   ├── index.ts                     # Inicia Fastify y Socket.io
        │   ├── routes/
        │   │   ├── conversation.routes.ts   # Rutas REST para conversaciones
        │   │   └── message.routes.ts        # Rutas REST para historial
        │   ├── controllers/
        │   │   ├── conversation.controller.ts
        │   │   └── message.controller.ts
        │   ├── services/
        │   │   ├── socket.service.ts        # Lógica de Socket.io
        │   │   └── webrtc.service.ts        # Lógica de señalización WebRTC
        │   ├── models/
        │   │   ├── conversation.model.ts
        │   │   └── message.model.ts
        │   └── events/
        │       └── message.events.ts        # Manejadores de eventos de Socket.io
        ├── package.json
        └── Dockerfile
```

### `services/11-analytics-service/` (Para Dashboards)

**Propósito:** Recopilar métricas de usuario y sistema para alimentar los Dashboards.

```
petamigos-global/
└── services/
    └── 11-analytics-service/
        ├── src/
        │   ├── index.ts
        │   ├── routes/
        │   │   └── metrics.routes.ts        # Rutas para obtener métricas
        │   ├── controllers/
        │   │   └── metrics.controller.ts
        │   ├── services/
        │   │   ├── prometheus.service.ts    # Integración con Prometheus
        │   │   └── logging.service.ts       # Integración con Loki
        │   └── models/
        │       └── user_activity.model.ts   # Registro de actividad de usuario
        ├── package.json
        └── Dockerfile
```

---

## 2. ESTRUCTURA DE CARPETAS (FRONTEND)

### `client/` (Dashboards y Messenger)

```
petamigos-global/
└── client/
    └── src/
        ├── app/
        │   ├── (main)/
        │   │   ├── dashboard/
        │   │   │   └── page.tsx           # User Dashboard principal
        │   │   └── messenger/
        │   │       └── page.tsx           # Messenger principal
        │   └── (admin)/
        │       ├── layout.tsx             # Layout con RBAC para Admin
        │       └── admin-dashboard/
        │           └── page.tsx           # Admin Dashboard principal
        │
        ├── components/
        │   ├── dashboard/
        │   │   ├── user/
        │   │   │   ├── UserDashboardLayout.tsx
        │   │   │   ├── PetHealthMonitor.tsx
        │   │   │   ├── TreatsWidget.tsx
        │   │   │   └── WellbeingMonitor.tsx
        │   │   └── admin/
        │   │       ├── AdminDashboardLayout.tsx
        │   │       ├── GlobalThreatMap.tsx      # Seguridad (Loki/Prometheus)
        │   │       ├── ModerationQueue.tsx      # Moderación (BullMQ/Redis)
        │   │       └── ServiceHealthMonitor.tsx # Salud de Microservicios
        │   ├── messenger/
        │   │   ├── MessengerLayout.tsx
        │   │   ├── ChatList.tsx
        │   │   ├── ChatWindow.tsx
        │   │   ├── MessageInput.tsx
        │   │   ├── VideoCallButton.tsx
        │   │   └── WebRTCView.tsx           # Componente de videollamada
        │   └── ui/
        │       ├── Card.tsx
        │       ├── Chart.tsx                # Wrapper para Chart.js
        │       └── Button.tsx
        │
        └── lib/
            └── socket/
                └── socket.ts                # Cliente de Socket.io
```

---

## 3. INSTRUCCIONES ADICIONALES PARA KIMI.COM

### Dashboard de Administración (Seguridad)

1.  **RBAC Estricto:** El archivo `client/src/app/(admin)/layout.tsx` debe implementar la verificación de rol de administrador antes de renderizar cualquier contenido. Si el usuario no es `role: 'admin'`, debe redirigir a `/dashboard` o mostrar un error 403.
2.  **API Segura:** Las rutas en `services/11-analytics-service/src/routes/metrics.routes.ts` deben estar protegidas con el middleware `rbac.middleware.ts` del `security-middleware` para asegurar que solo los administradores puedan acceder a las métricas sensibles.

### Messenger (Tiempo Real)

1.  **Socket.io:** Kimi debe generar el cliente en `client/src/lib/socket/socket.ts` y el servidor en `services/6-chat-service/src/index.ts`. La conexión debe ser persistente.
2.  **WebRTC:** El componente `client/src/components/messenger/WebRTCView.tsx` debe manejar la lógica de señalización (usando el `socket.service.ts` del backend) y la conexión P2P.
3.  **Almacenamiento de Medios:** El `chat-service` NO debe manejar la subida de archivos. Debe delegar esta tarea al `media-service` y solo almacenar la URL segura devuelta.

### Optimización 100X

1.  **Virtualización:** Los componentes `ChatList.tsx` y `ChatWindow.tsx` deben usar técnicas de virtualización (ej. `react-window`) para renderizar solo los elementos visibles, asegurando un scroll ultra-rápido incluso con miles de mensajes.
2.  **Pre-fetching:** La página `client/src/app/(main)/messenger/page.tsx` debe usar pre-fetching para cargar los datos de la primera conversación tan pronto como se cargue la página.

Este plan proporciona la estructura modular y optimizada necesaria para construir el Dashboard y el Messenger de alta gama.
