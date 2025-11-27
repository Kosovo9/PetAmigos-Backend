const PetProfile = require('../models/PetProfile');
const User = require('../models/User');
const axios = require('axios');

// ============================================
// AI CREATIVE STUDIO CONTROLLER
// Estrategia de Contenido 10X - Prompts Nivel Dios
// ============================================

/**
 * Generar contenido - MÓDULO E (AI Creative Studio)
 * Verifica membresía y redirige al motor de IA apropiado
 */
exports.generateContent = async (req, res) => {
    try {
        const { userId, prompt, style, resolution = '1K' } = req.body;
        const actualUserId = req.userId || userId;

        // 1. Verificar la Membresía (El Paywall 10X)
        const user = await User.findById(actualUserId);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        // Obtener perfil de mascota para verificar isLifetimeMember
        const pet = await PetProfile.findOne({ owner: actualUserId });
        const isPremium = pet?.isLifetimeMember || false;

        let engineUsed = 'BASE_GOOGLE_AI';
        let generationResult;

        if (isPremium && resolution === '4K_MAX') {
            // Opción Premium: Se usa Higgsfield.ai para calidad Nivel Dios
            engineUsed = 'PREMIUM_HIGGSFIELD';
            generationResult = await callHiggsfieldAPI(prompt, style, resolution);
        } else {
            // Opción Base/Gratuita/Límite de No-Miembros (Costo controlado)
            generationResult = await callGoogleAIAPI(prompt, style, resolution);
        }

        if (!generationResult) {
            return res.status(500).json({ error: 'Fallo al generar contenido. Verifique el prompt.' });
        }

        // 2. Registrar el uso y devolver el contenido
        await logAICreation(actualUserId, engineUsed);

        res.status(200).json({
            success: true,
            engine: engineUsed,
            imageUrl: generationResult.url,
            message: isPremium ? "¡Tu creación Nivel Dios está lista!" : "Generación básica completada."
        });

    } catch (error) {
        console.error("Error en generateContent:", error);
        res.status(500).json({ error: "Error al generar contenido." });
    }
};

/**
 * Generar contenido con Prompt Nivel Dios (Método legacy - mantener compatibilidad)
 * Diferencia entre Tier Base (Google AI) y Premium (Higgsfield.ai)
 */
exports.generateCreativeContent = async (req, res) => {
    try {
        const { 
            petId, 
            subject, 
            action, 
            scenario, 
            styleKeys,
            contentType = 'image' // 'image' o 'video'
        } = req.body;
        
        const userId = req.userId;

        // 1. Validar mascota y obtener tier del usuario
        const pet = await PetProfile.findById(petId);
        if (!pet || pet.owner.toString() !== userId) {
            return res.status(404).json({ error: "Mascota no encontrada." });
        }

        const user = await User.findById(userId);
        const isPremium = pet.isLifetimeMember || user?.role === 'premium';

        // 2. Construir prompt Nivel Dios
        const prompt = buildGodTierPrompt(subject, action, scenario, styleKeys, isPremium);

        // 3. Sanitizar prompt (WAF)
        const sanitizedPrompt = sanitizePrompt(prompt);

        // 4. Generar contenido según tier
        let result;
        if (isPremium) {
            // Tier Premium: Higgsfield.ai (4K/8K)
            result = await generateWithHiggsfield(sanitizedPrompt, contentType);
        } else {
            // Tier Base: Google AI Studio (1K estándar)
            result = await generateWithGoogleAI(sanitizedPrompt, contentType);
        }

        // 5. Registrar uso (para cost management)
        await logAICost(userId, isPremium ? 'higgsfield' : 'google', contentType);

        res.status(200).json({
            success: true,
            content: result,
            tier: isPremium ? 'premium' : 'base',
            resolution: isPremium ? '4K/8K' : '1K',
            prompt: sanitizedPrompt
        });

    } catch (error) {
        console.error("Error en generateCreativeContent:", error);
        res.status(500).json({ error: "Error al generar contenido." });
    }
};

/**
 * Construir Prompt Nivel Dios
 */
function buildGodTierPrompt(subject, action, scenario, styleKeys, isPremium) {
    let prompt = `${subject}, ${action}, ${scenario}`;
    
    if (isPremium) {
        // Tier Premium: Todas las claves 10X de estilo
        const premiumStyles = styleKeys || [
            'cinematic_photography',
            'ultra_realistic_8k',
            'neo_noir',
            'volumetric_lighting',
            'national_geographic_quality'
        ];
        prompt += `, ${premiumStyles.join(', ')}`;
    } else {
        // Tier Base: Solo 2 palabras clave básicas
        const baseStyles = styleKeys?.slice(0, 2) || ['realistic', 'high_quality'];
        prompt += `, ${baseStyles.join(', ')}`;
    }
    
    return prompt;
}

/**
 * Sanitizar prompt (Blindaje contra inyecciones)
 */
function sanitizePrompt(prompt) {
    // Remover caracteres peligrosos
    let sanitized = prompt
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim();
    
    // Limitar longitud
    if (sanitized.length > 500) {
        sanitized = sanitized.substring(0, 500);
    }
    
    return sanitized;
}

