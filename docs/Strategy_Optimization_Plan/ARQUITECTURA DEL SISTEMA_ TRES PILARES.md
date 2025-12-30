_# PLAN DE IMPLEMENTACIÓN DETALLADO - AI HELPDESK 24/7

**Objetivo:** Detallar la implementación del sistema de soporte al cliente automatizado, incluyendo la configuración de Chatwoot, la integración con el modelo Llama 3.1 8B, y la gestión de la base de conocimientos de 150 FAQs en 20 idiomas.

---

## ARQUITECTURA DEL SISTEMA: TRES PILARES

El sistema se basa en la interacción sinérgica de tres componentes Open Source:

1.  **Chatwoot (La Interfaz):** Actúa como el frontend del sistema de soporte. Proporciona el widget de chat para los usuarios, un inbox unificado para los agentes humanos, y una API robusta para la integración con nuestro bot.

2.  **Helpdesk-AI-Service (El Cerebro):** Este microservicio personalizado es el núcleo de la inteligencia. Recibe los mensajes de Chatwoot, los procesa, busca en la base de conocimientos, y decide si responder automáticamente o escalar a un humano.

3.  **Llama 3.1 8B + Ollama (La Inteligencia Artificial):** Utilizamos el modelo de lenguaje Llama 3.1 8B, ejecutado localmente a través de Ollama. Esto nos da el poder de un LLM de última generación sin los costos de API y con total privacidad de los datos.

---

## CONFIGURACIÓN DE CHATWOOT

**Instrucción para Kimi.com:** Generar el siguiente servicio en el archivo `docker-compose.yml`.

```yaml
services:
  chatwoot:
    image: chatwoot/chatwoot:latest
    container_name: petamigos-chatwoot
    ports:
      - "3000:3000"
    volumes:
      - ./chatwoot-data:/app/storage
    environment:
      - POSTGRES_HOST=postgres
      - POSTGRES_USERNAME=postgres
      - POSTGRES_PASSWORD=your_postgres_password
      - REDIS_URL=redis://redis:6379
      - SECRET_KEY_BASE=your_long_random_secret_key_for_chatwoot
      - FRONTEND_URL=https://petmatch-global.netlify.app
    depends_on:
      - postgres
      - redis
```

### Pasos Post-Instalación (Manual)

1.  **Acceder al Panel:** Navegar a `http://localhost:3000`.
2.  **Crear Cuenta de Administrador:** Seguir las instrucciones en pantalla.
3.  **Crear un "Inbox":** Ir a Settings > Inboxes > Add Inbox. Seleccionar "Website" y configurar el widget de chat.
4.  **Obtener API Key:** Ir a Profile Settings > Access Token. Copiar el token. Este será el `CHATWOOT_API_KEY`.
5.  **Crear un Agente Bot:** Ir a Settings > Agents > Add Agent. Crear un agente llamado "PetAmigos AI Bot".
6.  **Configurar Webhook:** Ir a Settings > Integrations > Webhooks. Crear un webhook con la URL `http://helpdesk-service:5016/webhook/chatwoot` y suscribirse a los eventos `message_created` y `conversation_created`.

---

## INTEGRACIÓN CON LLAMA 3.1 8B VÍA OLLAMA

**Instrucción para Kimi.com:** Agregar el servicio de Ollama al `docker-compose.yml`.

```yaml
services:
  ollama:
    image: ollama/ollama
    container_name: petamigos-ollama
    ports:
      - "11434:11434"
    volumes:
      - ./ollama-data:/root/.ollama
    # Descomentar si se tiene GPU NVIDIA para aceleración
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: 1
    #           capabilities: [gpu]
```

### Pull del Modelo

Una vez que el contenedor de Ollama esté corriendo, se debe ejecutar el siguiente comando para descargar el modelo Llama 3.1 8B:

```bash
docker exec -it petamigos-ollama ollama pull llama3.1:8b-instruct
```

### Interacción desde el `helpdesk-ai-service`

El servicio de IA interactuará con Ollama a través de su API REST. Ejemplo de una petición `fetch` desde el `ai.service.ts`:

```typescript
async function generateResponse(prompt: string): Promise<string> {
  const response = await fetch('http://ollama:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.1:8b-instruct',
      prompt: prompt,
      stream: false, // Para obtener la respuesta completa de una vez
    }),
  });
  const data = await response.json();
  return data.response;
}
```

---

## GESTIÓN DE LA BASE DE CONOCIMIENTOS (150 FAQs en 20 IDIOMAS)

**Propósito:** Crear un repositorio de conocimiento que el bot pueda usar para responder preguntas de forma instantánea y precisa.

