const mongoose = require('mongoose');

const AffiliateTransactionSchema = new mongoose.Schema({
    affiliateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['commission', 'payout', 'bonus', 'adjustment'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    source: {
        type: String, // 'sale', 'referral_bonus', 'tier_bonus'
        default: 'sale'
    },
    referenceId: {
        type: String // Order ID or Payout ID
    },
    description: String,
    metadata: {
        tier: String,
        commissionRate: Number,
        customerEmail: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    processedAt: Date
});

// Indexes for fast dashboard queries
AffiliateTransactionSchema.index({ affiliateId: 1, createdAt: -1 });
AffiliateTransactionSchema.index({ affiliateId: 1, type: 1, status: 1 });

module.exports = mongoose.model('AffiliateTransaction', AffiliateTransactionSchema);
