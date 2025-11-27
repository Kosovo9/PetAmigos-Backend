const mongoose = require('mongoose');



const PITTokenSchema = new mongoose.Schema({

    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'PetProfile', required: true, unique: true },

    tokenId: { 

        type: String, 

        required: true, 

        unique: true,

        comment: "El ID único e inmutable del NFT/Token en la blockchain."

    },

    blockchainAddress: { type: String, required: true },

    mintDate: { type: Date, default: Date.now },

    isVerifiedBreeder: { type: Boolean, default: false },

    

    // Historial de propiedad (para rastrear el origen de la mascota)

    ownerHistory: [{

        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

        startDate: { type: Date },

        endDate: { type: Date, default: null }

    }]

}, { timestamps: true });



module.exports = mongoose.model('PITToken', PITTokenSchema);

