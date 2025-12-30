# PLAN DE IMPLEMENTACIÓN - AI HELPDESK 24/7 MULTIIDIOMA

**Objetivo:** Implementar un sistema de soporte al cliente automatizado con inteligencia artificial que funcione las 24 horas del día, los 7 días de la semana, en los 20 idiomas principales de la plataforma. El sistema debe poder responder automáticamente a las 150 preguntas más frecuentes y aprender de nuevas interacciones.

---

## ARQUITECTURA DEL SISTEMA

El sistema AI Helpdesk se compone de tres elementos principales:

1.  **Chatwoot** (Open Source): Plataforma de soporte al cliente que proporciona la interfaz de chat, gestión de tickets y panel de administración.
2.  **Servicio de IA (Helpdesk-AI-Service)**: Microservicio personalizado que contiene la lógica de procesamiento de lenguaje natural (NLP), búsqueda en la base de conocimientos y generación de respuestas.
3.  **Base de Conocimientos (Knowledge Base)**: Repositorio estructurado de preguntas frecuentes (FAQs) y respuestas en los 20 idiomas.

---

## ESTRUCTURA DE CARPETAS Y ARCHIVOS

```
petamigos-global/
├── services/
│   ├── 16-helpdesk-service/        # Servicio principal de Helpdesk
│   │   ├── src/
│   │   │   ├── index.ts            # Punto de entrada
│   │   │   ├── routes/
│   │   │   │   ├── webhook.routes.ts   # Webhook de Chatwoot
│   │   │   │   └── admin.routes.ts     # Rutas de administración
│   │   │   ├── controllers/
│   │   │   │   ├── webhook.controller.ts
│   │   │   │   └── admin.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── chatwoot.service.ts     # Cliente API de Chatwoot
│   │   │   │   ├── ai.service.ts           # Lógica de IA (LLM)
│   │   │   │   ├── kb.service.ts           # Búsqueda en Knowledge Base
│   │   │   │   ├── translation.service.ts  # Traducción automática
│   │   │   │   └── learning.service.ts     # Aprendizaje automático
│   │   │   ├── models/
│   │   │   │   ├── ticket.model.ts
│   │   │   │   ├── conversation.model.ts
│   │   │   │   └── kb.model.ts
│   │   │   └── utils/
│   │   │       ├── embeddings.ts       # Generación de embeddings
│   │   │       └── similarity.ts       # Cálculo de similitud
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── 20-i18n-service/            # Servicio de internacionalización
│       ├── src/
│       │   ├── index.ts
│       │   ├── routes/
│       │   │   └── translate.routes.ts
│       │   ├── controllers/
│       │   │   └── translate.controller.ts
│       │   └── services/
│       │       └── translate.service.ts
│       ├── package.json
│       └── Dockerfile
│
├── data/
│   └── knowledge-base/             # Base de conocimientos multiidioma
│       ├── en.json                 # Inglés
│       ├── es.json                 # Español
│       ├── fr.json                 # Francés
│       ├── de.json                 # Alemán
│       ├── pt.json                 # Portugués
│       ├── it.json                 # Italiano
│       ├── ja.json                 # Japonés
│       ├── ko.json                 # Coreano
│       ├── zh.json                 # Chino
│       ├── ru.json                 # Ruso
│       ├── ar.json                 # Árabe
│       ├── hi.json                 # Hindi
│       ├── bn.json                 # Bengalí
│       ├── ur.json                 # Urdu
│       ├── id.json                 # Indonesio
│       ├── tr.json                 # Turco
│       ├── th.json                 # Tailandés
│       ├── pl.json                 # Polaco
│       ├── nl.json                 # Neerlandés
│       └── vi.json                 # Vietnamita
│
└── docker-compose.yml              # Incluir Chatwoot
```

---

## DETALLE DE ARCHIVOS A GENERAR POR KIMI.COM

### 1. `services/16-helpdesk-service/`

#### `src/index.ts`
Punto de entrada del servicio. Inicia el servidor Fastify, conecta a la base de datos y registra las rutas. También inicia el worker de aprendizaje automático.

#### `src/routes/webhook.routes.ts`
Define la ruta POST `/webhook/chatwoot` que recibe eventos de Chatwoot (nuevo mensaje, ticket creado, etc.).

#### `src/controllers/webhook.controller.ts`
Lógica principal del chatbot:
1.  Recibe un evento de Chatwoot (nuevo mensaje del usuario).
2.  Extrae el texto del mensaje y el idioma del usuario.
3.  Llama a `kb.service.ts` para buscar en la base de conocimientos.
4.  Si encuentra una respuesta con alta confianza (> 85%), responde automáticamente.
5.  Si la confianza es media (60-85%), responde con "¿Te refieres a...?" y opciones.
6.  Si la confianza es baja (< 60%), escala el ticket a un agente humano.
7.  Registra la interacción en la base de datos para aprendizaje futuro.

