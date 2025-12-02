const mongoose = require('mongoose');



const DataLicenseLogSchema = new mongoose.Schema({

    licenseeId: { type: String, required: true, index: true, comment: "ID de la farmacéutica/centro de investigación" },

    dataType: { 

        type: String, 

        enum: ['biologicalAge', 'healthScore', 'moodScore', 'breedRiskFactor'],

        required: true,

        index: true

    },

    purpose: { type: String, required: true, comment: "Propósito del licenciamiento" },

    licenseDuration: { type: Number, default: 365, comment: "Duración en días" },

    dataPoints: { type: Number, required: true, comment: "Número de puntos de datos licenciados" },

    licenseFee: { type: Number, default: 0, comment: "Tarifa de licenciamiento" },

    ipAddress: { type: String, comment: "IP del solicitante (auditoría)" },

    timestamp: { type: Date, default: Date.now, index: true }

}, { timestamps: true });



// Índices para análisis de IP

DataLicenseLogSchema.index({ licenseeId: 1, timestamp: -1 });

DataLicenseLogSchema.index({ dataType: 1, timestamp: -1 });



module.exports = mongoose.model('DataLicenseLog', DataLicenseLogSchema);



