const mongoose = require('mongoose');



const PetProfileSchema = new mongoose.Schema({

    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    name: { type: String, required: true, trim: true },

    

    // --- PILAR 1: PET AGING CLOCK ---

    dateOfBirth: { type: Date, required: true },

    biologicalAge: { 

        type: Number, 

        required: true,

        default: 0,

        comment: "Edad biológica real calculada por el algoritmo de IA (Pet Aging Clock)."

    },

    

    // --- PILAR 2: SENTRY AI & MOOD MAPPING ---

    moodScore: { 

        type: Number, 

        default: 50, // 0 (Tristeza Profunda) a 100 (Euforia)

        min: 0,

        max: 100,

        comment: "Puntuación de estado de ánimo calculada por Sentry AI (Lenguaje corporal y actividad)."

    },

    

    // --- PILAR 3/6: REGISTRO BASE ---

    breed: { type: String, trim: true },

    isCertified: { type: Boolean, default: false, comment: "Relacionado al PIT Token (Pilar 3)" },



}, { timestamps: true });



module.exports = mongoose.model('PetProfile', PetProfileSchema);

