const mongoose = require('mongoose');

const LostPetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }, // Dog, Cat, etc.
    breed: { type: String },
    description: { type: String, required: true },
    lastSeenLocation: {
        type: { type: String, default: 'Point' },
        coordinates: [Number], // [longitude, latitude]
        address: { type: String, required: true }
    },
    lastSeenDate: { type: Date, required: true },
    contactPhone: { type: String, required: true },
    images: [String],
    status: { type: String, enum: ['lost', 'found', 'reunited'], default: 'lost' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

LostPetSchema.index({ lastSeenLocation: '2dsphere' });

module.exports = mongoose.model('LostPet', LostPetSchema);
