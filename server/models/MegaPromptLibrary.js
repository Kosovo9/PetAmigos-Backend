const mongoose = require('mongoose');

/**
 * 🏛️ MEGA PROMPT LIBRARY - THE VAULT
 * Almacén de prompts de ingeniería 10000x listos para usar.
 */

const megaPromptLibrarySchema = new mongoose.Schema({
    // Identificador único amigable (ej: "paris-cafe-dawn")
    slug: {
        type: String,
        unique: true,
        required: true,
        index: true
    },

    // Título visible para el usuario
    title: {
        type: String,
        required: true
    },

    // Descripción corta (Marketing)
    description: String,

    // 🎨 El Prompt Maestro (La salsa secreta)
    promptData: {
        hollywood: String, // Modo Venta (Glamour)
        raw: String,       // Modo Arte (Detalle extremo)
        technical: String  // Specs de cámara/luces
    },

    // 🏷️ Categorización Inteligente
    category: {
        type: String,
        enum: ['lifestyle', 'studio', 'fantasy', 'nature', 'urban', 'seasonal', 'linkedin', 'social'],
        required: true,
        index: true
    },

    tags: [String], // ej: "cafe", "paris", "morning", "cozy"

    // ⚙️ Compatibilidad
    bestFor: {
        subjects: { type: Number, default: 1 }, // Ideal para 1 persona/mascota
        species: [String] // ['dog', 'cat', 'human']
    },

    // 🖼️ Imagen de Ejemplo (Thumbnail)
    previewImage: String,

    // Estadísticas de éxito
    usageCount: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 } // % de gente que compra tras ver este estilo

}, {
    timestamps: true
});

// Índices para búsqueda ultra-rápida
megaPromptLibrarySchema.index({ category: 1, usageCount: -1 });
megaPromptLibrarySchema.index({ tags: 1 });

module.exports = mongoose.model('MegaPromptLibrary', megaPromptLibrarySchema);
