const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const sanitizePrompt = require('../middleware/promptSanitizer');

const rateLimiter = require('../middleware/rateLimiter');

const { generateContent, generateCreativeContent, getPromptTemplate } = require('../controllers/aiCreativeController');



// Obtener plantilla de prompts (público para UI)

router.get('/template', getPromptTemplate);



// Generar contenido - MÓDULO E (con rate limiter para NO Premium)

router.post('/generate', auth, sanitizePrompt, rateLimiter, generateContent);



// Método legacy (mantener compatibilidad)

router.post('/generate-creative', auth, sanitizePrompt, rateLimiter, generateCreativeContent);



module.exports = router;

