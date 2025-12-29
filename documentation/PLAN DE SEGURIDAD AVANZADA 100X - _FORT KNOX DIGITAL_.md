# PLAN DE SEGURIDAD AVANZADA 100X - "FORT KNOX DIGITAL"

**Objetivo:** Implementar un sistema de seguridad multicapa, inspirado en los principios de "Defense in Depth" de agencias como la CIA y el FBI, pero optimizado 100x para el entorno digital moderno. Este documento detalla las estrategias y la estructura de archivos para que Kimi.com genere el código de una fortaleza digital impenetrable, cubriendo protección anti-hacking, anti-spam, anti-clone, anti-scraping, anti-copy y anti-virus.

---

## ARQUITECTURA DE SEGURIDAD: DEFENSA EN PROFUNDIDAD

La seguridad no es un único producto, sino un proceso y una arquitectura de múltiples capas. Un atacante que penetra una capa se encuentra inmediatamente con la siguiente. Nuestra arquitectura se compone de 5 capas de defensa:

1.  **Capa de Borde (The Wall):** Protección perimetral contra ataques masivos (DDoS, bots).
2.  **Capa de Aplicación (The Guardhouse):** Asegura la lógica de la aplicación contra vulnerabilidades (hacking, spam).
3.  **Capa de Contenido (The Vault):** Protege la propiedad intelectual y los datos de los usuarios (clonación, copia).
4.  **Capa de Datos (The Core):** Cifrado y control de acceso a la información en reposo y en tránsito.
5.  **Capa de Monitoreo y Respuesta (The Watchtower):** Detección y respuesta a incidentes en tiempo real.

---

## ESTRUCTURA DE CARPETAS Y ARCHIVOS PARA KIMI.COM

```
petamigos-global/
├── services/
│   ├── 21-security-service/      # Microservicio de seguridad centralizado
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── services/
│   │   │   │   ├── firewall.service.ts   # Lógica de WAF dinámico
│   │   │   │   ├── reputation.service.ts # Sistema de reputación de IP/Usuario
│   │   │   │   ├── scanner.service.ts    # Integración con ClamAV
│   │   │   │   └── honeypot.service.ts   # Gestión de trampas para bots
│   │   │   └── workers/
│   │   │       └── file_scanner.worker.ts # Worker para escanear archivos
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── ... (otros servicios)
│
├── packages/
│   ├── security-middleware/      # Middleware de seguridad para Fastify
│   │   ├── src/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rbac.middleware.ts
│   │   │   ├── rate_limit.ts
│   │   │   └── security_headers.ts
│   │   └── package.json
│   │
│   └── content-protection/       # Scripts de protección de contenido para el cliente
│       ├── src/
│       │   ├── anti_copy.ts
│       │   ├── fingerprint.ts
│       │   └── watermark.ts
│       └── package.json
│
├── infra/
│   └── terraform/
│       └── cloudflare.tf         # Configuración de Cloudflare como código
│
└── docker-compose.yml
```

---

## DETALLE DE IMPLEMENTACIÓN POR CAPA

### Capa 1: Edge Protection (Anti-DDoS, Anti-Scraping)

**Herramienta Principal:** Cloudflare

**Instrucción para Kimi.com:** Generar el archivo `infra/terraform/cloudflare.tf` para automatizar la configuración.

```terraform
# infra/terraform/cloudflare.tf

resource "cloudflare_ruleset" "waf_rules" {
  zone_id     = var.cloudflare_zone_id
  name        = "PetAmigos WAF"
  description = "Reglas de WAF para PetAmigos"
  kind        = "zone"
  phase       = "http_request_firewall_managed"

  rules {
    action = "block"
    expression = "(http.request.uri.path ~ \"/wp-login.php\") or (http.request.uri.path ~ \"/xmlrpc.php\")"
    description = "Bloquear ataques comunes de WordPress"
  }

  rules {
    action = "challenge"
    expression = "(cf.threat_score > 10)"
    description = "Desafiar a usuarios con score de amenaza medio"
  }

  rules {
    action = "block"
    expression = "(cf.threat_score > 40)"
    description = "Bloquear a usuarios con score de amenaza alto"
  }
}

resource "cloudflare_zone_settings_override" "bot_fight_mode" {
  zone_id = var.cloudflare_zone_id
  settings {
    bot_fight_mode = "on"
  }
}

resource "cloudflare_rate_limiting" "login_rate_limit" {
  zone_id = var.cloudflare_zone_id
  threshold = 5
  period = 60 # 5 intentos por minuto
  action {
    mode = "ban"
    timeout = 3600 # Banear por 1 hora
  }
  match {
    request {
      methods = ["POST"]
      schemes = ["https"]
      url_pattern = "*/api/auth/login"
    }
  }
}
```

**Otras Configuraciones a Incluir:**
- **SSL/TLS:** Modo "Full (Strict)".
- **HSTS:** Habilitado con `max-age` de 6 meses y `includeSubDomains`.
- **DNSSEC:** Habilitado.

### Capa 2: Application Security (Anti-Hacking, Anti-Spam)

**Instrucción para Kimi.com:** Generar el paquete `packages/security-middleware/`.

