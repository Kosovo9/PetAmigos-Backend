const mongoose = require('mongoose');

const loveStorySchema = new mongoose.Schema({
    // Usuario que publica la historia
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Información de la mascota adoptada
    petName: {
        type: String,
        required: true,
        trim: true
    },

    petSpecies: {
        type: String,
        enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
        required: true
    },

    petBreed: {
        type: String,
        trim: true
    },

    // Historia
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    story: {
        type: String,
        required: true,
        maxlength: 2000
    },

    // Fotos
    photos: [{
        url: String,
        caption: String,
        isVerified: { type: Boolean, default: false }
    }],

    // Fecha de adopción
    adoptionDate: {
        type: Date,
        required: true
    },

    // Ubicación (opcional)
    location: {
        city: String,
        country: String
    },

    // Engagement
    likes: {
        type: Number,
        default: 0
    },

    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    shares: {
        type: Number,
        default: 0
    },

    views: {
        type: Number,
        default: 0
    },

    // Verificación
    isVerified: {
        type: Boolean,
        default: false
    },

    verifiedAt: Date,

    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // Estado
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'flagged'],
        default: 'pending'
    },

    // SEO
    slug: {
        type: String,
        unique: true,
        sparse: true
    },

    // Metadata
    featured: {
        type: Boolean,
        default: false
    },

    featuredUntil: Date,

}, {
    timestamps: true
});

// Índices para búsqueda y performance
loveStorySchema.index({ status: 1, createdAt: -1 });
loveStorySchema.index({ userId: 1 });
loveStorySchema.index({ slug: 1 });
loveStorySchema.index({ likes: -1 });
loveStorySchema.index({ 'location.country': 1 });

// Generar slug automáticamente
loveStorySchema.pre('save', function (next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') + '-' + Date.now();
    }
    next();
});

// Método para incrementar vistas
loveStorySchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

// Método para dar like
loveStorySchema.methods.toggleLike = function (userId) {
    const index = this.likedBy.indexOf(userId);

    if (index > -1) {
        // Ya le dio like, remover
        this.likedBy.splice(index, 1);
        this.likes = Math.max(0, this.likes - 1);
    } else {
        // Nuevo like
        this.likedBy.push(userId);
        this.likes += 1;
    }

    return this.save();
};

// Método para incrementar shares
loveStorySchema.methods.incrementShares = function () {
    this.shares += 1;
    return this.save();
};

module.exports = mongoose.model('LoveStory', loveStorySchema);
