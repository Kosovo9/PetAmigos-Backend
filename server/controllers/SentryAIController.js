const PetProfile = require('../models/PetProfile');
const Transaction = require('../models/Transaction');



// ============================================

// SENTRY AI CONTROLLER - PILAR 2

// Monetización de la Ansiedad - Venta Instantánea

// Conexión de Inteligencia Predictiva (Datos 10X)

// ============================================



/**

 * Trigger de Oferta de Servicio basado en Mood Score

 * Lógica 10X: Si moodScore < 30, activa venta instantánea

 */

exports.triggerServiceOffer = async (req, res) => {

    try {

        const { petId, currentMoodScore } = req.body;



        // 1. Actualiza el moodScore en el perfil

        const pet = await PetProfile.findByIdAndUpdate(

            petId, 

            { 

                moodScore: currentMoodScore,

                lastCheckup: new Date()

            },

            { new: true }

        );



        if (!pet) {

            return res.status(404).json({ error: "Mascota no encontrada." });

        }



        // 2. Lógica 10X: Si el moodScore cae por debajo de 30 (Ansiedad Alta)

        if (currentMoodScore < 30) {

            // Ejecuta la venta instantánea de servicios

            return res.status(200).json({

                success: true,

                message: "Mood Score bajo. Oferta instantánea de servicio activada.",

                offerType: "Daycare_4_Hours",

                price: 59.99,

                urgency: "HIGH",

                callToAction: "Tu mascota necesita un paseo de emergencia. ¡Reservar ahora!",

                pet: {

                    id: pet._id,

                    name: pet.name,

                    moodScore: pet.moodScore

                }

            });

        }



        // 3. Mood Score estable - Sin oferta urgente

        res.status(200).json({

            success: true,

            message: "Mood Score estable.",

            moodScore: currentMoodScore,

            status: "NORMAL"

        });



    } catch (error) {

        console.error("Error en triggerServiceOffer:", error);

        res.status(500).json({ error: "Error al procesar oferta de servicio." });

    }

};



/**

 * Actualizar Anxiety Level del Dueño

 */

exports.updateOwnerAnxiety = async (req, res) => {

    try {

        const { petId, anxietyLevel } = req.body;

        const pet = await PetProfile.findByIdAndUpdate(

            petId,

            { anxietyLevelOwner: anxietyLevel },

            { new: true }

        );



        res.status(200).json({

            success: true,

            anxietyLevel: pet.anxietyLevelOwner

        });

    } catch (error) {

        console.error("Error en updateOwnerAnxiety:", error);

        res.status(500).json({ error: "Error al actualizar nivel de ansiedad." });

    }

};