- **`auth.middleware.ts`**: Middleware para Fastify que verifica el JWT en el header `Authorization`. Debe fallar si el token es inválido, expirado o no existe.
- **`rbac.middleware.ts`**: Middleware que verifica los roles del usuario (ej. `isAdmin`, `isModerator`) contra los permisos requeridos por la ruta.
- **`rate_limit.ts`**: Configuración para `fastify-rate-limit` usando Redis. Debe permitir definir límites globales y por ruta.
- **`security_headers.ts`**: Configuración para `helmet` que establece una **Content Security Policy (CSP)** estricta. Ejemplo:

  ```typescript
  // packages/security-middleware/src/security_headers.ts
  export const cspOptions = {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://petmatch-global.netlify.app"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://*.bunnycdn.com"],
      connectSrc: ["'self'", "wss://petmatch-global.netlify.app"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  };
  ```

**Anti-Spam:**
- **Honeypot:** En el formulario de registro del frontend, agregar un campo oculto para los bots. Si este campo se llena, la petición se rechaza en el backend.
- **Sistema de Reputación:** El `security-service` mantendrá un score de reputación para cada usuario en Redis. Acciones como ser reportado, enviar muchos mensajes rápidamente, o fallar el login repetidamente disminuirán el score. Un score bajo puede resultar en captchas o suspensiones temporales.

### Capa 3: Content & Code Protection (Anti-Clone, Anti-Copy, Anti-Virus)

**Instrucción para Kimi.com:** Generar el paquete `packages/content-protection/` y el `security-service`.

- **`anti_copy.ts`**: Script para el frontend que deshabilita el clic derecho, la selección de texto y el `Ctrl+C` en elementos con la clase `.no-copy`. Es un disuasivo, no una solución infalible.
- **`fingerprint.ts`**: Integración con `FingerprintJS` (Open Source) para generar un ID único para cada navegador. Este ID se usa para detectar si un mismo "usuario" está creando múltiples cuentas o realizando scraping.
- **`watermark.ts`**: En el `media-service`, al procesar imágenes/videos, usar `sharp` (para imágenes) y `ffmpeg` (para videos) para incrustar una marca de agua semi-transparente con el `@username` del usuario que lo subió. Esto disuade la clonación de contenido.

**Anti-Virus (File Uploads):**
- **`security-service/services/scanner.service.ts`**: Este servicio se integra con **ClamAV**, un motor antivirus open source que debe correr en su propio contenedor Docker.
- **Flujo de Escaneo:**
  1. Usuario sube un archivo al `media-service`.
  2. El `media-service` guarda el archivo en una ubicación temporal y encola un job en BullMQ para el `security-service`.
  3. El `file_scanner.worker.ts` del `security-service` toma el job, envía el archivo a ClamAV para ser escaneado.
  4. Si el archivo está limpio, se mueve a la ubicación final y se marca como `AVAILABLE`. Si se detecta un virus, se elimina y se notifica al usuario.

### Capa 4: Data Protection (The Core)

**Instrucción para Kimi.com:** Asegurar que estas prácticas se apliquen en todo el código.

- **Cifrado en Tránsito:** Ya cubierto por el uso de HTTPS estricto (Capa 1).
- **Cifrado en Reposo:**
  - **Base de Datos:** Habilitar el cifrado a nivel de disco en el servidor que hospeda PostgreSQL.
  - **Datos Sensibles:** Campos como API keys o tokens de acceso de terceros en la base de datos deben ser cifrados a nivel de aplicación usando el módulo `crypto` de Node.js antes de ser guardados.
- **Hashing de Contraseñas:** Usar `bcrypt` con un factor de costo de al menos `12`.
- **Gestión de Secretos:** Todas las claves, contraseñas y secretos deben ser gestionados a través de variables de entorno y nunca hardcodeados. Usar un archivo `.env` que no se sube a Git.

### Capa 5: Monitoring & Response (The Watchtower)

**Herramientas:** Stack de Grafana (Grafana, Prometheus, Loki).

**Instrucción para Kimi.com:** Generar los archivos de configuración para estas herramientas.

- **Dashboards en Grafana:** Crear dashboards para monitorear:
  - **Seguridad:** Intentos de login fallidos, peticiones bloqueadas por el WAF, errores 403/401, actividad de IPs sospechosas.
  - **Rendimiento:** Latencia de API, uso de CPU/memoria, queries lentas de la DB.
- **Alertas en Prometheus:** Configurar `Alertmanager` para enviar notificaciones (a Discord o Slack) cuando:
  - Un pico de errores 5xx ocurre.
  - El uso de CPU de un servicio supera el 90% por más de 5 minutos.
  - Se detecta un intento de ataque de fuerza bruta (ej. >100 intentos de login fallidos desde una IP en 1 minuto).
- **Logging Centralizado con Loki:** Todos los microservicios deben enviar sus logs a Loki en formato JSON estructurado. Esto permite buscar y correlacionar eventos a través de todo el sistema.

---

## CONCLUSIÓN: UNA FORTALEZA PROACTIVA

Este plan de seguridad 100x va más allá de la simple defensa. Crea un sistema **proactivo y resiliente** que no solo bloquea ataques, sino que también aprende de ellos. La combinación de un perímetro reforzado con Cloudflare, una aplicación blindada con middleware robusto, protección de contenido a nivel de usuario, cifrado de datos de extremo a extremo, y un sistema de vigilancia 24/7, establece un nuevo estándar de seguridad para plataformas sociales. Al implementar estas cinco capas de defensa, PetAmigos no solo protegerá a sus usuarios, sino que convertirá su seguridad en una de sus características más valiosas y confiables y un diferenciador clave en el mercado.
