const mongoose = require('mongoose');

const deviceSubscriptionSchema = new mongoose.Schema({
    // Usuario
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // Dispositivo(s) cubiertos
    devices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device'
    }],

    // Plan
    tier: {
        type: String,
        enum: ['basic', 'premium', 'enterprise'],
        required: true
    },

    // Pricing
    price: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: 'USD'
    },

    billingCycle: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly'
    },

    // Estado
    status: {
        type: String,
        enum: ['active', 'cancelled', 'past_due', 'trialing', 'paused'],
        default: 'trialing'
    },

    // Fechas
    startDate: {
        type: Date,
        default: Date.now
    },

    currentPeriodStart: {
        type: Date,
        default: Date.now
    },

    currentPeriodEnd: {
        type: Date,
        required: true
    },

    trialEnd: Date,

    cancelledAt: Date,

    // Stripe
    stripeSubscriptionId: {
        type: String,
        unique: true,
        sparse: true
    },

    stripeCustomerId: String,

    // Features según tier
    features: {
        gpsTracking: { type: Boolean, default: true },
        historyDays: { type: Number, default: 7 }, // Basic: 7, Premium: 30, Enterprise: 365
        geofencing: { type: Boolean, default: false },
        healthMetrics: { type: Boolean, default: false },
        liveStreaming: { type: Boolean, default: false }, // Para cámaras
        aiAlerts: { type: Boolean, default: false },
        multiDevice: { type: Boolean, default: false },
        maxDevices: { type: Number, default: 1 },
        apiAccess: { type: Boolean, default: false },
        prioritySupport: { type: Boolean, default: false }
    },

    // Uso y límites
    usage: {
        apiCalls: { type: Number, default: 0 },
        storageGB: { type: Number, default: 0 },
        alerts: { type: Number, default: 0 }
    },

    limits: {
        apiCallsPerMonth: { type: Number, default: 10000 },
        storageGB: { type: Number, default: 5 },
        alertsPerDay: { type: Number, default: 100 }
    },

    // Metadata
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }

}, {
    timestamps: true
});

// Índices
deviceSubscriptionSchema.index({ userId: 1, status: 1 });
deviceSubscriptionSchema.index({ status: 1, currentPeriodEnd: 1 });
deviceSubscriptionSchema.index({ stripeSubscriptionId: 1 });

// Método para verificar si la suscripción está activa
deviceSubscriptionSchema.methods.isActive = function () {
    return this.status === 'active' && this.currentPeriodEnd > new Date();
};

// Método para verificar si tiene acceso a una feature
deviceSubscriptionSchema.methods.hasFeature = function (featureName) {
    return this.features[featureName] === true;
};

// Método para verificar límites
deviceSubscriptionSchema.methods.checkLimit = function (limitType) {
    const usage = this.usage[limitType] || 0;
    const limit = this.limits[`${limitType}PerMonth`] || this.limits[`${limitType}PerDay`] || Infinity;
    return usage < limit;
};

// Método para incrementar uso
deviceSubscriptionSchema.methods.incrementUsage = function (usageType, amount = 1) {
    if (!this.usage[usageType]) this.usage[usageType] = 0;
    this.usage[usageType] += amount;
    return this.save();
};

// Método estático para obtener features por tier
deviceSubscriptionSchema.statics.getTierFeatures = function (tier) {
    const tiers = {
        basic: {
            gpsTracking: true,
            historyDays: 7,
            geofencing: false,
            healthMetrics: false,
            liveStreaming: false,
            aiAlerts: false,
            multiDevice: false,
            maxDevices: 1,
            apiAccess: false,
            prioritySupport: false
        },
        premium: {
            gpsTracking: true,
            historyDays: 30,
            geofencing: true,
            healthMetrics: true,
            liveStreaming: true,
            aiAlerts: true,
            multiDevice: true,
            maxDevices: 3,
            apiAccess: false,
            prioritySupport: true
        },
        enterprise: {
            gpsTracking: true,
            historyDays: 365,
            geofencing: true,
            healthMetrics: true,
            liveStreaming: true,
            aiAlerts: true,
            multiDevice: true,
            maxDevices: 10,
            apiAccess: true,
            prioritySupport: true
        }
    };

    return tiers[tier] || tiers.basic;
};

module.exports = mongoose.model('DeviceSubscription', deviceSubscriptionSchema);
