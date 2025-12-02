const mongoose = require('mongoose');

const PhotoGenerationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    engine: {
        type: String,
        enum: ['google-ai', 'higgsfield', 'huggingface', 'placeholder'],
        required: true
    },
    prompt: String,
    imageUrl: String,
    quality: String,
    generationTime: Number, // milliseconds
    cost: { type: Number, default: 0 },
    success: { type: Boolean, default: true },
    error: String,
    createdAt: { type: Date, default: Date.now }
});

PhotoGenerationSchema.index({ userId: 1, createdAt: -1 });
PhotoGenerationSchema.index({ engine: 1, success: 1 });

module.exports = mongoose.model('PhotoGeneration', PhotoGenerationSchema);
