
// server/models/Story.js
import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    },
    imageUrl: { type: String, required: true }, // URL de imagen en tu servidor o CDN gratuito
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // TTL Index: se borra en 24h (86400 seg)
});

// Ensure index is created
storySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model('Story', storySchema);
