const mongoose = require('mongoose');



const OwnerProfileSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    

    // --- PILAR 5: LEGADO DIGITAL (Alto Valor Financiero/Legal) ---

    legacyWillURL: {

        type: String,

        required: false,

        unique: true, // Asegura que solo exista un testamento por dueño

        sparse: true,

        comment: "URL del Testamento Digital/Fondo Fiduciario. Asegura una transacción de alto valor única."

    },

    lastLegacyServiceDate: { 

        type: Date,

        comment: "Fecha del último servicio de legado procesado"

    },

    fiduciaryAmount: { 

        type: Number, 

        default: 0,

        comment: "Monto del fondo fiduciario del que se obtiene la comisión"

    },

    legacyServices: [{

        serviceType: { 

            type: String, 

            enum: ['WILL', 'FUNERAL', 'MEMORIAL_FUND'] 

        },

        transactionValue: Number,

        commission: Number,

        processedAt: { type: Date, default: Date.now }

    }]

}, { timestamps: true });



// Índices para performance

OwnerProfileSchema.index({ userId: 1 });

OwnerProfileSchema.index({ legacyWillURL: 1 });



module.exports = mongoose.model('OwnerProfile', OwnerProfileSchema);


