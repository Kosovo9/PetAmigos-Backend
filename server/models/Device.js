const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    // Información del dispositivo
    deviceId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    deviceType: {
        type: String,
        enum: ['smart_collar', 'smart_feeder', 'smart_camera', 'smart_door', 'health_monitor'],
        required: true
    },

    // Propietario
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // Mascota asociada
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    },

    // Información del producto
    model: {
        type: String,
        required: true
    },

    firmwareVersion: {
        type: String,
        default: '1.0.0'
    },

    serialNumber: {
        type: String,
        unique: true,
        sparse: true
    },

    // Estado del dispositivo
    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance', 'lost', 'stolen'],
        default: 'active'
    },

    batteryLevel: {
        type: Number,
        min: 0,
        max: 100,
        default: 100
    },

    lastSeen: {
        type: Date,
        default: Date.now
    },

    isOnline: {
        type: Boolean,
        default: false
    },

    // Configuración específica por tipo de dispositivo
    settings: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },

    // Geofencing (para collars y doors)
    geofence: {
        enabled: { type: Boolean, default: false },
        center: {
            lat: Number,
            lng: Number
        },
        radius: { type: Number, default: 100 }, // metros
        alertOnExit: { type: Boolean, default: true }
    },

    // Alertas
    alerts: [{
        type: {
            type: String,
            enum: ['low_battery', 'geofence_exit', 'offline', 'health_alert', 'motion_detected']
        },
        message: String,
        timestamp: { type: Date, default: Date.now },
        acknowledged: { type: Boolean, default: false }
    }],

    // Suscripción asociada
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeviceSubscription'
    },

    // Metadata
    purchaseDate: Date,
    warrantyExpires: Date,

}, {
    timestamps: true
});

// Índices compuestos para queries optimizadas
deviceSchema.index({ userId: 1, deviceType: 1 });
deviceSchema.index({ userId: 1, status: 1 });
deviceSchema.index({ deviceType: 1, status: 1 });
deviceSchema.index({ lastSeen: -1 });

// Método para actualizar estado online
deviceSchema.methods.updateOnlineStatus = function () {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    this.isOnline = this.lastSeen > fiveMinutesAgo;
    return this.save();
};

// Método para crear alerta
deviceSchema.methods.createAlert = function (type, message) {
    this.alerts.push({
        type,
        message,
        timestamp: new Date(),
        acknowledged: false
    });
    return this.save();
};

// Método para verificar si está en geofence
deviceSchema.methods.isInGeofence = function (lat, lng) {
    if (!this.geofence.enabled) return true;

    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = this.geofence.center.lat * Math.PI / 180;
    const φ2 = lat * Math.PI / 180;
    const Δφ = (lat - this.geofence.center.lat) * Math.PI / 180;
    const Δλ = (lng - this.geofence.center.lng) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance <= this.geofence.radius;
};

module.exports = mongoose.model('Device', deviceSchema);
