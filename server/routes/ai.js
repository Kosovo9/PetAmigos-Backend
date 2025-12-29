/**
 * AI Routes - Hugging Face Integration
 */
import express from 'express';
import hfService from '../services/huggingfaceService.js';

const router = express.Router();

/**
 * Generate image from text prompt
 * POST /api/ai/generate-image
 */
router.post('/generate-image', async (req, res) => {
    try {
        const { prompt, options } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                error: 'Prompt is required'
            });
        }

        if (!hfService.isConfigured()) {
            return res.status(503).json({
                success: false,
                error: 'AI service not configured. Please add HUGGINGFACE_API_KEY to environment variables.'
            });
        }

        const result = await hfService.generateImage(prompt, options || {});

        if (!result.success) {
            return res.status(500).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error('Image generation route error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
});

/**
 * Generate text completion
 * POST /api/ai/generate-text
 */
router.post('/generate-text', async (req, res) => {
    try {
        const { prompt, model } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                error: 'Prompt is required'
            });
        }

        const result = await hfService.generateText(prompt, model);

        if (!result.success) {
            return res.status(500).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error('Text generation route error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * Chat endpoint with basic responses
 * POST /api/ai/chat
 */
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        // Use simple pattern matching for common queries
        const lowerMessage = message.toLowerCase();
        let reply = '';

        // Training queries
        if (lowerMessage.includes('entrenar') || lowerMessage.includes('training')) {
            if (lowerMessage.includes('perro') || lowerMessage.includes('dog')) {
                reply = '🐕 Para entrenar a tu perro, te recomiendo:\n1. Usar refuerzo positivo con premios\n2. Ser consistente con las órdenes\n3. Sesiones cortas de 10-15 minutos\n4. Mucha paciencia y amor ❤️';
            } else if (lowerMessage.includes('gato') || lowerMessage.includes('cat')) {
                reply = '🐈 Los gatos aprenden mejor con:\n1. Recompensas inmediatas (golosinas)\n2. Paciencia y respeto a su espacio\n3. Sesiones muy cortas\n4. Juegos interactivos';
            } else {
                reply = 'El entrenamiento de mascotas requiere paciencia, consistencia y refuerzo positivo. ¿De qué tipo de mascota estás hablando?';
            }
        }
        // Care queries
        else if (lowerMessage.includes('cuidar') || lowerMessage.includes('cuidado') || lowerMessage.includes('care')) {
            if (lowerMessage.includes('perro') || lowerMessage.includes('dog')) {
                reply = '🐕 Cuidados esenciales para perros:\n1. Ejercicio diario (paseos)\n2. Alimentación balanceada\n3. Agua fresca siempre disponible\n4. Visitas veterinarias cada 6-12 meses\n5. Vacunas al día';
            } else if (lowerMessage.includes('gato') || lowerMessage.includes('cat')) {
                reply = '🐈 Cuidados esenciales para gatos:\n1. Caja de arena limpia diariamente\n2. Rascadores para uñas\n3. Alimentación  de calidad\n4. Estimulación mental (juguetes)\n5. Control veterinario anual';
            } else {
                reply = 'El cuidado de mascotas incluye alimentación, ejercicio, higiene y atención veterinaria. ¿De qué mascota quieres saber más?';
            }
        }
        // Image generation
        else if (lowerMessage.includes('generar') && (lowerMessage.includes('imagen') || lowerMessage.includes('foto'))) {
            reply = '🎨 Para generar una imagen de tu mascota, necesito que me digas:\n1. Tipo de mascota (perro, gato, etc.)\n2. Raza (si la conoces)\n3. Descripción de cómo la quieres ver\n\nPor ejemplo: "Genera una imagen de un golden retriever jugando en el parque"';
        }
        // Health queries
        else if (lowerMessage.includes('salud') || lowerMessage.includes('enferm') || lowerMessage.includes('veterinari')) {
            reply = '⚕️ Para temas de salud de tu mascota, es importante:\n1. Consultar siempre a un veterinario profesional\n2. No automedicar\n3. Observar cambios de comportamiento\n4. Mantener vacunas y desparasitaciones al día\n\n⚠️ Si tu mascota está enferma, contacta un veterinario inmediatamente.';
        }
        // Default response
        else {
            reply = '¡Hola! Soy tu asistente de PetMatch. Puedo ayudarte con:\n\n🎓 Entrenamiento de mascotas\n❤️ Consejos de cuidado\n🎨 Generación de imágenes\n🏥 Información general de salud\n\n¿En qué te puedo ayudar hoy?';
        }

        res.json({
            success: true,
            reply: reply
        });
    } catch (error) {
        console.error('Chat route error:', error);
        res.status(500).json({
            success: false,
            error: 'Chat service error'
        });
    }
});

/**
 * Analyze sentiment
 * POST /api/ai/sentiment
 */
router.post('/sentiment', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                error: 'Text is required'
            });
        }

        const result = await hfService.analyzeSentiment(text);
        res.json(result);
    } catch (error) {
        console.error('Sentiment analysis route error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * Translate text
 * POST /api/ai/translate
 */
router.post('/translate', async (req, res) => {
    try {
        const { text, sourceLang, targetLang } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                error: 'Text is required'
            });
        }

        const result = await hfService.translate(text, sourceLang, targetLang);
        res.json(result);
    } catch (error) {
        console.error('Translation route error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * Health check
 * GET /api/ai/health
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        configured: hfService.isConfigured(),
        timestamp: new Date().toISOString()
    });
});

export default router;
