const mongoose = require('mongoose');

/**
 * 🌟 PHOTO UNIVERSE - Multi-Subject Generation System
 * Permite combinar: Mascota(s) + Humano(s) + Escenario
 */

const photoUniverseSchema = new mongoose.Schema({
    // Usuario que crea el universo
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Nombre del universo
    universeName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    // === SUJETOS EN EL UNIVERSO ===

    // Mascotas principales
    mainPets: [{
        petId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PetProfile'
        },
        petName: String,
        species: String,
        breed: String,
        position: {
            type: String,
            enum: ['center', 'left', 'right', 'front', 'back'],
            default: 'center'
        },
        size: {
            type: String,
            enum: ['large', 'medium', 'small'],
            default: 'medium'
        },
        priority: {
            type: Number,
            default: 1 // 1 = protagonista principal
        }
    }],

    // Mascotas secundarias (amigos, compañeros)
    companionPets: [{
        petId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PetProfile'
        },
        petName: String,
        species: String,
        breed: String,
        position: String,
        relationshipToMain: {
            type: String,
            enum: ['sibling', 'friend', 'playmate', 'family'],
            default: 'friend'
        }
    }],

    // Humanos en la escena
    humans: [{
        // Puede ser el owner o personas adicionales
        name: String,
        relationship: {
            type: String,
            enum: ['owner', 'family', 'friend', 'vet', 'trainer', 'other'],
            default: 'owner'
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'non-binary', 'unspecified']
        },
        ageGroup: {
            type: String,
            enum: ['child', 'teen', 'adult', 'senior']
        },
        appearance: {
            hairColor: String,
            skinTone: String,
            build: String, // slim, athletic, average, plus-size
            height: String // short, average, tall
        },
        clothing: {
            style: String, // casual, formal, sporty, etc.
            colors: [String]
        },
        position: {
            type: String,
            enum: ['standing', 'sitting', 'kneeling', 'lying', 'walking'],
            default: 'standing'
        },
        interaction: {
            type: String,
            enum: ['hugging', 'petting', 'playing', 'walking', 'holding', 'none'],
            default: 'petting'
        }
    }],

    // === ESCENARIO Y AMBIENTE ===

    scenario: {
        type: {
            type: String,
            enum: [
                'christmas', 'halloween', 'birthday', 'wedding',
                'beach', 'forest', 'park', 'home', 'studio',
                'snow', 'autumn', 'spring', 'summer',
                'city', 'countryside', 'mountain', 'desert',
                'fantasy', 'space', 'underwater', 'clouds'
            ],
            required: true
        },
        subType: String, // e.g., 'christmas-forest', 'beach-sunset'
        timeOfDay: {
            type: String,
            enum: ['dawn', 'morning', 'noon', 'afternoon', 'golden-hour', 'sunset', 'dusk', 'night'],
            default: 'golden-hour'
        },
        weather: {
            type: String,
            enum: ['sunny', 'cloudy', 'rainy', 'snowy', 'foggy', 'stormy', 'clear'],
            default: 'sunny'
        },
        season: {
            type: String,
            enum: ['spring', 'summer', 'autumn', 'winter']
        }
    },

    // === COMPOSICIÓN Y ESTILO ===

    composition: {
        cameraAngle: {
            type: String,
            enum: ['eye-level', 'low-angle', 'high-angle', 'birds-eye', 'dutch-angle'],
            default: 'eye-level'
        },
        shotType: {
            type: String,
            enum: ['close-up', 'medium-shot', 'full-body', 'wide-shot', 'extreme-wide'],
            default: 'medium-shot'
        },
        focus: {
            type: String,
            enum: ['all-sharp', 'bokeh-background', 'selective-focus'],
            default: 'all-sharp'
        },
        lighting: {
            type: String,
            enum: ['natural', 'studio', 'dramatic', 'soft', 'golden-hour', 'rim-light'],
            default: 'natural'
        }
    },

    style: {
        artistic: {
            type: String,
            enum: ['photorealistic', 'cinematic', 'artistic', 'fantasy', 'cartoon', 'oil-painting'],
            default: 'photorealistic'
        },
        mood: {
            type: String,
            enum: ['joyful', 'peaceful', 'energetic', 'dramatic', 'whimsical', 'serene'],
            default: 'joyful'
        },
        colorPalette: {
            type: String,
            enum: ['vibrant', 'pastel', 'warm', 'cool', 'monochrome', 'natural'],
            default: 'natural'
        }
    },

    // === PROMPT GENERADO ===

    generatedPrompt: {
        hyperRealistic: String, // El prompt 100x optimizado
        simplified: String, // Versión corta
        technical: String, // Especificaciones técnicas
        keywords: [String]
    },

    // === GENERACIÓN ===

    generatedImages: [{
        imageUrl: String,
        thumbnailUrl: String,
        engine: {
            type: String,
            enum: ['google-ai', 'higgsfield', 'huggingface', 'replicate']
        },
        quality: {
            type: String,
            enum: ['4K', '8K', 'HD', 'Standard']
        },
        hasWatermark: {
            type: Boolean,
            default: true
        },
        generatedAt: {
            type: Date,
            default: Date.now
        },
        downloadCount: {
            type: Number,
            default: 0
        }
    }],

    // === CONFIGURACIÓN ===

    settings: {
        isPublic: {
            type: Boolean,
            default: false
        },
        allowRemix: {
            type: Boolean,
            default: true
        },
        quality: {
            type: String,
            enum: ['4K', '8K', 'HD'],
            default: '8K'
        }
    },

    // === ESTADÍSTICAS ===

    stats: {
        views: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        },
        shares: {
            type: Number,
            default: 0
        },
        remixes: {
            type: Number,
            default: 0
        }
    },

    // === METADATA ===

    tags: [String],

    status: {
        type: String,
        enum: ['draft', 'generating', 'completed', 'failed'],
        default: 'draft'
    }

}, {
    timestamps: true
});

