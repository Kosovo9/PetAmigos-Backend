const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  pet1Id: { type: mongoose.Schema.Types.ObjectId, ref: 'PetProfile', required: true, index: true },
  pet2Id: { type: mongoose.Schema.Types.ObjectId, ref: 'PetProfile', required: true, index: true },
  matchedAt: { type: Date, default: Date.now, index: true },
  status: { 
    type: String, 
    enum: ['PENDING_PAYMENT', 'PAID', 'ACTIVE', 'EXPIRED'],
    default: 'PENDING_PAYMENT',
    index: true
  },
  paidAt: Date,
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, default: 19.99 },
  currency: { type: String, default: 'USD' }
}, { timestamps: true });

// Índice compuesto
MatchSchema.index({ pet1Id: 1, pet2Id: 1 });

module.exports = mongoose.model('Match', MatchSchema);


