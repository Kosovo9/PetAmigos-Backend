const mongoose = require('mongoose');



const WalkerSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    clerkId: { type: String, unique: true, sparse: true, comment: "ID de Clerk para verificación C.I.A." },

    isVerified: { type: Boolean, default: false, index: true, comment: "Bandera de Grado C.I.A. requerida" },

    certificationLevel: { 

        type: String, 

        enum: ['BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],

        default: 'BASIC' 

    },

    rating: { type: Number, default: 5.0, min: 0, max: 5 },

    totalWalks: { type: Number, default: 0 },

    currentLocation: {

        type: { type: String, default: 'Point' },

        coordinates: [Number] // [longitude, latitude]

    },

    // Campos Geográficos para PetMatch (Protocolo de Pruebas 10X)

    countryCode: { 

        type: String, 

        enum: ['US', 'CA', 'MX'], 

        required: true, 

        index: true,

        comment: "Código de país obligatorio para filtro multi-país"

    },

    regionCode: { 

        type: String, 

        required: true,

        index: true,

        comment: "Estado/Provincia - Requerido para integridad de datos (TEST-G05)"

    },

    city: { type: String, index: true },

    language: { 

        type: String, 

        enum: ['EN', 'ES', 'FR'], 

        default: 'EN',

        index: true,

        comment: "Idioma para filtro regional (TEST-G04)"

    },

    isAvailable: { type: Boolean, default: true, index: true }

}, { timestamps: true });



// Índices geoespaciales y compuestos para performance 10X

WalkerSchema.index({ currentLocation: '2dsphere' }); // TEST-G01: Velocidad < 100ms

WalkerSchema.index({ isVerified: 1, isAvailable: 1 });

WalkerSchema.index({ countryCode: 1, currentLocation: '2dsphere' }); // TEST-G03: Filtro por país + geolocalización

WalkerSchema.index({ countryCode: 1, regionCode: 1, language: 1 }); // TEST-G04: Filtro regional

// Validación: regionCode es obligatorio (TEST-G05)

WalkerSchema.pre('save', function(next) {

    if (!this.regionCode) {

        this.isVerified = false; // Catalogar como NO VERIFICADO

        console.warn(`Walker ${this.userId} sin regionCode - Marcado como NO VERIFICADO`);

    }

    next();

});



module.exports = mongoose.model('Walker', WalkerSchema);

