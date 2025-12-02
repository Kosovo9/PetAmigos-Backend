const mongoose = require('mongoose');



const ConversionLogSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    testId: { type: String, required: true, index: true, comment: "ID del test A/B (ej: 'test1_engagement', 'test2_price')" },

    variant: { type: String, enum: ['A', 'B'], required: true, index: true },

    conversionType: { 

        type: String, 

        enum: ['lifetime_membership', 'bnpl_loan', 'service_purchase'],

        required: true 

    },

    amount: { type: Number, default: 0 },

    timestamp: { type: Date, default: Date.now, index: true }

}, { timestamps: true });



// Índice compuesto para análisis de tests

ConversionLogSchema.index({ testId: 1, variant: 1, timestamp: -1 });



module.exports = mongoose.model('ConversionLog', ConversionLogSchema);



