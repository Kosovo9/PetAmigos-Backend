const mongoose = require('mongoose');

const digitalTwinSchema = new mongoose.Schema({
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PetProfile',
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Core Stats (0-100)
    energy: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
    },
    happiness: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
    },
    hunger: {
        type: Number,
        default: 0, // 0 = full, 100 = starving
        min: 0,
        max: 100
    },
    hygiene: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
    },

    // Progression
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },

    // Appearance
    skinId: {
        type: String,
        default: 'default'
    },
    accessories: [{
        type: String // IDs of equipped items
    }],

    // Real World Sync
    lastSync: {
        type: Date,
        default: Date.now
    },
    stepsToday: {
        type: Number,
        default: 0
    },

    // State
    status: {
        type: String,
        enum: ['sleeping', 'awake', 'playing', 'eating'],
        default: 'awake'
    }
}, {
    timestamps: true
});

// Calculate level based on XP
digitalTwinSchema.methods.calculateLevel = function () {
    // Simple formula: Level = sqrt(XP / 100)
    const newLevel = Math.floor(Math.sqrt(this.xp / 100)) + 1;
    if (newLevel > this.level) {
        this.level = newLevel;
        // Trigger level up event/notification logic here if needed
    }
};

module.exports = mongoose.model('DigitalTwin', digitalTwinSchema);
