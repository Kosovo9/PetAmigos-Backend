const mongoose = require('mongoose');



const VoteSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    proposalId: { type: String, required: true, index: true, comment: "ID de la propuesta de gobernanza" },

    voteOption: { 

        type: String, 

        enum: ['YES', 'NO', 'ABSTAIN'],

        required: true 

    },

    tokenWeight: { type: Number, required: true, comment: "Peso del voto (basado en tokens)" },

    timestamp: { type: Date, default: Date.now, index: true }

}, { timestamps: true });



// Índice compuesto para evitar votos duplicados

VoteSchema.index({ userId: 1, proposalId: 1 }, { unique: true });



module.exports = mongoose.model('Vote', VoteSchema);



