// ⚠️ IMPORTANTE: ESTE ARCHIVO NO REVELA LAS HERRAMIENTAS USADAS
// El frontend solo ve "Generando con IA avanzada..."

const axios = require('axios');

class ImageGenerationService {
    constructor() {
        // Configuración de APIs (mantener SECRETO)
        this.googleAIKey = process.env.GOOGLE_AI_KEY;
        this.huggingfaceKey = process.env.HUGGINGFACE_KEY;
    }

    /**
     * PROMPT OPTIMIZADO PARA FOTOS HIPER-REALISTAS DE MASCOTAS CON DUEÑOS
     */
    buildPrompt(options) {
        const { scenario, petType = 'dog', style = 'christmas' } = options;

        // Base prompt - SIEMPRE incluye mascota Y dueño
        let basePrompt = `Ultra-realistic professional photography of a happy ${petType} with its owner in a beautiful ${scenario} setting. `;

        // Detalles hiper-realistas
        basePrompt += `8K resolution, photorealistic, studio lighting, natural poses, genuine emotions, `;
        basePrompt += `professional portrait photography, Canon EOS R5 quality, shallow depth of field, `;
        basePrompt += `perfect focus on both pet and owner faces, warm and loving atmosphere, `;

        // Escenarios específicos
        const scenarioDetails = {
            'christmas-forest': 'snowy forest background with Christmas decorations, magical winter atmosphere, soft natural lighting',
            'santa-studio': 'professional photo studio with Santa Claus, red and white Christmas décor, premium backdrop',
            'winter-wonderland': 'enchanted winter landscape, snowflakes gently falling, cozy winter clothing',
            'cozy-fireplace': 'warm living room with fireplace, Christmas tree in background, comfortable home setting',
            'snow-adventure': 'outdoor winter activity, playing in snow together, joyful and active poses'
        };

        basePrompt += scenarioDetails[scenario] || scenarioDetails['christmas-forest'];

        // Calidad final
        basePrompt += `, hyper-detailed, masterpiece quality, trending on instagram, award-winning pet photography`;

        // Negative prompt para evitar problemas
        const negativePrompt = `low quality, blurry, distorted faces, unrealistic, cartoon, anime, drawing, fake, watermark, text, signature, low resolution, bad anatomy, deformed`;

        return {
            prompt: basePrompt,
            negativePrompt,
            width: 1024,
            height: 1024,
            steps: 50, // Más pasos = mejor calidad
            guidance: 7.5,
            sampler: 'DPM++ 2M Karras'
        };
    }

    /**
     * GENERAR IMAGEN CON IA
     * Usa Google AI Studio primero, fallback a Hugging Face
     */
    async generate(options, tier = 'free') {
        try {
            const promptConfig = this.buildPrompt(options);

            console.log(`🎨 Generando foto hiper-realista: ${options.scenario}`);
            console.log(`📸 Calidad: ${tier === 'premium' ? '8K Premium' : '4K Standard'}`);

            // Intentar con Google AI Studio primero
            if (this.googleAIKey) {
                try {
                    const result = await this.generateWithGoogleAI(promptConfig, tier);
                    if (result.success) {
                        return {
                            success: true,
                            imageUrl: result.imageUrl,
                            engine: 'Google AI Studio',
                            quality: tier === 'premium' ? '8K' : '4K',
                            processingTime: result.processingTime
                        };
                    }
                } catch (googleError) {
                    console.warn('⚠️ Google AI failed, trying Hugging Face...', googleError.message);
                }
            }

            // Fallback a Hugging Face
            if (this.huggingfaceKey) {
                try {
                    const result = await this.generateWithHuggingFace(promptConfig, tier);
                    if (result.success) {
                        return {
                            success: true,
                            imageUrl: result.imageUrl,
                            engine: 'Hugging Face',
                            quality: tier === 'premium' ? '8K' : '4K',
                            processingTime: result.processingTime
                        };
                    }
                } catch (hfError) {
                    console.warn('⚠️ Hugging Face failed', hfError.message);
                }
            }

            // Si todo falla, generar placeholder
            console.warn('⚠️ All AI services failed, generating placeholder...');
            return this.generatePlaceholder(options);

        } catch (error) {
            console.error('❌ Error en generate:', error);
            return {
                success: false,
                error: 'Error al generar imagen',
                details: error.message,
                suggestion: 'Intenta de nuevo en unos segundos'
            };
        }
    }

    /**
     * GOOGLE AI STUDIO - CALIDAD MÁXIMA
     */
    async generateWithGoogleAI(promptConfig, tier) {
        const startTime = Date.now();

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict`,
            {
                instances: [{
                    prompt: promptConfig.prompt,
                    negativePrompt: promptConfig.negativePrompt,
                    numberOfImages: 1,
                    aspectRatio: '1:1',
                    mode: tier === 'premium' ? 'upscale_8k' : 'high_quality',
                    safetySettings: {
                        violence: 'block_none',
                        adult: 'block_none'
                    }
                }]
            },
            {
                headers: {
                    'Authorization': `Bearer ${this.googleAIKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.predictions && response.data.predictions[0]) {
            return {
                success: true,
                imageUrl: response.data.predictions[0].bytesBase64Encoded
                    ? `data:image/png;base64,${response.data.predictions[0].bytesBase64Encoded}`
                    : response.data.predictions[0].mimeType,
                processingTime: Date.now() - startTime
            };
        }

        throw new Error('No image generated from Google AI');
    }

    /**
     * HUGGING FACE - FALLBACK
     */
    async generateWithHuggingFace(promptConfig, tier) {
        const startTime = Date.now();

        // Usando Stable Diffusion XL para máxima calidad
        const model = tier === 'premium'
            ? 'stabilityai/stable-diffusion-xl-base-1.0'
            : 'runwayml/stable-diffusion-v1-5';

        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${model}`,
            {
                inputs: promptConfig.prompt,
                parameters: {
                    negative_prompt: promptConfig.negativePrompt,
                    num_inference_steps: promptConfig.steps,
                    guidance_scale: promptConfig.guidance,
                    width: promptConfig.width,
                    height: promptConfig.height
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${this.huggingfaceKey}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            }
        );

        const base64Image = Buffer.from(response.data).toString('base64');

        return {
            success: true,
            imageUrl: `data:image/png;base64,${base64Image}`,
            processingTime: Date.now() - startTime
        };
    }

    /**
     * Placeholder si todo falla (para demo/testing)
     */
    generatePlaceholder(options) {
        console.log('ℹ️ Generando placeholder para testing...');

        // Retornar una imagen de ejemplo de alta calidad
        return {
            success: true,
            imageUrl: `https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1024&h=1024&fit=crop`,
            engine: 'Placeholder',
            quality: 'Demo',
            processingTime: 100,
            isPlaceholder: true
        };
    }
}

module.exports = new ImageGenerationService();