#### `src/services/chatwoot.service.ts`
Cliente para la API de Chatwoot. Métodos:
- `sendMessage(conversationId, message)`: Envía un mensaje de respuesta.
- `assignToAgent(conversationId, agentId)`: Asigna un ticket a un agente humano.
- `addLabel(conversationId, label)`: Agrega una etiqueta al ticket (ej. "auto-resolved").

#### `src/services/ai.service.ts`
Lógica de IA usando un LLM local (Llama 3.1 8B o Qwen 2.5) a través de Ollama:
- `generateResponse(question, context)`: Genera una respuesta usando el LLM cuando no hay una respuesta exacta en la KB.
- `classifyIntent(question)`: Clasifica la intención del usuario (ej. "pregunta técnica", "queja", "solicitud de reembolso").

#### `src/services/kb.service.ts`
Búsqueda en la base de conocimientos:
- `search(question, language)`: Busca la pregunta más similar en la KB del idioma especificado.
    1.  Genera el embedding del vector de la pregunta del usuario usando `sentence-transformers`.
    2.  Calcula la similitud coseno con todos los embeddings de las preguntas en la KB.
    3.  Devuelve la respuesta con mayor similitud y su score de confianza.
- `loadKnowledgeBase()`: Carga todos los archivos JSON de la KB al iniciar el servicio y genera los embeddings.

#### `src/services/translation.service.ts`
Traducción automática cuando el usuario escribe en un idioma no soportado directamente:
- `detectLanguage(text)`: Detecta el idioma del texto.
- `translate(text, fromLang, toLang)`: Traduce el texto usando una API gratuita (ej. LibreTranslate) o un modelo local.

#### `src/services/learning.service.ts`
Aprendizaje automático a partir de las interacciones:
- `recordInteraction(question, answer, wasHelpful, language)`: Registra cada interacción en la DB.
- `analyzeUnresolvedTickets()`: Job recurrente que analiza los tickets que fueron escalados a humanos para identificar nuevas preguntas frecuentes.
- `suggestNewFAQ(question, answer, language)`: Sugiere agregar una nueva entrada a la KB basándose en patrones.

#### `src/models/ticket.model.ts`
Consultas a la base de datos para la tabla `helpdesk_tickets`.

#### `src/models/kb.model.ts`
Consultas a la base de datos para la tabla `knowledge_base_entries` (para el aprendizaje dinámico).

#### `src/utils/embeddings.ts`
Utilidad para generar embeddings de texto usando `@xenova/transformers` (Sentence Transformers en JavaScript).

#### `src/utils/similarity.ts`
Utilidad para calcular la similitud coseno entre dos vectores.

### 2. `data/knowledge-base/`

Cada archivo JSON contiene un array de objetos con la estructura:

```json
[
  {
    "id": "faq-001",
    "question": "¿Cómo creo una cuenta?",
    "answer": "Para crear una cuenta, haz clic en el botón 'Registrarse' en la página principal, ingresa tu correo electrónico y elige una contraseña segura. Luego, verifica tu correo electrónico haciendo clic en el enlace que te enviamos.",
    "category": "account",
    "tags": ["registro", "cuenta", "email"],
    "embedding": [0.123, 0.456, ...] // Vector de 384 dimensiones (se genera al cargar)
  },
  {
    "id": "faq-002",
    "question": "¿Cómo restablezco mi contraseña?",
    "answer": "Si olvidaste tu contraseña, haz clic en '¿Olvidaste tu contraseña?' en la página de inicio de sesión. Ingresa tu correo electrónico y te enviaremos un enlace para crear una nueva contraseña.",
    "category": "account",
    "tags": ["contraseña", "resetear", "olvidé"],
    "embedding": [0.789, 0.012, ...]
  }
  // ... 148 preguntas más
]
```

**Instrucción para Kimi.com:** Generar un archivo `es.json` (español) con las 150 preguntas frecuentes más comunes de una plataforma social (cuenta, privacidad, publicaciones, seguridad, pagos, etc.). Luego, usar un servicio de traducción (ej. Google Translate API o DeepL) para generar los otros 19 archivos de idiomas. Los embeddings se generarán automáticamente al iniciar el servicio.

### 3. `services/20-i18n-service/`

Microservicio dedicado a la internacionalización y traducción.

