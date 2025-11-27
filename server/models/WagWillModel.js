const mongoose = require('mongoose');



const WagWillModelSchema = new mongoose.Schema({

    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    pet: { type: mongoose.Schema.Types.ObjectId, ref: 'PetProfile', required: true },

    

    // --- DESIGNACIÓN LEGAL ---

    designatedGuardian: {

        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

        name: { type: String, required: true },

        contact: { type: String }

    },



    // --- FUNERARIAS Y MEMORIALIZACIÓN ---

    funeralPreference: {

        type: String,

        enum: ['CREMATION', 'BURIAL', 'NONE'],

        default: 'NONE'

    },

    memorialFund: {

        amount: { type: Number, default: 0, comment: "Monto en el fondo fiduciario para el cuidado futuro." },

        trustee: { type: String }

    },

    

    documentStatus: {

        type: String,

        enum: ['DRAFT', 'PENDING_LEGAL', 'ACTIVE'],

        default: 'DRAFT'

    }

}, { timestamps: true });



module.exports = mongoose.model('WagWillModel', WagWillModelSchema);

