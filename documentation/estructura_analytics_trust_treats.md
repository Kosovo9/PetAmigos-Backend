# ESTRUCTURA DETALLADA: 11-analytics-service (Trust Score y Treats)

**Objetivo:** Detallar la estructura de carpetas y archivos del microservicio de analíticas (`11-analytics-service`) para la recolección y exposición de métricas clave de gamificación y confianza: **"Trust Score"** y **"Treats"**.

---

## 1. BACKEND: `11-analytics-service` (Métricas de Confianza y Gamificación)

```
services/
└── 11-analytics-service/
    ├── src/
    │   ├── index.ts
    │   ├── routes/
    │   │   ├── metrics.routes.ts        # Rutas de Admin (Prometheus/Loki)
    │   │   └── user_metrics.routes.ts   # Rutas de Usuario (Trust Score, Treats)
    │   ├── controllers/
    │   │   └── user_metrics.controller.ts
    │   ├── services/
    │   │   ├── trust_score.service.ts   # Lógica de cálculo del Trust Score
    │   │   └── treats_service.ts        # Lógica de cálculo y registro de Treats
    │   └── models/
    │       ├── trust_event.model.ts     # Registro de eventos que afectan el Trust Score (ej. Reporte, Transacción Exitosa)
    │       └── treat_event.model.ts     # Registro de eventos que otorgan Treats (ej. Post, Like, Share)
    ...
```

## 2. LÓGICA CLAVE PARA KIMI.COM

### A. `trust_score.service.ts`

- **Función:** Calcula el Trust Score (0-100) del usuario basado en eventos positivos y negativos.
- **Eventos Positivos (+):** Transacción exitosa en Marketplace, verificación de identidad (KYC), antigüedad de la cuenta.
- **Eventos Negativos (-):** Reporte de spam, bloqueo por el `security-service`, cancelación de transacción.
- **Integración:** Este servicio debe ser llamado por el `security-service`, `marketplace-service` y `payment-service` para registrar eventos.

### B. `treats_service.ts`

- **Función:** Asigna y gestiona la moneda virtual "Treats".
- **Asignación:** Se otorgan Treats por acciones que impulsan la plataforma (ej. 10 Treats por un post, 50 Treats por un Reel viral, 100 Treats por referir un nuevo usuario).
- **Integración:** Este servicio debe ser llamado por el `social-service` y el `affiliate-service` para registrar la ganancia de Treats.

## 3. INTEGRACIÓN CON EL FRONTEND

- **Dashboard de Usuario:** El componente `PetHealthMonitor.tsx` y `TreatsWidget.tsx` en el Dashboard de Usuario consumirán las rutas de `user_metrics.routes.ts` para mostrar el estado de confianza y la moneda virtual.

Este diseño asegura que la confianza y la gamificación sean métricas de primera clase, impulsando el comportamiento positivo del usuario.
