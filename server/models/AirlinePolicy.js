const mongoose = require('mongoose');

const airlinePolicySchema = new mongoose.Schema({
    airline: {
        type: String,
        required: [true, 'Please provide the airline name'],
        unique: true,
        trim: true
    },
    country: {
        type: String,
        required: [true, 'Please provide the country of origin']
    },
    logoUrl: {
        type: String
    },
    cabinAllowed: {
        type: Boolean,
        default: false
    },
    cargoAllowed: {
        type: Boolean,
        default: false
    },
    weightLimitCabin: {
        type: String, // e.g., "8kg including carrier"
        default: 'N/A'
    },
    weightLimitCargo: {
        type: String,
        default: 'N/A'
    },
    carrierDimensions: {
        type: String, // e.g., "45 x 35 x 25 cm"
        default: 'N/A'
    },
    fees: {
        type: String, // e.g., "$50 - $100 USD"
        default: 'Varies'
    },
    restrictions: [String], // List of specific restrictions (e.g., "No snub-nosed breeds")
    website: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: String,
        rating: Number,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for search
airlinePolicySchema.index({ airline: 'text', country: 'text' });

module.exports = mongoose.model('AirlinePolicy', airlinePolicySchema);