/**
 * Generar con Higgsfield.ai (Premium - 4K/8K)
 */
async function generateWithHiggsfield(prompt, contentType) {
    const apiKey = process.env.HIGGSFIELD_API_KEY;
    
    if (!apiKey) {
        throw new Error("Higgsfield API Key no configurada");
    }

    try {
        const endpoint = contentType === 'video' 
            ? 'https://api.higgsfield.ai/v1/video/generate'
            : 'https://api.higgsfield.ai/v1/image/generate';

        const response = await axios.post(
            endpoint,
            {
                prompt: prompt,
                model: 'realistic-v2',
                resolution: '8k',
                quality: 'ultra',
                style: 'cinematic'
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000 // 60 segundos para generación
            }
        );

        return {
            url: response.data.url || response.data.data?.url,
            id: response.data.id,
            provider: 'higgsfield',
            resolution: '8K'
        };
    } catch (error) {
        console.error("Error en Higgsfield:", error.response?.data || error.message);
        // Fallback a Google AI si falla
        return await generateWithGoogleAI(prompt, contentType);
    }
}

/**
 * Generar con Google AI Studio (Base - 1K)
 */
async function generateWithGoogleAI(prompt, contentType) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
        throw new Error("Google AI API Key no configurada");
    }

    try {
        if (contentType === 'image') {
            // Google AI para imágenes (usando Imagen API si está disponible)
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/imagen-3:generateImages?key=${apiKey}`,
                {
                    prompt: prompt,
                    number_of_images: 1,
                    aspect_ratio: '16:9'
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                url: response.data.generatedImages?.[0]?.imageUrl || response.data.url,
                id: response.data.id,
                provider: 'google_ai',
                resolution: '1K'
            };
        } else {
            // Para video, usar texto descriptivo (Google AI no tiene video aún)
            const textResponse = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
                {
                    contents: [{
                        parts: [{
                            text: `Describe un video de: ${prompt}`
                        }]
                    }]
                }
            );

            return {
                description: textResponse.data.candidates[0].content.parts[0].text,
                provider: 'google_ai',
                resolution: '1K',
                note: 'Video generation requires Premium tier'
            };
        }
    } catch (error) {
        console.error("Error en Google AI:", error.response?.data || error.message);
        throw error;
    }
}

/**
 * Registrar uso de IA (Cost Management)
 */
async function logAICreation(userId, engineUsed) {
    // Aquí podrías guardar en una tabla de logs para tracking de costos
    console.log(`[AI Creation] User: ${userId}, Engine: ${engineUsed}, Timestamp: ${new Date()}`);
    
    // Opcional: Guardar en MongoDB para analytics
    // await AICostLog.create({ userId, engine: engineUsed, timestamp: new Date() });
}

/**
 * Obtener plantilla de prompts guiados
 */
exports.getPromptTemplate = (req, res) => {
    const template = {
        fields: [
            {
                name: 'subject',
                label: 'Sujeto Principal',
                placeholder: 'Nombre y descripción detallada de tu mascota',
                example: 'Mi golden retriever, Leo, con ojos miel',
                required: true,
                hints: ['Leo', 'golden retriever', 'ojos miel']
            },
            {
                name: 'action',
                label: 'Acción / Emoción',
                placeholder: '¿Qué está haciendo la mascota?',
                example: 'Saltando en un lago, feliz, jugando',
                required: true,
                hints: ['saltando', 'acción', 'feliz']
            },
            {
                name: 'scenario',
                label: 'Escenario / Fondo',
                placeholder: '¿Dónde está?',
                example: 'Montañas nevadas al atardecer, cabaña de madera',
                required: true,
                hints: ['montañas nevadas', 'cabaña', 'atardecer']
            },
            {
                name: 'styleKeys',
                label: 'Estilo de Render (CRÍTICO)',
                placeholder: 'Estilo de renderizado',
                example: 'Fotografía Cinematográfica, Ultra-detallado 8K, Tono Neo-Noir',
                required: false,
                hints: ['cinematic_photography', 'ultra_realistic_8k', 'neo_noir', 'volumetric_lighting'],
                premiumOnly: true,
                description: 'Solo disponible en Tier Premium. Define la calidad Nivel Dios del contenido.'
            }
        ],
        tiers: {
            base: {
                name: 'Base / Gratis',
                engines: ['Google AI Studio', 'Open Source'],
                resolution: '1K',
                styleKeysLimit: 2,
                features: [
                    'Genera imágenes en resolución estándar',
                    'Prompts con máximo 2 palabras clave de estilo',
                    'Ideal para pruebas y contenido básico'
                ]
            },
            premium: {
                name: 'Premium (Lifetime)',
                engines: ['Higgsfield.ai', 'Google AI Studio Avanzado'],
                resolution: '4K/8K',
                styleKeysLimit: 'Ilimitado',
                features: [
                    'Genera imágenes y videos en resolución 4K/8K',
                    'Acceso a todas las Claves 10X de estilo',
                    'Calidad Nivel Dios - Fotografía por National Geographic',
                    'Renderizado cinematográfico profesional'
                ]
            }
        }
    };

    res.status(200).json(template);
};

