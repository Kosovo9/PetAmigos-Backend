const Conversation = require('../models/Conversation');

const auth = require('../middleware/auth');



// ============================================

// CONTROLADOR DE CHAT EN TIEMPO REAL

// Maneja mensajes, ubicaciones y pagos

// ============================================



/**

 * Enviar mensaje en una conversación

 */

exports.sendMessage = async (req, res) => {

    try {

        const { conversationId, text, type = 'text', metadata = {} } = req.body;

        const senderId = req.userId; // Del middleware auth



        // Buscar o crear conversación

        let conversation = await Conversation.findById(conversationId);

        

        if (!conversation) {

            return res.status(404).json({ error: "Conversación no encontrada." });

        }



        // Verificar que el usuario es participante

        if (!conversation.participants.includes(senderId)) {

            return res.status(403).json({ error: "No autorizado para esta conversación." });

        }



        // Crear nuevo mensaje

        const newMessage = {

            senderId,

            text,

            type,

            metadata,

            deliveredAt: new Date()

        };



        // Agregar mensaje a la conversación

        conversation.messages.push(newMessage);

        conversation.lastMessage = conversation.messages[conversation.messages.length - 1]._id;

        conversation.lastActivity = new Date();

        await conversation.save();



        res.status(200).json({

            success: true,

            message: newMessage,

            conversationId: conversation._id

        });



    } catch (error) {

        console.error("Error en sendMessage:", error);

        res.status(500).json({ error: "Error al enviar mensaje." });

    }

};



/**

 * Obtener mensajes de una conversación

 */

exports.getMessages = async (req, res) => {

    try {

        const { conversationId } = req.params;

        const userId = req.userId;



        const conversation = await Conversation.findById(conversationId)

            .populate('messages.senderId', 'name email')

            .populate('participants', 'name email');



        if (!conversation) {

            return res.status(404).json({ error: "Conversación no encontrada." });

        }



        // Verificar autorización

        if (!conversation.participants.includes(userId)) {

            return res.status(403).json({ error: "No autorizado." });

        }



        res.status(200).json({

            conversation: {

                id: conversation._id,

                participants: conversation.participants,

                messages: conversation.messages,

                lastActivity: conversation.lastActivity

            }

        });



    } catch (error) {

        console.error("Error en getMessages:", error);

        res.status(500).json({ error: "Error al obtener mensajes." });

    }

};



/**

 * Crear nueva conversación

 */

exports.createConversation = async (req, res) => {

    try {

        const { participantIds } = req.body;

        const userId = req.userId;



        // Asegurar que el usuario actual esté en los participantes

        const participants = [...new Set([userId, ...participantIds])];



        const conversation = new Conversation({

            participants,

            messages: [],

            isActive: true

        });



        await conversation.save();



        res.status(201).json({

            success: true,

            conversation: {

                id: conversation._id,

                participants: conversation.participants,

                messages: []

            }

        });



    } catch (error) {

        console.error("Error en createConversation:", error);

        res.status(500).json({ error: "Error al crear conversación." });

    }

};



