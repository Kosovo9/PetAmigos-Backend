const OwnerProfile = require('../models/OwnerProfile');

const HighValueLog = require('../models/HighValueLog');



// ============================================

// LEGACY CONTROLLER - PILAR 5

// Legado Digital - Alto Valor Financiero/Legal

// ============================================



/**

 * Procesar Transacción de Alto Valor (AVT)

 * Comisión del 10-15% según tipo de servicio

 */

exports.processHighValueTransaction = async (req, res) => {

    try {

        const { ownerId, serviceType, totalTransactionValue, legacyWillURL } = req.body;



        // Determinar tasa de comisión según tipo de servicio

        const commissionRate = (serviceType === 'WILL') ? 0.15 : 0.10; // 15% para Will/10% para Funerario

        const platformCommission = totalTransactionValue * commissionRate;



        // Obtener o crear perfil del dueño

        let ownerProfile = await OwnerProfile.findOne({ userId: ownerId });

        if (!ownerProfile) {

            ownerProfile = new OwnerProfile({ userId: ownerId });

        }



        // Actualizar información de legado

        if (legacyWillURL) {

            ownerProfile.legacyWillURL = legacyWillURL;

        }

        ownerProfile.lastLegacyServiceDate = new Date();

        ownerProfile.fiduciaryAmount = totalTransactionValue;

        ownerProfile.legacyServices.push({

            serviceType,

            transactionValue: totalTransactionValue,

            commission: platformCommission

        });

        await ownerProfile.save();



        // Registrar en log de alto valor

        await HighValueLog.create({

            ownerId,

            service: serviceType,

            value: totalTransactionValue,

            profit: platformCommission,

            processedAt: new Date()

        });



        res.status(200).json({

            success: true,

            message: "Transacción de Legado Digital procesada.",

            commission: platformCommission,

            commissionRate: commissionRate * 100,

            totalValue: totalTransactionValue,

            ownerProfile: {

                legacyWillURL: ownerProfile.legacyWillURL,

                fiduciaryAmount: ownerProfile.fiduciaryAmount

            }

        });



    } catch (error) {

        console.error("Error en processHighValueTransaction:", error);

        res.status(500).json({ error: "Error al procesar transacción de legado." });

    }

};



/**

 * Obtener historial de servicios de legado

 */

exports.getLegacyHistory = async (req, res) => {

    try {

        const { ownerId } = req.params;

        const ownerProfile = await OwnerProfile.findOne({ userId: ownerId });



        if (!ownerProfile) {

            return res.status(404).json({ error: "Perfil de dueño no encontrado." });

        }



        res.status(200).json({

            success: true,

            legacyServices: ownerProfile.legacyServices,

            totalFiduciaryAmount: ownerProfile.fiduciaryAmount,

            legacyWillURL: ownerProfile.legacyWillURL

        });

    } catch (error) {

        console.error("Error en getLegacyHistory:", error);

        res.status(500).json({ error: "Error al obtener historial de legado." });

    }

};