### Estructura del Archivo (`data/knowledge-base/es.json`)

**Instrucción para Kimi.com:** Generar un archivo `es.json` con 150 preguntas y respuestas comunes para una red social. Luego, usar una herramienta de traducción para generar los otros 19 archivos.

```json
[
  {
    "id": "faq-001",
    "question": "¿Cómo cambio mi foto de perfil?",
    "answer": "Para cambiar tu foto de perfil, ve a tu Perfil, haz clic en tu foto actual y selecciona 'Subir nueva foto'.",
    "category": "profile",
    "tags": ["foto", "perfil", "avatar"]
  },
  {
    "id": "faq-002",
    "question": "Olvidé mi contraseña, ¿qué hago?",
    "answer": "Si olvidaste tu contraseña, ve a la página de inicio de sesión y haz clic en '¿Olvidaste tu contraseña?'. Te enviaremos un enlace para restablecerla.",
    "category": "account",
    "tags": ["contraseña", "resetear", "acceso"]
  }
  // ... 148 más
]
```

### Proceso de Búsqueda Semántica

El `kb.service.ts` implementará la búsqueda de la siguiente manera:

1.  **Carga Inicial:** Al iniciar el servicio, se cargan todos los archivos JSON de la KB en memoria.
2.  **Generación de Embeddings:** Para cada pregunta en la KB, se genera un vector de embedding usando `@xenova/transformers` con el modelo `all-MiniLM-L6-v2`. Estos embeddings se guardan en la base de datos PostgreSQL con la extensión `pgvector` para búsquedas futuras eficientes.
3.  **Búsqueda en Tiempo Real:**
    a.  Se recibe la pregunta del usuario.
    b.  Se genera el embedding de la pregunta del usuario.
    c.  Se ejecuta una consulta en PostgreSQL para encontrar la pregunta más similar usando el operador de similitud coseno (`<=>`).

    ```sql
    SELECT question, answer, 1 - (embedding <=> '[0.123, ...]') AS similarity
    FROM knowledge_base_entries
    WHERE language = 'es'
    ORDER BY similarity DESC
    LIMIT 1;
    ```

---

## FLUJO DE TRABAJO COMPLETO DEL AI HELPDESK

1.  **Usuario Escribe:** El usuario inicia una conversación en el widget de Chatwoot.
2.  **Webhook a Servicio AI:** Chatwoot envía un webhook al `helpdesk-ai-service`.
3.  **Búsqueda en KB:** El servicio busca en la base de conocimientos usando búsqueda semántica.
4.  **Decisión Basada en Confianza:**
    - **Confianza > 85%:** El bot responde con la respuesta de la KB y cierra el ticket.
    - **Confianza 60-85%:** El bot responde con "¿Quizás quisiste decir...?" y 3 opciones. Si el usuario confirma, se da la respuesta. Si no, se escala.
    - **Confianza < 60%:** El bot no encuentra una respuesta clara.
5.  **Fallback a LLM:** Si la confianza es baja, el servicio construye un prompt para Llama 3.1, incluyendo el historial de la conversación y la pregunta del usuario. Ejemplo de prompt:

    ```
    Eres un amigable asistente de soporte para la red social PetAmigos. Un usuario tiene la siguiente pregunta. Responde de forma clara y concisa.

    Historial de la conversación:
    - Usuario: Hola, tengo un problema.

    Pregunta del usuario:
    "¿Cómo puedo hacer para que mis publicaciones sean privadas?"

    Respuesta:
    ```
6.  **Respuesta o Escalación:** El LLM genera una respuesta. El bot la envía al usuario. Si el LLM tampoco puede responder o el usuario sigue insatisfecho, el bot responde "Entendido. Te transferiré con un agente humano para que pueda ayudarte mejor." y asigna el ticket a un agente humano en Chatwoot.

7.  **Aprendizaje:** Todas las interacciones, especialmente las que fueron escaladas, se guardan en una base de datos para ser analizadas posteriormente y sugerir nuevas entradas para la KB.

---

## CONCLUSIÓN

Este plan de implementación detalla un sistema de AI Helpdesk de clase mundial, construido con herramientas 100% Open Source. Proporciona una experiencia de soporte instantánea y precisa a los usuarios, reduce drásticamente la carga de trabajo de los agentes humanos, y escala de forma masiva sin incurrir en los altos costos de licencias de software como Intercom o Zendesk. La combinación de Chatwoot, Llama 3.1 y una base de conocimientos semántica crea una solución robusta, privada y económicamente eficiente.
