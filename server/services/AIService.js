const axios = require('axios');



// ============================================

// AI SERVICE - MÓDULO E

// Servicio de capa para llamadas a APIs de IA

// ============================================



/**

 * Llamar a Higgsfield.ai API (Premium - 4K/8K)

 */

exports.callHiggsfieldAPI = async (prompt, style, resolution = '4K_MAX') => {

    const apiKey = process.env.HIGGSFIELD_API_KEY;

    

    if (!apiKey) {

        throw new Error("Higgsfield API Key no configurada");

    }

    try {

        const response = await axios.post(

            'https://api.higgsfield.ai/v1/image/generate',

            {

                prompt: prompt,

                style: style || 'realistic',

                resolution: resolution,

                model: 'realistic-v2',

                quality: 'ultra'

            },

            {

                headers: {

                    'Authorization': `Bearer ${apiKey}`,

                    'Content-Type': 'application/json'

                },

                timeout: 60000

            }

        );



        return {

            url: response.data.url || response.data.data?.url,

            id: response.data.id,

            resolution: resolution

        };

    } catch (error) {

        console.error("Error en Higgsfield API:", error.response?.data || error.message);

        throw error;

    }

};



/**

 * Llamar a Google AI Studio API (Base/Gratis - 1K)

 */

exports.callGoogleAIAPI = async (prompt, style, resolution = '1K') => {

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY;

    

    if (!apiKey) {

        throw new Error("Google AI API Key no configurada");

    }

    try {

        // Google AI para imágenes (Imagen API)

        const response = await axios.post(

            `https://generativelanguage.googleapis.com/v1beta/models/imagen-3:generateImages?key=${apiKey}`,

            {

                prompt: `${prompt}, ${style || 'realistic'}`,

                number_of_images: 1,

                aspect_ratio: '16:9'

            },

            {

                headers: {

                    'Content-Type': 'application/json'

                },

                timeout: 30000

            }

        );



        return {

            url: response.data.generatedImages?.[0]?.imageUrl || response.data.url,

            id: response.data.id,

            resolution: '1K'

        };

    } catch (error) {

        console.error("Error en Google AI API:", error.response?.data || error.message);

        throw error;

    }

};



