const mongoose = require('mongoose');



const GovernanceTokenSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    petId: { type: mongoose.Schema.Types.ObjectId, ref: 'PetProfile', required: true },

    pitTokenId: { type: mongoose.Schema.Types.ObjectId, ref: 'PITToken', required: true, comment: "Vinculado al PIT Token (Pilar 7)" },

    balance: { type: Number, default: 0, comment: "Balance de tokens de gobernanza" },

    lastMint: { type: Date, comment: "Última acuñación de tokens" }

}, { timestamps: true });



// Índice único por usuario y mascota

GovernanceTokenSchema.index({ userId: 1, petId: 1 }, { unique: true });



module.exports = mongoose.model('GovernanceToken', GovernanceTokenSchema);


