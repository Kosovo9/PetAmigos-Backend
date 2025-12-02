const mongoose = require('mongoose');

/**
 * 🏦 AFFILIATE ESCROW VAULT
 * Secure storage for affiliate commissions before payout.
 * Keeps funds logically separate from company operations.
 */

const affiliateEscrowSchema = new mongoose.Schema({
    // The Affiliate (Beneficiary)
    affiliateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Source of funds
    sourceTransactionId: {
        type: String, // Stripe/PayPal Transaction ID
        required: true
    },

    // Amount details
    amount: {
        gross: Number,      // Total commission generated
        taxWithheld: Number, // Estimated tax (if applicable)
        net: Number,        // Actual amount to be paid
        currency: {
            type: String,
            default: 'USD'
        }
    },

    // Status of funds
    status: {
        type: String,
        enum: ['held', 'cleared', 'paid', 'refunded', 'disputed'],
        default: 'held' // 'held' for initial period (e.g. 30 days for refunds)
    },

    // Release conditions
    releaseDate: {
        type: Date,
        required: true // When these funds become 'cleared'
    },

    // Payout reference (when paid)
    payoutId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payout'
    },

    notes: String

}, {
    timestamps: true
});

// Indexes for high-performance financial queries
affiliateEscrowSchema.index({ affiliateId: 1, status: 1 });
affiliateEscrowSchema.index({ releaseDate: 1, status: 1 }); // To find funds ready to clear

// Method to check if funds can be released
affiliateEscrowSchema.methods.isReadyForRelease = function () {
    return this.status === 'held' && new Date() >= this.releaseDate;
};

module.exports = mongoose.model('AffiliateEscrow', affiliateEscrowSchema);
