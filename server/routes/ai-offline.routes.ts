import { Router } from "express";
import { rateLimit } from "../middleware/simpleRateLimit";

const router = Router();

// Fallback AI Controller (No OpenAI Key needed)
router.post('/chat', rateLimit(5, 60000), async (req, res) => {
    const { message } = req.body;

    // Simulador de IA sin OpenAI (100% offline)
    const responses = [
        "¡Guau! Eso suena genial 🐾",
        "Mi humano siempre me da treats cuando digo eso 😋",
        "¿Podemos ir al parque ahora?",
        "¡Me encanta jugar contigo! 🎾",
        "Zzz... estaba tomando una siesta, ¿qué pasa?",
        "¡Huelo comida! ¿Tienes algo rico?",
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // Simulate delay for realism
    setTimeout(() => {
        res.json({ response: randomResponse, source: 'offline-ai' });
    }, 1000);
});

export default router;
