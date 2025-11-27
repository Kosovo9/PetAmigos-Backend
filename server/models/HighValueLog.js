const mongoose = require('mongoose');



const HighValueLogSchema = new mongoose.Schema({

    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    service: { 

        type: String, 

        enum: ['WILL', 'FUNERAL', 'MEMORIAL_FUND'],

        required: true,

        index: true

    },

    value: { type: Number, required: true, comment: "Valor total de la transacción ($1,000-$3,000 USD)" },

    profit: { type: Number, required: true, comment: "Comisión de la plataforma" },

    processedAt: { type: Date, default: Date.now, index: true }

}, { timestamps: true });



// Índices compuestos para análisis de alto valor

HighValueLogSchema.index({ ownerId: 1, processedAt: -1 });

HighValueLogSchema.index({ service: 1, value: -1 });



module.exports = mongoose.model('HighValueLog', HighValueLogSchema);


