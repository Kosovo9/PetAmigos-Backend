const mongoose = require('mongoose');

// 💰 MODELO DE PAGO DE AFILIADOS
const AffiliatePayoutSchema = new mongoose.Schema({
    affiliateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // Información del pago
    amount: { type: Number, required: true, min: 50 }, // Mínimo $50 USD
    currency: { type: String, default: 'USD' },

    // Método de pago
    paymentMethod: {
        type: String,
        enum: ['paypal', 'stripe', 'bank_transfer', 'crypto'],
        required: true
    },

    // Detalles del método de pago
    paymentDetails: {
        paypalEmail: String,
        stripeAccountId: String,
        bankAccount: {
            accountNumber: String,
            routingNumber: String,
            accountHolder: String,
            bankName: String
        },
        cryptoAddress: String
    },

    // Estado del pago
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },

    // Tracking
    requestedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
    completedAt: { type: Date },

    // Comisiones incluidas en este pago
    commissions: [{
        promoCodeId: { type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode' },
        saleAmount: Number,
        commissionAmount: Number,
        saleDate: Date
    }],

    // Información adicional
    transactionId: String, // ID de PayPal/Stripe/etc
    notes: String,
    adminNotes: String,

    // Errores si falla
    errorMessage: String,
    retryCount: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Índices para búsquedas rápidas
AffiliatePayoutSchema.index({ affiliateId: 1, status: 1 });
AffiliatePayoutSchema.index({ status: 1, requestedAt: -1 });

// Métodos
AffiliatePayoutSchema.methods.markAsProcessing = async function () {
    this.status = 'processing';
    this.processedAt = new Date();
    await this.save();
};

AffiliatePayoutSchema.methods.markAsCompleted = async function (transactionId) {
    this.status = 'completed';
    this.completedAt = new Date();
    this.transactionId = transactionId;
    await this.save();
};

AffiliatePayoutSchema.methods.markAsFailed = async function (errorMessage) {
    this.status = 'failed';
    this.errorMessage = errorMessage;
    this.retryCount += 1;
    await this.save();
};

module.exports = mongoose.model('AffiliatePayout', AffiliatePayoutSchema);
