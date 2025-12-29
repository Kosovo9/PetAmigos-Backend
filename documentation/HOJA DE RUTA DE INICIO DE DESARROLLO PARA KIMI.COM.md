# HOJA DE RUTA DE INICIO DE DESARROLLO PARA KIMI.COM

**Objetivo:** Proporcionar a Kimi.com un documento de inicio de desarrollo conciso y de alta prioridad, extrayendo las tareas más críticas de la Fase 1 y detallando la arquitectura de los componentes de Seguridad y Dashboards.

---

## 1. LAS 5 TAREAS DE MÁS ALTA PRIORIDAD (FASE 1)

La Fase 1 (Mes 1) es crítica para establecer la base de la plataforma y la seguridad. Las siguientes 5 tareas deben ser generadas por Kimi.com en este orden de prioridad:

| Prioridad | Tarea (Kimi.com) | Documento de Referencia | Ruta de Archivos/Carpetas Clave |
|---|---|---|---|
| **1** | **Seguridad CIA (Backend)** | `plan_seguridad_avanzada.md` | `services/21-security-service/`, `packages/security-middleware/` |
| **2** | **Core Services (Auth, User, Social)** | `plan_accion_etapa_1_detallado.md` | `services/1-auth-service/`, `services/2-user-service/`, `services/3-social-service/` |
| **3** | **Dashboards 10x (Frontend)** | `estructura_dashboards_messenger_kimi.md` | `client/src/app/(main)/dashboard/`, `client/src/app/(admin)/admin-dashboard/` |
| **4** | **Pagos Core** | `plan_integracion_pagos.md` | `services/15-payment-service/` |
| **5** | **Analíticas (Backend)** | `estructuras_seguridad_dashboards_consolidadas.md` | `services/11-analytics-service/` |

**Instrucción Clave:** La Tarea 1 (Seguridad CIA) debe ser completada y sus middlewares (`security-middleware`) deben ser integrados en los Core Services (Tarea 2) antes de que estos sean desplegados.

---

## 2. ARQUITECTURA DE MICROSERVICIOS CRÍTICOS

La arquitectura se basa en el stack **Fastify (Node.js)** para los microservicios y **Next.js/React** para el frontend, utilizando **PostgreSQL** como base de datos principal.

### A. Seguridad CIA (Fortaleza Digital)

| Microservicio/Paquete | Propósito | Tecnología Open Source | Archivos Clave para Kimi.com |
|---|---|---|---|
| **`21-security-service`** | Lógica de seguridad avanzada (WAF, Reputación, Honeypot, Escaneo de Archivos). | **Fastify**, **ClamAV** (integración), **BullMQ** (para workers). | `services/21-security-service/src/services/firewall.service.ts` |
| **`security-middleware`** | Middleware de protección para todos los servicios. | **Fastify**, **Redis** (para Rate Limiting), **bcrypt** (para hashing). | `packages/security-middleware/src/rbac.middleware.ts` |
| **Infraestructura** | Protección perimetral. | **Cloudflare** (configuración como código con Terraform). | `infra/terraform/cloudflare.tf` |

### B. Dashboards 10X (Velocidad y Proactividad)

| Microservicio/Paquete | Propósito | Tecnología Open Source | Archivos Clave para Kimi.com |
|---|---|---|---|
| **`11-analytics-service`** | Recopilación y exposición de métricas para Dashboards. | **Fastify**, **Prometheus** (integración), **Loki** (integración). | `services/11-analytics-service/src/routes/metrics.routes.ts` |
| **Frontend (User)** | Dashboard de Usuario (velocidad y gamificación). | **Next.js** (Server Components), **React**, **SWR/React Query**. | `client/src/app/(main)/dashboard/page.tsx` |
| **Frontend (Admin)** | Dashboard de Administración (seguridad y salud del sistema). | **Next.js** (Server Components), **Chart.js** (visualización), **RBAC** (en `layout.tsx`). | `client/src/app/(admin)/admin-dashboard/page.tsx` |

---

## 3. INSTRUCCIONES FINALES PARA KIMI.COM

1.  **Prioridad de Generación:** Generar primero los archivos del `21-security-service` y el `security-middleware`.
2.  **Modularidad:** Generar cada microservicio en su propia carpeta (`services/X-nombre-service/`) y el frontend en la carpeta `client/`.
3.  **Consistencia:** Utilizar el stack tecnológico definido (Fastify, Next.js, PostgreSQL, Redis) para asegurar la compatibilidad y la optimización 10x.

Este documento, junto con los archivos detallados, es la orden de inicio para el desarrollo.
