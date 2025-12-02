// Transaction model – registra cada checkout de $1
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stripeSessionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true }, // USD
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    action: { type: String, required: true }, // ej. "generation"
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', TransactionSchema);

