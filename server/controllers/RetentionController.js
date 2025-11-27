const PetProfile = require('../models/PetProfile');

const User = require('../models/User');



// ============================================

// RETENTION CONTROLLER - PROTOCOLO DE CRECIMIENTO CONTINUO

// Retención Predictiva Automática (Iteración 10X)

// ============================================



/**

 * Retención Predictiva Automática

 * Si biologicalAge en riesgo y sin chequeo en 60 días → ofrecer servicio gratuito

 */

exports.checkRetentionRisk = async () => {

    try {

        const sixtyDaysAgo = new Date();

        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);



        // Buscar mascotas Lifetime en riesgo sin chequeo reciente

        const atRiskPets = await PetProfile.find({

            isLifetimeMember: true,

            lastCheckup: { $lt: sixtyDaysAgo },

            $expr: {

                $gt: ['$biologicalAge', { $multiply: ['$chronologicalAge', 1.5] }]

            }

        }).populate('owner');



        const retentionOffers = [];



        for (const pet of atRiskPets) {

            // Crear oferta de retención (servicio gratuito de alto margen)

            retentionOffers.push({

                petId: pet._id,

                ownerId: pet.owner._id,

                offer: {

                    type: 'FREE_WALKER_1_HOUR',

                    message: `Tu mascota ${pet.name} necesita atención. ¡Te regalamos 1 hora de Walker C.I.A. certificado!`,

                    expiresIn: 7 // días

                }

            });

        }



        return retentionOffers;

    } catch (error) {

        console.error("Error en checkRetentionRisk:", error);

        return [];

    }

};



/**

 * Ajustar umbral de Sentry AI basado en datos de ForkAds

 * Optimización del umbral moodScore para maximizar conversión

 */

exports.optimizeSentryThreshold = async (req, res) => {

    try {

        // En producción, esto se conectaría con ForkAds.com API

        // Para obtener datos de conversión por moodScore

        const forkAdsData = req.body.forkAdsData || {}; // Datos de ForkAds

        

        // Analizar qué moodScore genera mayor conversión

        const optimalThreshold = analyzeOptimalThreshold(forkAdsData);



        // Actualizar configuración (en producción, guardar en DB)

        res.status(200).json({

            success: true,

            optimalThreshold,

            message: "Umbral de Sentry AI optimizado basado en datos de ForkAds."

        });

    } catch (error) {

        console.error("Error en optimizeSentryThreshold:", error);

        res.status(500).json({ error: "Error al optimizar umbral." });

    }

};



function analyzeOptimalThreshold(forkAdsData) {

    // Lógica simplificada: encontrar moodScore con mayor CR

    // En producción, análisis estadístico más complejo

    return 32; // Ejemplo: moodScore óptimo para venta

}