// Índices para búsqueda
photoUniverseSchema.index({ userId: 1, createdAt: -1 });
photoUniverseSchema.index({ 'scenario.type': 1 });
photoUniverseSchema.index({ status: 1 });
photoUniverseSchema.index({ 'settings.isPublic': 1, 'stats.likes': -1 });

// Método para generar el prompt completo
photoUniverseSchema.methods.generatePrompt = function () {
    const parts = [];

    // 1. Sujetos principales (mascotas)
    if (this.mainPets.length > 0) {
        this.mainPets.forEach((pet, idx) => {
            const priority = idx === 0 ? 'in the center foreground' : 'nearby';
            parts.push(`A beautiful ${pet.breed} ${pet.species} named ${pet.petName} positioned ${priority}`);
        });
    }

    // 2. Mascotas compañeras
    if (this.companionPets.length > 0) {
        this.companionPets.forEach(pet => {
            parts.push(`alongside a friendly ${pet.breed} ${pet.species}`);
        });
    }

    // 3. Humanos
    if (this.humans.length > 0) {
        this.humans.forEach(human => {
            const desc = `a ${human.ageGroup} ${human.gender || 'person'} ${human.interaction} the pet`;
            parts.push(desc);
        });
    }

    // 4. Escenario
    const scenarioDesc = `in a beautiful ${this.scenario.type} setting during ${this.scenario.timeOfDay}, ${this.scenario.weather} weather`;
    parts.push(scenarioDesc);

    // 5. Estilo técnico
    const technical = `Professional DSLR photography, ${this.composition.shotType}, ${this.composition.lighting} lighting, ${this.style.artistic} style, ${this.style.mood} mood, ${this.style.colorPalette} color palette`;

    // Combinar todo
    const basePrompt = parts.join(', ');

    this.generatedPrompt = {
        hyperRealistic: `${basePrompt}. ${technical}. Ultra-high resolution 8K quality, photorealistic rendering with ray tracing, National Geographic quality, award-winning photography, every detail visible, perfect focus and depth of field, natural expressions and poses, authentic lighting and shadows, magazine cover quality. Zero AI artifacts, 100% photorealistic result.`,
        simplified: basePrompt,
        technical,
        keywords: this.tags
    };

    return this.generatedPrompt.hyperRealistic;
};

// Método para incrementar vistas
photoUniverseSchema.methods.incrementViews = function () {
    this.stats.views += 1;
    return this.save();
};

module.exports = mongoose.model('PhotoUniverse', photoUniverseSchema);
