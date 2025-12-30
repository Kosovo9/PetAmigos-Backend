# ARQUITECTURA DETALLADA: 11-analytics-service

**Objetivo:** Desglosar la arquitectura del microservicio de analíticas (`11-analytics-service`), especificando la integración con Prometheus, Loki, Next.js, Chart.js y Socket.io, y definiendo las métricas clave para los Dashboards de usuario y administrador.

---

## 1. ARQUITECTURA DEL STACK DE OBSERVABILIDAD

El `11-analytics-service` actúa como el puente entre los datos brutos de los microservicios y los Dashboards de alta gama.

| Componente | Tecnología Open Source | Función |
|---|---|---|
| **Métricas** | **Prometheus** | Recopila métricas de rendimiento (CPU, latencia, errores 5xx) de todos los 21 microservicios. |
| **Logs** | **Loki** | Recopila logs estructurados (JSON) de todos los microservicios. |
| **Visualización** | **Grafana** | Interfaz para consultar Prometheus y Loki, y generar gráficos de alto nivel. |
| **Servicio API** | **11-analytics-service** | Expone las métricas y logs relevantes a los Dashboards de forma segura (con RBAC). |
| **Frontend** | **Next.js, Chart.js, Socket.io** | Renderiza los Dashboards de Usuario y Admin con datos en tiempo real. |

---

## 2. ESTRUCTURA DE CARPETAS Y ARCHIVOS PARA KIMI.COM

```
services/
└── 11-analytics-service/
    ├── src/
    │   ├── index.ts
    │   ├── routes/
    │   │   ├── metrics.routes.ts        # Rutas protegidas para métricas de Admin
    │   │   └── user_metrics.routes.ts   # Rutas para métricas de Usuario
    │   ├── controllers/
    │   │   ├── metrics.controller.ts
    │   │   └── user_metrics.controller.ts
    │   ├── services/
    │   │   ├── prometheus.service.ts    # Cliente para consultar la API de Prometheus
    │   │   └── loki.service.ts          # Cliente para consultar la API de Loki
    │   └── models/
    │       └── user_activity.model.ts   # Registro de eventos de usuario (ej. post_created, reel_viewed)
    ├── package.json
    └── Dockerfile
```

---

## 3. MÉTRICAS CLAVE PARA DASHBOARDS

### A. Dashboard de Administrador (Admin Dashboard)

**Objetivo:** Monitoreo de la salud del sistema y la seguridad (Nivel CIA).

| Métrica | Fuente | Uso en Dashboard |
|---|---|---|
| **Latencia P95** | Prometheus | `ServiceHealthMonitor.tsx` (Alerta si > 300ms). |
| **Tasa de Error 5xx** | Prometheus | `ServiceHealthMonitor.tsx` (Alerta si > 0.5%). |
| **Intentos de Login Fallidos** | Loki (Logs de `auth-service`) | `GlobalThreatMap.tsx` (Detección de fuerza bruta). |
| **Archivos Bloqueados** | Loki (Logs de `21-security-service`) | `ModerationQueue.tsx` (Archivos bloqueados por ClamAV). |
| **DAU/MAU** | PostgreSQL (vía `user-service`) | `AdminDashboardLayout.tsx` (KPIs Ejecutivos). |
| **MRR (Ingresos)** | PostgreSQL (vía `15-payment-service`) | `AdminDashboardLayout.tsx` (KPIs Ejecutivos). |

### B. Dashboard de Usuario (User Dashboard)

**Objetivo:** Proactividad, Gamificación y Bienestar Digital.

| Métrica | Fuente | Uso en Dashboard |
|---|---|---|
| **Trust Score** | `21-security-service` | `Tarjeta de Perfil Dinámica` (Indicador de seguridad). |
| **Treats Balance** | PostgreSQL (vía `user-service`) | `TreatsWidget.tsx` (Gamificación). |
| **Tiempo de Uso** | `11-analytics-service` | `WellbeingMonitor.tsx` (Bienestar Digital). |
| **Pet Health Score** | PostgreSQL (vía `user-service`) | `PetHealthMonitor.tsx` (Proactividad). |
| **Engagement Rate** | PostgreSQL (vía `social-service`) | `UserDashboardLayout.tsx` (Métricas de éxito personal). |

---

## 4. INTEGRACIÓN CON EL FRONTEND (Next.js, Chart.js, Socket.io)

### A. Next.js y Chart.js

- **Server-Side Rendering (SSR):** Las métricas históricas (ej. MRR del último mes) se obtienen en el servidor (SSR) para una carga inicial instantánea.
- **Chart.js:** El componente `client/src/components/ui/Chart.tsx` debe ser un wrapper que reciba los datos del `11-analytics-service` y los renderice de forma eficiente.

### B. Socket.io (Tiempo Real)

- **Flujo:** El `11-analytics-service` debe tener una conexión interna con el servidor de Socket.io (del `chat-service` o uno dedicado).
- **Uso:** Las métricas críticas (ej. Latencia P95, Nuevos Reportes de Seguridad) se envían a través de Socket.io al Admin Dashboard para una actualización en tiempo real, logrando la proactividad 10x.

---

## 5. CONCLUSIÓN

El `11-analytics-service` es el motor de inteligencia de la plataforma. Su arquitectura con Prometheus y Loki asegura que cada microservicio sea monitoreado y que la información crítica se entregue a los Dashboards con la velocidad y seguridad requeridas para una plataforma 10x. La integración con Next.js y Socket.io garantiza una experiencia de usuario y administrador sin precedentes.
