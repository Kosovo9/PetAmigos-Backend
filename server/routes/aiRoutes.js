const express = require('express');

const router = express.Router();

const axios = require('axios');

const auth = require('../middleware/auth');



// ============================================

// AI CREATIVE STUDIO - CONEXIÓN DE INTELIGENCIA PREDICTIVA

// Google AI Studio / Higgsfield.ai / OpenAI

// ============================================



/**

 * Endpoint principal para recibir prompts y generar respuestas con IA

 * Prioridad: Google AI Studio > Higgsfield.ai > OpenAI

 */

router.post('/chat', auth, async (req, res) => {

    try {

        const { petName, userMessage, provider = 'google' } = req.body;



        let response;

        switch (provider.toLowerCase()) {

            case 'google':

                response = await callGoogleAI(petName, userMessage);

                break;

            case 'higgsfield':

                response = await callHiggsfieldAI(petName, userMessage);

                break;

            case 'openai':

            default:

                response = await callOpenAI(petName, userMessage);

                break;

        }



        res.status(200).json({

            success: true,

            reply: response,

            provider: provider.toLowerCase()

        });



    } catch (error) {

        console.error("Error en AI chat:", error);

        res.status(500).json({ 

            error: "Error al procesar solicitud de IA.",

            fallback: `${req.body.petName} dice: ¡Guau! Eso suena genial. 🐾`

        });

    }

});



/**

 * Llamada a Google AI Studio

 */

async function callGoogleAI(petName, userMessage) {

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY;

    

    if (!apiKey) {

        throw new Error("Google AI API Key no configurada");

    }



    try {

        const response = await axios.post(

            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,

            {

                contents: [{

                    parts: [{

                        text: `Eres ${petName}, una mascota inteligente y cariñosa. Responde de forma amigable y divertida a: ${userMessage}`

                    }]

                }]

            },

            {

                headers: {

                    'Content-Type': 'application/json'

                }

            }

        );



        return response.data.candidates[0].content.parts[0].text;

    } catch (error) {

        console.error("Error en Google AI:", error.response?.data || error.message);

        throw error;

    }

}



/**

 * Llamada a Higgsfield.ai

 */

async function callHiggsfieldAI(petName, userMessage) {

    const apiKey = process.env.HIGGSFIELD_API_KEY;

    

    if (!apiKey) {

        throw new Error("Higgsfield API Key no configurada");

    }



    try {

        const response = await axios.post(

            'https://api.higgsfield.ai/v1/chat/completions',

            {

                model: 'default',

                messages: [{

                    role: 'system',

                    content: `Eres ${petName}, una mascota inteligente.`

                }, {

                    role: 'user',

                    content: userMessage

                }]

            },

            {

                headers: {

                    'Authorization': `Bearer ${apiKey}`,

                    'Content-Type': 'application/json'

                }

            }

        );



        return response.data.choices[0].message.content;

    } catch (error) {

        console.error("Error en Higgsfield AI:", error.response?.data || error.message);

        throw error;

    }

}



/**

 * Llamada a OpenAI (Fallback)

 */

async function callOpenAI(petName, userMessage) {

    const OpenAI = require('openai');

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    

    if (!process.env.OPENAI_API_KEY) {

        // Mock si no hay API key

        return `${petName} dice: ¡Guau! Eso suena genial. 🐾`;

    }



    try {

        const completion = await openai.chat.completions.create({

            model: "gpt-3.5-turbo",

            messages: [{

                role: "system",

                content: `Eres ${petName}, una mascota inteligente y cariñosa.`

            }, {

                role: "user",

                content: userMessage

            }]

        });



        return completion.choices[0].message.content;

    } catch (error) {

        console.error("Error en OpenAI:", error.message);

        return `${petName} dice: ¡Guau! Eso suena genial. 🐾`;

    }

}



module.exports = router;

