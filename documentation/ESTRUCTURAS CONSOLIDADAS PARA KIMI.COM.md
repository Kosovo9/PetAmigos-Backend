# ESTRUCTURAS CONSOLIDADAS PARA KIMI.COM

**Objetivo:** Consolidar las estructuras de carpetas y archivos para los componentes de **Seguridad CIA** y **Dashboards 10x** en un solo documento, listo para la generación de código por Kimi.com.

---

## 1. ESTRUCTURA DE SEGURIDAD CIA (Fortaleza Digital)

**Referencia:** `plan_seguridad_avanzada.md`

### Backend (Microservicios y Paquetes)

```
petamigos-global/
├── services/
│   └── 21-security-service/      # Microservicio de seguridad centralizado
│       ├── src/
│       │   ├── index.ts                     # Inicia Fastify
│       │   ├── routes/
│       │   │   └── security.routes.ts       # Rutas para reportes de seguridad
│       │   ├── services/
│       │   │   ├── firewall.service.ts      # Lógica de WAF dinámico
│       │   │   ├── reputation.service.ts    # Sistema de reputación de IP/Usuario
│       │   │   └── honeypot.service.ts      # Gestión de trampas para bots
│       │   └── workers/
│       │       └── file_scanner.worker.ts   # Worker para escanear archivos con ClamAV
│       ├── package.json
│       └── Dockerfile
├── packages/
│   └── security-middleware/      # Middleware de seguridad para Fastify (usado por todos los servicios)
│       ├── src/
│       │   ├── auth.middleware.ts           # Verificación de JWT
│       │   ├── rbac.middleware.ts           # Control de Acceso Basado en Roles
│       │   ├── rate_limit.ts                # Límite de peticiones con Redis
│       │   └── security_headers.ts          # CSP y Headers de seguridad
│       └── package.json
└── infra/
    └── terraform/
        └── cloudflare.tf         # Configuración de Cloudflare como código (WAF, Rate Limiting)
```

### Frontend (Protección de Contenido)

```
client/
└── src/
    └── packages/
        └── content-protection/       # Scripts de protección de contenido para el cliente
            ├── src/
            │   ├── anti_copy.ts             # Deshabilitar clic derecho/selección
            │   ├── fingerprint.ts           # FingerprintJS para detección de clones
            │   └── watermark.ts             # Watermarking dinámico (si aplica)
            └── package.json
```

---

## 2. ESTRUCTURA DE DASHBOARDS 10X (Velocidad y Proactividad)

**Referencia:** `diseno_dashboards_10x.md` y `estructura_dashboards_messenger_kimi.md`

### Backend (Microservicio de Analíticas)

```
petamigos-global/
└── services/
    └── 11-analytics-service/
        ├── src/
        │   ├── index.ts
        │   ├── routes/
        │   │   └── metrics.routes.ts        # Rutas protegidas para obtener métricas (requiere RBAC)
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

### Frontend (Next.js / React)

```
client/
└── src/
    ├── app/
    │   ├── (main)/
    │   │   └── dashboard/
    │   │       └── page.tsx           # User Dashboard principal (SSR/SWR)
    │   └── (admin)/
    │       ├── layout.tsx             # Layout con RBAC estricto para Admin
    │       └── admin-dashboard/
    │           └── page.tsx           # Admin Dashboard principal (SSR/SWR)
    └── components/
        ├── dashboard/
        │   ├── user/
        │   │   ├── UserDashboardLayout.tsx
        │   │   ├── PetHealthMonitor.tsx     # Widget de salud de mascota
        │   │   ├── TreatsWidget.tsx         # Widget de gamificación
        │   │   └── WellbeingMonitor.tsx     # Widget de bienestar digital
        │   └── admin/
        │       ├── AdminDashboardLayout.tsx
        │       ├── GlobalThreatMap.tsx      # Seguridad (Loki/Prometheus)
        │       ├── ModerationQueue.tsx      # Moderación (BullMQ/Redis)
        │       └── ServiceHealthMonitor.tsx # Salud de Microservicios
        └── ui/
            ├── Card.tsx
            ├── Chart.tsx                # Componente wrapper para Chart.js
            └── Button.tsx
```

---

## 3. INSTRUCCIONES DE IMPLEMENTACIÓN PARA KIMI.COM

1.  **Prioridad Absoluta:** Kimi.com debe generar el código para el `21-security-service` y el `security-middleware` **antes** de cualquier otro servicio. La seguridad es la base de la valuación de $350M.
2.  **Uso de Middleware:** Todos los microservicios (Auth, User, Social, etc.) deben importar y utilizar el `security-middleware` para aplicar el Rate Limiting y el RBAC.
3.  **Conexión de Dashboards:** El frontend debe consumir las rutas de `11-analytics-service` para obtener los datos, asegurándose de que las peticiones al Admin Dashboard incluyan el token de administrador.
4.  **Optimización:** Usar **Next.js Server Components** para la carga inicial de los Dashboards y **Socket.io** para las actualizaciones en tiempo real de los widgets (ej. `GlobalThreatMap.tsx`).

Esta consolidación proporciona a Kimi.com un plan de desarrollo claro y modular para los componentes más críticos. El siguiente paso es el diseño del Marketplace.
