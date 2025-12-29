/**
 * Hugging Face Utilities - Open Source AI Integration
 * Zero cost AI for text generation and image synthesis
 */

// Available free/low-cost models
export const HF_MODELS = {
    // Text Generation (Free)
    TEXT_GENERATION: [
        'gpt2',
        'distilgpt2',
        'facebook/opt-125m',
        'EleutherAI/gpt-neo-125M',
        'microsoft/DialoGPT-medium'
    ],

    // Image Generation (Free with API key)
    IMAGE_GENERATION: [
        'stabilityai/stable-diffusion-2-1',
        'runwayml/stable-diffusion-v1-5',
        'CompVis/stable-diffusion-v1-4',
        'prompthero/openjourney'
    ],

    // Analysis Models
    SENTIMENT: 'distilbert-base-uncased-finetuned-sst-2-english',
    TRANSLATION: 'Helsinki-NLP/opus-mt-en-es',
    SUMMARIZATION: 'facebook/bart-large-cnn'
} as const;

// Pet-specific prompts optimized for Hugging Face models
export const PET_PROMPTS = {
    DOG: [
        "A cute {breed} dog playing in the park, photorealistic, 4K, detailed fur, natural lighting",
        "{breed} puppy with big expressive eyes, studio photography, professional lighting, soft focus",
        "Happy {breed} dog running on grass, natural sunlight, vibrant colors, action shot",
        "Portrait of a majestic {breed} dog, detailed eyes, professional pet photography"
    ],

    CAT: [
        "Beautiful {breed} cat sitting elegantly, detailed eyes, soft fur, studio lighting, premium quality",
        "Playful {breed} kitten chasing toy, adorable expression, high detail, natural colors",
        "Majestic {breed} cat looking at camera, professional pet photography, sharp focus",
        "Cute {breed} cat sleeping peacefully, soft lighting, cozy atmosphere"
    ],

    BIRD: [
        "Colorful {breed} bird perched on branch, vibrant feathers, natural habitat, high detail",
        "Beautiful {breed} bird in flight, wings spread, dynamic pose, sharp focus"
    ],

    OTHER: [
        "Adorable {breed} pet, detailed features, professional photography, natural lighting",
        "{breed} in natural habitat, photorealistic, 4K quality"
    ]
} as const;

export type PetType = keyof typeof PET_PROMPTS;

interface GeneratePromptOptions {
    style?: 'photorealistic' | 'artistic' | 'cartoon' | 'watercolor';
    quality?: 'standard' | 'high' | 'ultra';
    lighting?: 'natural' | 'studio' | 'soft' | 'dramatic';
}

/**
 * Generate optimized prompt for Hugging Face image generation
 */
export const generateHFPrompt = (
    petType: PetType | string,
    breed: string,
    options: GeneratePromptOptions = {}
): string => {
    const {
        style = 'photorealistic',
        quality = 'high',
        lighting = 'natural'
    } = options;

    // Get base prompts for pet type
    const normalizedType = petType.toUpperCase() as PetType;
    const prompts = PET_PROMPTS[normalizedType] || PET_PROMPTS.OTHER;

    // Select random base prompt
    const basePrompt = prompts[Math.floor(Math.random() * prompts.length)];

    // Replace breed placeholder
    const promptWithBreed = basePrompt.replace('{breed}', breed || 'mixed breed');

    // Add quality modifiers
    const qualityModifiers = {
        standard: 'good quality',
        high: 'best quality, masterpiece, 8K UHD',
        ultra: 'best quality, masterpiece, ultra detailed, 8K UHD, professional grade'
    };

    const styleModifiers = {
        photorealistic: 'photorealistic, lifelike',
        artistic: 'artistic interpretation, beautiful composition',
        cartoon: 'cartoon style, cute, animated',
        watercolor: 'watercolor painting, soft colors, artistic'
    };

    const lightingModifiers = {
        natural: 'natural lighting',
        studio: 'studio lighting, professional setup',
        soft: 'soft diffused lighting',
        dramatic: 'dramatic lighting, high contrast'
    };

    // Combine all
    return `${promptWithBreed}, ${styleModifiers[style]}, ${lightingModifiers[lighting]}, ${qualityModifiers[quality]}`;
};

/**
 * Negative prompts to avoid common issues in generated images
 */
export const NEGATIVE_PROMPTS = {
    default: 'blurry, bad quality, distorted, deformed, ugly, bad anatomy, bad proportions, watermark, text, signature',
    pets: 'blurry, deformed, mutated, extra limbs, bad anatomy, ugly, poorly drawn, low quality, watermark',
    portrait: 'blurry, out of focus, bad lighting, overexposed, underexposed, bad composition'
} as const;

/**
 * Process Hugging Face image response
 */
export const processHFImageResponse = async (response: Blob | { data: string }): Promise<string> => {
    // If already base64
    if (typeof response === 'object' && 'data' in response) {
        return response.data;
    }

    // If blob, convert to base64
    if (response instanceof Blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                resolve(result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(response);
        });
    }

    throw new Error('Unsupported response format');
};

/**
 * Chat message templates for AI assistant
 */
export const CHAT_TEMPLATES = {
    greeting: "¡Hola! Soy tu asistente de PetMatch. ¿En qué puedo ayudarte hoy?",

    training: {
        dog: "Para entrenar a tu perro, te recomiendo: 1) Usar refuerzo positivo, 2) Ser consistente, 3) Sesiones cortas de 10-15 minutos",
        cat: "Los gatos aprenden mejor con: 1) Recompensas inmediatas, 2) Paciencia, 3) Respeto a su espacio personal"
    },

    care: {
        dog: "Cuidados esenciales para perros: 1) Ejercicio diario, 2) Alimentación balanceada, 3) Visitas veterinarias regulares",
        cat: "Cuidados esenciales para gatos: 1) Caja de arena limpia, 2) Rascadores, 3) Estimulación mental y juegos"
    },

    error: "Lo siento, ocurrió un error. Por favor, intenta de nuevo o reformula tu pregunta."
} as const;

/**
 * Generate chat response using available context
 */
export const generateChatResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Training queries
    if (lowerMessage.includes('entrenar') || lowerMessage.includes('training')) {
        if (lowerMessage.includes('perro') || lowerMessage.includes('dog')) {
            return CHAT_TEMPLATES.training.dog;
        }
        if (lowerMessage.includes('gato') || lowerMessage.includes('cat')) {
            return CHAT_TEMPLATES.training.cat;
        }
    }

    // Care queries
    if (lowerMessage.includes('cuidar') || lowerMessage.includes('cuidado') || lowerMessage.includes('care')) {
        if (lowerMessage.includes('perro') || lowerMessage.includes('dog')) {
            return CHAT_TEMPLATES.care.dog;
        }
        if (lowerMessage.includes('gato') || lowerMessage.includes('cat')) {
            return CHAT_TEMPLATES.care.cat;
        }
    }

    // Default response
    return "Entiendo tu pregunta. Para darte la mejor respuesta, ¿podrías especificar más detalles sobre tu mascota?";
};
