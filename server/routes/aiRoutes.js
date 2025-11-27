const express = require('express');

const router = express.Router();

const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const auth = require('../middleware/auth');



// 🔒 Rutas protegidas: requieren autenticación

router.post('/chat', auth, async (req, res) => {

    const { petName, userMessage } = req.body;

    // Mock simple para evitar gastar créditos en pruebas

    // En prod, descomentar la llamada a OpenAI

    res.json({ reply: `${petName} dice: ¡Guau! Eso suena genial. 🐾` });

});

module.exports = router;

