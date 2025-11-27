const mongoose = require('mongoose');



const PetProfileSchema = new mongoose.Schema({

    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    name: { type: String, required: true, trim: true },

    

    // --- PILAR 1: PET AGING CLOCK (Monetización de Longevidad) ---

    dateOfBirth: { type: Date, required: true },

    biologicalAge: { 

        type: Number, 

        required: true,

        default: 0,

        index: true, // Indexado para búsquedas de segmentación predictiva

        comment: "Clave de Monetización. Edad real del algoritmo de IA. Dispara la venta del Pasaporte de Longevidad ($99/año)."

    },

    lastCheckup: { type: Date, comment: "Fecha del último análisis del Reloj de Envejecimiento" },

    healthScore: { 

        type: Number, 

        default: 100, 

        min: 0, 

        max: 100,

        comment: "Puntuación de 0 a 100 basada en biologicalAge"

    },

    isLifetimeMember: { type: Boolean, default: false, index: true, comment: "Indica membresía activa" },

    

    // --- PILAR 2: SENTRY AI & MOOD MAPPING (Monetización de Ansiedad) ---

    moodScore: { 

        type: Number, 

        default: 50, // 0 (Tristeza Profunda) a 100 (Euforia)

        min: 0,

        max: 100,

        index: true, // Indexado para triggers de venta instantánea

        comment: "Activador de Venta. Puntuación de estado de ánimo (0-100) que, si es baja, activa la venta de Walkers/Daycare."

    },

    anxietyLevelOwner: { 

        type: Number, 

        default: 0, 

        min: 0, 

        max: 100,

        comment: "Nivel de preocupación del dueño (self-reported o inferido)"

    },

    

    // --- PILAR 3/6: REGISTRO BASE ---

    breed: { type: String, trim: true, index: true },

    isCertified: { type: Boolean, default: false, index: true, comment: "Relacionado al PIT Token (Pilar 3)" },

    pitTokenId: { type: mongoose.Schema.Types.ObjectId, ref: 'PITToken', default: null, comment: "Referencia al PIT Token acuñado" },

    isCiaVerified: { type: Boolean, default: false, index: true, comment: "Gate del Pilar 3 - Verificación Biométrica C.I.A." },

    biometricHash: { type: String, unique: true, sparse: true, comment: "Hash biométrico para verificación Anti-Robo" },

    

    // Campos Geográficos para PetMatch

    currentLocation: {

        type: { type: String, default: 'Point' },

        coordinates: [Number] // [longitude, latitude]

    },

    ownerCountryCode: { 

        type: String, 

        enum: ['US', 'CA', 'MX'], 

        index: true,

        comment: "Código de país del dueño para filtro multi-país"

    },

    // Campos para Breeding Matchmaker

    gender: { type: String, enum: ['male', 'female'], index: true },

    availableForBreeding: { type: Boolean, default: false, index: true },

    location: { type: String },

    bio: { type: String },

    photo: { type: String },

    // Campos para Memory Lane

    mediaAssets: [{ 

        type: String, 

        comment: "Array de URLs de fotos/videos para Memory Lane" 

    }],



}, { timestamps: true });



// Índices compuestos para performance 500%

PetProfileSchema.index({ owner: 1, biologicalAge: 1 });

PetProfileSchema.index({ moodScore: 1, isLifetimeMember: 1 });

PetProfileSchema.index({ owner: 1, moodScore: 1 });

// Índices geoespaciales para PetMatch (TEST-G01: Velocidad)

PetProfileSchema.index({ currentLocation: '2dsphere' });

PetProfileSchema.index({ ownerCountryCode: 1, currentLocation: '2dsphere' });



module.exports = mongoose.model('PetProfile', PetProfileSchema);

