# PLAN DE IMPLEMENTACIÓN: SEGURIDAD CIA (21-security-service y security-middleware)

**Objetivo:** Detallar el plan de implementación para el microservicio de seguridad (`21-security-service`) y el paquete de middleware (`security-middleware`), utilizando Fastify, ClamAV, BullMQ, Redis y Cloudflare, para que Kimi.com genere el código de la Fortaleza Digital.

---

## 1. ARQUITECTURA DEL SISTEMA DE SEGURIDAD

El sistema de seguridad se divide en tres capas de defensa:

1.  **Capa de Borde (Cloudflare):** Protección DDoS y WAF (Web Application Firewall).
2.  **Capa de Aplicación (security-middleware):** Autenticación, Autorización (RBAC) y Limitación de Tasa (Rate Limiting).
3.  **Capa de Lógica (21-security-service):** Lógica de negocio de seguridad (Escaneo de Virus, Reputación, Honeypots).

---

## 2. PLAN DE IMPLEMENTACIÓN: `security-middleware`

Este paquete será una librería interna que todos los microservicios de Fastify importarán.

### Estructura de Carpetas y Archivos

```
packages/
└── security-middleware/
    ├── src/
    │   ├── index.ts                     # Exporta todos los middlewares
    │   ├── auth.middleware.ts           # Verificación de JWT
    │   ├── rbac.middleware.ts           # Control de Acceso Basado en Roles (RBAC)
    │   ├── rate_limit.ts                # Límite de peticiones con Redis
    │   └── security_headers.ts          # CSP y Headers de seguridad
    ├── package.json
    └── README.md
```

### Tareas Clave para Kimi.com

| Archivo | Tecnología | Lógica de Implementación |
|---|---|---|
| `rate_limit.ts` | **Redis** | Usar `ioredis` para implementar un contador deslizante (sliding window counter) que limite las peticiones por IP y por ID de usuario. |
| `rbac.middleware.ts` | **Fastify** | Middleware que verifica el `user.role` (obtenido del JWT) contra una matriz de permisos definida en un archivo de configuración. |
| `security_headers.ts` | **Fastify** | Configurar una **Content Security Policy (CSP)** estricta para prevenir ataques XSS. |

---

## 3. PLAN DE IMPLEMENTACIÓN: `21-security-service`

Este microservicio maneja la lógica de seguridad compleja y asíncrona.

### Estructura de Carpetas y Archivos

```
services/
└── 21-security-service/
    ├── src/
    │   ├── index.ts
    │   ├── routes/
    │   │   └── security.routes.ts       # Rutas internas para otros servicios (ej. /scan-file)
    │   ├── services/
    │   │   ├── firewall.service.ts      # Lógica de WAF dinámico (bloqueo de IPs)
    │   │   ├── reputation.service.ts    # Gestión del Trust Score de usuarios
    │   │   └── honeypot.service.ts      # Lógica de detección de bots
    │   └── workers/
    │       └── file_scanner.worker.ts   # Worker para BullMQ
    ├── package.json
    └── Dockerfile
```

### Tareas Clave para Kimi.com

| Archivo | Tecnología | Lógica de Implementación |
|---|---|---|
| `file_scanner.worker.ts` | **BullMQ, ClamAV** | Worker que escucha la cola `file-scan-queue`. Recibe la ruta del archivo, lo envía al contenedor de ClamAV (vía TCP/IP) para escanear, y notifica al `media-service` el resultado. |
| `reputation.service.ts` | **Redis** | Almacena el `Trust Score` de cada usuario. Otros servicios (ej. `social-service`) llaman a este servicio para decrementar el score si el usuario es reportado o spamea. |
| `honeypot.service.ts` | **Fastify** | Implementar una ruta oculta que, si es accedida, automáticamente bloquea la IP en el `firewall.service` y la reporta a Cloudflare. |

---

## 4. INTEGRACIÓN CON INFRAESTRUCTURA OPEN SOURCE

### A. Cloudflare (Capa de Borde)

**Instrucción para Kimi.com:** Generar el archivo `infra/terraform/cloudflare.tf` para configurar:
- **WAF Rules:** Bloqueo de ataques comunes.
- **Rate Limiting:** Límite de peticiones a rutas críticas (ej. `/api/auth/login`).
- **Bot Fight Mode:** Activado para mitigar el scraping y el tráfico de bots.

### B. BullMQ (Asincronía)

**Instrucción para Kimi.com:** El `media-service` debe encolar un trabajo en la cola `file-scan-queue` cada vez que se sube un archivo. El `21-security-service` debe consumir esta cola.

### C. Redis (Estado y Cache)

**Instrucción para Kimi.com:** Redis se utilizará para:
- **Rate Limiting:** Almacenar contadores de peticiones.
- **Trust Score:** Almacenar el score de reputación de los usuarios.
- **BullMQ:** Como backend para la gestión de colas.

---

## 5. CONCLUSIÓN

Este plan proporciona la hoja de ruta para construir un sistema de seguridad de nivel gubernamental, donde cada componente trabaja en conjunto para crear una defensa en profundidad. La implementación de estas tareas es la **Prioridad #1** para Kimi.com.
