const mongoose = require('mongoose');



// ============================================

// INSURANCE POLICY MODEL - PILAR J2

// Seguros Predictivos de Cobertura Total

// ============================================



const InsurancePolicySchema = new mongoose.Schema({

    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'PetProfile', required: true, unique: true },

    

    // --- PRIMAS DINÁMICAS (Basadas en biologicalAge) ---

    basePremium: { type: Number, required: true, comment: "Prima base" },

    dynamicPremium: { type: Number, required: true, comment: "Prima ajustada por biologicalAge en tiempo real" },

    riskMultiplier: { type: Number, default: 1.0, comment: "Multiplicador de riesgo basado en biologicalAge" },

    

    // --- COBERTURA ---

    coverageAmount: { type: Number, required: true, comment: "Monto de cobertura total" },

    coverageType: { 

        type: String, 

        enum: ['FULL_LIFECYCLE', 'EMERGENCY_ONLY', 'PREVENTIVE'],

        default: 'FULL_LIFECYCLE' 

    },

    

    // --- ESTADO ---

    status: { 

        type: String, 

        enum: ['Active', 'Suspended', 'Expired', 'Claimed'],

        default: 'Active',

        index: true

    },

    effectiveDate: { type: Date, default: Date.now },

    expirationDate: Date,

    

    // --- INTEGRACIÓN CON ALERTA AMBER (Pilar 4) ---

    amberAlertCoverage: { type: Boolean, default: true, comment: "Cobertura automática en Alerta Amber" },

    lastAmberAlert: Date,

    totalAmberClaims: { type: Number, default: 0 }

    

}, { timestamps: true });



// Índices para consultas eficientes

InsurancePolicySchema.index({ ownerId: 1, status: 1 });

InsurancePolicySchema.index({ petId: 1 });

InsurancePolicySchema.index({ status: 1, expirationDate: 1 });



module.exports = mongoose.model('InsurancePolicy', InsurancePolicySchema);


