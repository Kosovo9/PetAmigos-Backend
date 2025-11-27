const mongoose = require('mongoose');

const SwipeSchema = new mongoose.Schema({
  swiperPetId: { type: mongoose.Schema.Types.ObjectId, ref: 'PetProfile', required: true, index: true },
  swipedPetId: { type: mongoose.Schema.Types.ObjectId, ref: 'PetProfile', required: true, index: true },
  action: { type: String, enum: ['like', 'reject'], required: true },
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// Índice compuesto para búsqueda de matches mutuos
SwipeSchema.index({ swiperPetId: 1, swipedPetId: 1, action: 1 });

module.exports = mongoose.model('Swipe', SwipeSchema);


