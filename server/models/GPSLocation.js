const mongoose = require('mongoose');

const gpsLocationSchema = new mongoose.Schema({
    // Dispositivo
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true,
        index: true
    },

    // Coordenadas
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
    },

    // Datos adicionales
    accuracy: {
        type: Number, // metros
        default: 10
    },

    altitude: Number, // metros

    speed: Number, // km/h

    heading: Number, // grados (0-360)

    // Batería del dispositivo en ese momento
    batteryLevel: Number,

    // Timestamp
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },

    // Metadata
    source: {
        type: String,
        enum: ['gps', 'wifi', 'cellular', 'manual'],
        default: 'gps'
    },

    // Actividad detectada (si el dispositivo tiene acelerómetro)
    activity: {
        type: String,
        enum: ['stationary', 'walking', 'running', 'unknown'],
        default: 'unknown'
    },

    // Contexto
    isInsideGeofence: Boolean,

    nearbyPlaces: [String] // POIs cercanos

}, {
    timestamps: false // Usamos timestamp custom
});

// Índice geoespacial para queries de proximidad
gpsLocationSchema.index({ location: '2dsphere' });

// Índice compuesto para queries de historial
gpsLocationSchema.index({ deviceId: 1, timestamp: -1 });

// TTL index para auto-eliminar datos antiguos (según tier de suscripción)
// Se configura dinámicamente en el controlador
gpsLocationSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // 30 días por defecto

// Método estático para obtener última ubicación
gpsLocationSchema.statics.getLastLocation = async function (deviceId) {
    return this.findOne({ deviceId })
        .sort({ timestamp: -1 })
        .lean();
};

// Método estático para obtener historial
gpsLocationSchema.statics.getHistory = async function (deviceId, startDate, endDate, limit = 1000) {
    const query = { deviceId };

    if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    return this.find(query)
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
};

// Método estático para obtener ubicaciones cercanas
gpsLocationSchema.statics.getNearby = async function (lng, lat, maxDistance = 1000) {
    return this.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [lng, lat]
                },
                $maxDistance: maxDistance
            }
        }
    }).limit(50);
};

// Método estático para calcular distancia recorrida
gpsLocationSchema.statics.calculateDistance = async function (deviceId, startDate, endDate) {
    const locations = await this.getHistory(deviceId, startDate, endDate);

    if (locations.length < 2) return 0;

    let totalDistance = 0;

    for (let i = 1; i < locations.length; i++) {
        const [lng1, lat1] = locations[i - 1].location.coordinates;
        const [lng2, lat2] = locations[i].location.coordinates;

        totalDistance += calculateHaversineDistance(lat1, lng1, lat2, lng2);
    }

    return totalDistance; // en metros
};

// Helper function para calcular distancia Haversine
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

module.exports = mongoose.model('GPSLocation', gpsLocationSchema);