#### `src/services/translate.service.ts`
- `translate(text, fromLang, toLang)`: Usa una API de traducción (LibreTranslate auto-hospedado o Google Translate API).
- `detectLanguage(text)`: Detecta el idioma del texto.

---

## INTEGRACIÓN CON CHATWOOT

### Instalación de Chatwoot
Chatwoot se ejecutará como un contenedor Docker adicional. Agregar a `docker-compose.yml`:

```yaml
chatwoot:
  image: chatwoot/chatwoot:latest
  ports:
    - "3000:3000"
  environment:
    - POSTGRES_HOST=postgres
    - POSTGRES_USERNAME=chatwoot
    - POSTGRES_PASSWORD=chatwoot_password
    - REDIS_URL=redis://redis:6379
    - SECRET_KEY_BASE=your_secret_key_here
  depends_on:
    - postgres
    - redis
```

### Configuración del Webhook
En el panel de administración de Chatwoot:
1.  Ir a **Settings > Integrations > Webhooks**.
2.  Crear un nuevo webhook con la URL: `http://helpdesk-service:5016/webhook/chatwoot`.
3.  Seleccionar los eventos: `message_created`, `conversation_created`.

### Flujo de Trabajo
1.  Usuario envía un mensaje en el chat de la plataforma (frontend).
2.  El frontend envía el mensaje a Chatwoot a través de su API.
3.  Chatwoot dispara un webhook al `helpdesk-service`.
4.  El `helpdesk-service` procesa el mensaje, busca en la KB y responde.
5.  Si no puede resolver, asigna el ticket a un agente humano en Chatwoot.

---

## APRENDIZAJE AUTOMÁTICO

### Proceso de Aprendizaje
1.  **Recopilación de Datos:** Cada interacción se registra en la tabla `helpdesk_interactions` con los campos: `question`, `answer_provided`, `was_helpful` (boolean), `language`, `timestamp`.
2.  **Análisis de Tickets Escalados:** Un job recurrente (cada 24 horas) analiza los tickets que fueron escalados a humanos. Extrae las preguntas y las respuestas dadas por los agentes.
3.  **Identificación de Patrones:** Usa clustering (ej. K-Means) para agrupar preguntas similares.
4.  **Sugerencia de Nuevas FAQs:** Si un cluster tiene más de 10 preguntas similares, el sistema sugiere agregar una nueva entrada a la KB. Un administrador revisa y aprueba la sugerencia.
5.  **Actualización de la KB:** Las nuevas FAQs aprobadas se agregan a los archivos JSON y se regeneran los embeddings.

### Tabla de Base de Datos

**`helpdesk_interactions`**
```sql
id (UUID, PK)
user_id (UUID, FK)
question (TEXT)
answer_provided (TEXT)
was_helpful (BOOLEAN)
confidence_score (FLOAT)
language (VARCHAR)
resolved_automatically (BOOLEAN)
escalated_to_human (BOOLEAN)
created_at (TIMESTAMP)
```

**`knowledge_base_entries`** (para el aprendizaje dinámico)
```sql
id (UUID, PK)
question (TEXT)
answer (TEXT)
category (VARCHAR)
language (VARCHAR)
embedding (VECTOR) -- Usar extensión pgvector
approved (BOOLEAN)
created_at (TIMESTAMP)
```

---

## INSTRUCCIONES ADICIONALES PARA KIMI.COM

1.  **Modelo de IA:** Usar **Llama 3.1 8B Instruct** a través de Ollama para la generación de respuestas cuando no hay una coincidencia exacta en la KB. Ollama debe ejecutarse en un contenedor Docker separado.
2.  **Embeddings:** Usar el modelo `all-MiniLM-L6-v2` de Sentence Transformers (disponible en `@xenova/transformers`) para generar embeddings de 384 dimensiones.
3.  **Base de Datos de Vectores:** Instalar la extensión `pgvector` en PostgreSQL para almacenar y buscar embeddings de manera eficiente.
4.  **Interfaz de Administración:** Crear un panel simple en el frontend para que los administradores puedan:
    - Ver las interacciones recientes.
    - Aprobar nuevas FAQs sugeridas.
    - Editar la base de conocimientos.
5.  **Multiidioma:** El sistema debe detectar automáticamente el idioma del usuario basándose en su configuración de perfil o en el idioma del mensaje. Si el usuario escribe en un idioma no soportado, traducir la pregunta al inglés, buscar en la KB en inglés, y traducir la respuesta de vuelta al idioma del usuario.

Este sistema proporcionará un soporte al cliente de clase mundial, reduciendo la carga de trabajo de los agentes humanos y mejorando la satisfacción del usuario.
