const mongoose = require('mongoose');



const MessageSchema = new mongoose.Schema({

    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    text: { type: String, required: true },

    type: { type: String, enum: ['text', 'location', 'payment', 'image', 'video'], default: 'text' },

    metadata: {

        coords: { lat: Number, lng: Number }, // Para tipo 'location'

        amount: Number, // Para tipo 'payment'

        mediaUrl: String // Para tipo 'image' o 'video'

    },

    readAt: { type: Date, default: null },

    deliveredAt: { type: Date, default: Date.now }

}, { timestamps: true });



const ConversationSchema = new mongoose.Schema({

    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],

    messages: [MessageSchema],

    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },

    lastActivity: { type: Date, default: Date.now },

    isActive: { type: Boolean, default: true }

}, { timestamps: true });



module.exports = mongoose.model('Conversation', ConversationSchema);

