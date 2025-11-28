const axios = require('axios');
const { buildMegaPrompt } = require('./MegaPromptSystem');

// 🤖 MULTI-ENGINE AI GENERATION SERVICE
// Prioridad: Google AI (gratis) → Higgsfield (pro) → Hugging Face (fallback)

class ImageGenerationService {

    // 🎨 ENGINE 1: GOOGLE AI STUDIO (GRATIS - PRINCIPAL)
    static async generateWithGoogleAI(options) {
        try {
            const { prompt, negativePrompt } = buildMegaPrompt(options);

            console.log('🎨 Generando con Google AI Studio (Gemini 2.0 Flash)...');

            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
                {
                    contents: [{
                        parts: [{
                            text: `Generate a hyper-realistic image based on this description: ${prompt}\n\nAvoid: ${negativePrompt}\n\nReturn only the image URL.`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.9,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 8192
                    }
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            // Extraer URL de imagen de la respuesta
            const imageUrl = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

            return {
                success: true,
                imageUrl,
                engine: 'google-ai',
                cost: 0, // GRATIS
                quality: '4K'
            };

        } catch (error) {
            console.error('❌ Google AI falló:', error.message);
            throw error;
        }
    }

    // 🎥 ENGINE 2: HIGGSFIELD.AI (PRO - SORA + NANO BANANA)
    static async generateWithHiggsfield(options) {
        try {
            const { prompt } = buildMegaPrompt(options);

            console.log('🎥 Generando con Higgsfield.ai (Nano Banana)...');

            const response = await axios.post(
                'https://api.higgsfield.ai/v1/generate',
                {
                    model: 'nano-banana', // O 'sora' para video
                    prompt: prompt,
                    width: 1024,
                    height: 1024,
                    num_inference_steps: 50,
                    guidance_scale: 7.5
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.HIGGSFIELD_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                success: true,
                imageUrl: response.data.output_url,
                engine: 'higgsfield',
                cost: 0, // Incluido en plan PRO
                quality: '8K'
            };

        } catch (error) {
            console.error('❌ Higgsfield falló:', error.message);
            throw error;
        }
    }

    // 🤗 ENGINE 3: HUGGING FACE (GRATIS - FALLBACK)
    static async generateWithHuggingFace(options) {
        try {
            const { prompt, negativePrompt } = buildMegaPrompt(options);

            console.log('🤗 Generando con Hugging Face (Stable Diffusion XL)...');

            const response = await axios.post(
                'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
                {
                    inputs: prompt,
                    parameters: {
                        negative_prompt: negativePrompt,
                        num_inference_steps: 50,
                        guidance_scale: 7.5,
                        width: 1024,
                        height: 1024
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer'
                }
            );

            // Convertir buffer a base64
            const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');
            const imageUrl = `data:image/jpeg;base64,${imageBase64}`;

            return {
                success: true,
                imageUrl,
                engine: 'huggingface',
                cost: 0, // GRATIS
                quality: '1K'
            };

        } catch (error) {
            console.error('❌ Hugging Face falló:', error.message);
            throw error;
        }
    }

    // 🎯 MÉTODO PRINCIPAL CON FALLBACK AUTOMÁTICO
    static async generate(options, userTier = 'free') {
        const engines = [];

        // Determinar orden de engines según tier del usuario
        if (userTier === 'pro') {
            // Pro users: Mejor calidad primero
            engines.push('higgsfield', 'google-ai', 'huggingface');
        } else {
            // Free users: Gratis primero
            engines.push('google-ai', 'huggingface', 'higgsfield');
        }

        // Intentar con cada engine hasta que uno funcione
        for (const engine of engines) {
            try {
                let result;

                switch (engine) {
                    case 'google-ai':
                        result = await this.generateWithGoogleAI(options);
                        break;
                    case 'higgsfield':
                        result = await this.generateWithHiggsfield(options);
                        break;
                    case 'huggingface':
                        result = await this.generateWithHuggingFace(options);
                        break;
                }

                if (result.success) {
                    console.log(`✅ Imagen generada exitosamente con ${engine}`);
                    return result;
                }

            } catch (error) {
                console.log(`⚠️ ${engine} falló, intentando siguiente engine...`);
                continue;
            }
        }

        // Si todos fallaron
        throw new Error('Todos los engines de IA fallaron. Intenta de nuevo.');
    }

    // 🎥 GENERAR VIDEO CON SORA (SOLO PRO)
    static async generateVideo(imageUrl, prompt) {
        try {
            console.log('🎥 Generando video con Sora...');

            const response = await axios.post(
                'https://api.higgsfield.ai/v1/generate',
                {
                    model: 'sora',
                    input_image: imageUrl,
                    prompt: prompt || 'Animate this Christmas pet photo with falling snow and twinkling lights',
                    duration: 5,
                    fps: 24
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.HIGGSFIELD_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                success: true,
                videoUrl: response.data.output_url,
                engine: 'sora',
                duration: 5
            };

        } catch (error) {
            console.error('❌ Sora video generation falló:', error.message);
            throw error;
        }
    }
}

module.exports = ImageGenerationService;
