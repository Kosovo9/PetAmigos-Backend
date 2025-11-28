const mongoose = require('mongoose');
const { buildMegaPrompt } = require('./MegaPromptSystem');

// 🛡️ SISTEMA ANTI-FALLOS 100X - MULTI-ENGINE CON FALLBACKS TOTALES

class ImageGenerationService {

    // 🎨 ENGINE 1: GOOGLE AI (GRATIS - PRINCIPAL)
    static async generateWithGoogleAI(options) {
        try {
            if (!process.env.GOOGLE_AI_API_KEY) {
                throw new Error('Google AI API key not configured');
            }

            const { prompt, negativePrompt } = buildMegaPrompt(options);
            console.log('🎨 Generando con Google AI Studio...');

            const axios = require('axios');
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
                {
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.9,
                        topK: 40,
                        topP: 0.95
                    }
                },
                { timeout: 30000 }
            );

            const imageUrl = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            return {
                success: true,
                imageUrl,
                engine: 'google-ai',
                cost: 0,
                quality: '4K'
            };

        } catch (error) {
            console.error('❌ Google AI falló:', error.message);
            throw error;
        }
    }

    // 🎥 ENGINE 2: HIGGSFIELD (PRO)
    static async generateWithHiggsfield(options) {
        try {
            if (!process.env.HIGGSFIELD_API_KEY) {
                throw new Error('Higgsfield API key not configured');
            }

            const { prompt } = buildMegaPrompt(options);
            console.log('🎥 Generando con Higgsfield...');

            const axios = require('axios');
            const response = await axios.post(
                'https://api.higgsfield.ai/v1/generate',
                {
                    model: 'nano-banana',
                    prompt: prompt,
                    width: 1024,
                    height: 1024,
                    num_inference_steps: 50
                },
                {
                    headers: { 'Authorization': `Bearer ${process.env.HIGGSFIELD_API_KEY}` },
                    timeout: 60000
                }
            );

            return {
                success: true,
                imageUrl: response.data.output_url,
                engine: 'higgsfield',
                cost: 0,
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
            if (!process.env.HUGGINGFACE_TOKEN) {
                throw new Error('HuggingFace token not configured');
            }

            const { prompt, negativePrompt } = buildMegaPrompt(options);
            console.log('🤗 Generando con Hugging Face...');

            const axios = require('axios');
            const response = await axios.post(
                'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
                {
                    inputs: prompt,
                    parameters: {
                        negative_prompt: negativePrompt,
                        num_inference_steps: 50,
                        width: 1024,
                        height: 1024
                    }
                },
                {
                    headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}` },
                    responseType: 'arraybuffer',
                    timeout: 60000
                }
            );

            const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');
            return {
                success: true,
                imageUrl: `data:image/jpeg;base64,${imageBase64}`,
                engine: 'huggingface',
                cost: 0,
                quality: '1K'
            };

        } catch (error) {
            console.error('❌ Hugging Face falló:', error.message);
            throw error;
        }
    }

    // 🎨 FALLBACK LOCAL: Imagen de placeholder profesional
    static async generatePlaceholder(options) {
        console.log('🎨 Generando placeholder (sin APIs configuradas)...');

        // Retornar un placeholder profesional con el prompt del usuario
        const placeholderSvg = `
            <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#7C3AED;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="1024" height="1024" fill="url(#grad)"/>
                <text x="512" y="400" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" font-weight="bold">
                    PetMatch AI
                </text>
                <text x="512" y="500" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.8)" text-anchor="middle">
                    ${options.petSpecies || 'Pet'} - ${options.scenario || 'Christmas'}
                </text>
                <text x="512" y="600" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.6)" text-anchor="middle">
                    Por favor configura las API keys para generar con IA
                </text>
            </svg>
        `;

        const buffer = Buffer.from(placeholderSvg);
        const base64 = buffer.toString('base64');

        return {
            success: true,
            imageUrl: `data:image/svg+xml;base64,${base64}`,
            engine: 'placeholder',
            cost: 0,
            quality: 'placeholder',
            isPlaceholder: true,
            message: '⚠️ API keys no configuradas. Configura GOOGLE_AI_API_KEY para usar IA real.'
        };
    }

    // 🎯 MÉTODO PRINCIPAL CON FALLBACK TOTAL ANTI-FALLOS
    static async generate(options, userTier = 'free') {
        console.log('🚀 Iniciando generación con sistema anti-fallos...');

        const engines = userTier === 'pro'
            ? ['higgsfield', 'google-ai', 'huggingface', 'placeholder']
            : ['google-ai', 'huggingface', 'higgsfield', 'placeholder'];

        let lastError = null;

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
                    case 'placeholder':
                        result = await this.generatePlaceholder(options);
                        break;
                }

                if (result && result.success) {
                    console.log(`✅ Generación exitosa con ${engine}`);
                    return result;
                }

            } catch (error) {
                console.log(`⚠️ ${engine} falló: ${error.message}`);
                lastError = error;
                continue;
            }
        }

        // Si todo falló (incluyendo placeholder), retornar error con info útil
        return {
            success: false,
            error: 'No se pudo generar la imagen',
            details: lastError?.message || 'Unknown error',
            suggestion: 'Configura al menos una API key (GOOGLE_AI_API_KEY recomendado)',
            engine: 'none',
            isPlaceholder: false
        };
    }

    // 🎥 GENERAR VIDEO (SOLO PRO) - CON FALLBACK
    static async generateVideo(imageUrl, prompt) {
        try {
            if (!process.env.HIGGSFIELD_API_KEY) {
                return {
                    success: false,
                    error: 'Higgsfield API key required for video generation',
                    fallback: 'static-image'
                };
            }

            console.log('🎥 Generando video con Sora...');

            const axios = require('axios');
            const response = await axios.post(
                'https://api.higgsfield.ai/v1/generate',
                {
                    model: 'sora',
                    input_image: imageUrl,
                    prompt: prompt || 'Animate with falling snow',
                    duration: 5,
                    fps: 24
                },
                {
                    headers: { 'Authorization': `Bearer ${process.env.HIGGSFIELD_API_KEY}` },
                    timeout: 120000
                }
            );

            return {
                success: true,
                videoUrl: response.data.output_url,
                engine: 'sora',
                duration: 5
            };

        } catch (error) {
            console.error('❌ Video generation falló:', error.message);
            return {
                success: false,
                error: error.message,
                fallback: 'static-image'
            };
        }
    }
}

module.exports = ImageGenerationService;
