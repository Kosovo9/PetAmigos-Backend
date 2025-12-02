const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'PetProfile', required: true, index: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Contenido
  title: { type: String, required: true },
  description: { type: String },
  milestone: { 
    type: String, 
    enum: ['FIRST_MONTH', 'BIRTHDAY', 'FIRST_ANNIVERSARY', 'HEALTH_REMINDER', 'CUSTOM'],
    required: true 
  },
  date: { type: Date, required: true, index: true },
  
  // Media
  thumbnail: { type: String },
  videoUrl: { type: String },
  videoHDUrl: { type: String, comment: "URL para usuarios Premium" },
  video4KUrl: { type: String, comment: "URL para usuarios Premium" },
  
  // Monetización
  isPremiumUnlocked: { type: Boolean, default: false },
  shareUrl: { type: String },
  
  // Estado
  status: { 
    type: String, 
    enum: ['GENERATING', 'READY', 'FAILED'],
    default: 'GENERATING'
  }
  
}, { timestamps: true });

// Índices
MemorySchema.index({ petId: 1, date: -1 });
MemorySchema.index({ ownerId: 1, status: 1 });

module.exports = mongoose.model('Memory', MemorySchema);



