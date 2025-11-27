const mongoose = require('mongoose');



const TransactionSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    type: { 

        type: String, 

        enum: ['PAYMENT', 'AR_CLAIM', 'SERVICE_FEE', 'SUBSCRIPTION', 'REFUND'],

        required: true 

    },

    amount: { type: Number, required: true, default: 0 },

    currency: { type: String, default: 'USD' },

    status: { 

        type: String, 

        enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],

        default: 'PENDING' 

    },

    metadata: {

        dropId: String, // Para AR_CLAIM

        serviceId: String, // Para SERVICE_FEE

        stripeSessionId: String, // Para pagos con Stripe

        description: String

    },

    processedAt: Date

}, { timestamps: true });



module.exports = mongoose.model('Transaction', TransactionSchema);

