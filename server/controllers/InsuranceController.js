const InsurancePolicy = require('../models/InsurancePolicy');

const PetProfile = require('../models/PetProfile');

const { calculateBiologicalAge } = require('../services/PredictiveService');



// ============================================

// INSURANCE CONTROLLER - PILAR J2

// Seguros Predictivos de Cobertura Total

// ============================================



/**

 * Crear póliza de seguro basada en biologicalAge en tiempo real

 * Monopolio de Pricing: Solo nuestra plataforma puede tasar con precisión

 */

exports.createInsurancePolicy = async (req, res) => {

    try {

        const { petId, coverageAmount, coverageType = 'FULL_LIFECYCLE' } = req.body;

        const ownerId = req.userId;



        // 1. Validar mascota

        const pet = await PetProfile.findById(petId);

        if (!pet || pet.owner.toString() !== ownerId) {

            return res.status(404).json({ error: "Mascota no encontrada." });

        }



        // 2. Calcular prima dinámica basada en biologicalAge (Pilar 1)

        const chronologicalAge = calculateChronologicalAge(pet.dateOfBirth);

        const biologicalAge = pet.biologicalAge || chronologicalAge;

        

        // Risk Multiplier: Si biologicalAge es mayor, mayor riesgo = mayor prima

        const ageRatio = biologicalAge / chronologicalAge;

        const riskMultiplier = ageRatio > 1.5 ? 1.8 : ageRatio > 1.2 ? 1.4 : 1.0;

        

        // Prima base (ejemplo: $50/mes por cada $1000 de cobertura)

        const basePremium = (coverageAmount / 1000) * 50;

        const dynamicPremium = basePremium * riskMultiplier;



        // 3. Crear póliza

        const policy = await InsurancePolicy.create({

            ownerId,

            petId: pet._id,

            basePremium,

            dynamicPremium,

            riskMultiplier,

            coverageAmount,

            coverageType,

            status: 'Active',

            effectiveDate: new Date(),

            expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 año

        });



        res.status(201).json({

            success: true,

            message: "Póliza de seguro creada con prima dinámica basada en biologicalAge.",

            policy: {

                id: policy._id,

                dynamicPremium: policy.dynamicPremium.toFixed(2),

                riskMultiplier: policy.riskMultiplier,

                coverageAmount: policy.coverageAmount,

                biologicalAge: pet.biologicalAge,

                chronologicalAge

            }

        });

    } catch (error) {

        console.error("Error en createInsurancePolicy:", error);

        res.status(500).json({ error: "Error al crear póliza de seguro." });

    }

};



/**

 * Actualizar prima dinámica cuando cambia biologicalAge

 */

exports.updateDynamicPremium = async (req, res) => {

    try {

        const { policyId } = req.params;

        const policy = await InsurancePolicy.findById(policyId).populate('petId');

        

        if (!policy) {

            return res.status(404).json({ error: "Póliza no encontrada." });

        }



        // Recalcular prima basada en nuevo biologicalAge

        const pet = policy.petId;

        const chronologicalAge = calculateChronologicalAge(pet.dateOfBirth);

        const ageRatio = pet.biologicalAge / chronologicalAge;

        const riskMultiplier = ageRatio > 1.5 ? 1.8 : ageRatio > 1.2 ? 1.4 : 1.0;

        const dynamicPremium = policy.basePremium * riskMultiplier;



        policy.dynamicPremium = dynamicPremium;

        policy.riskMultiplier = riskMultiplier;

        await policy.save();



        res.status(200).json({

            success: true,

            message: "Prima dinámica actualizada.",

            dynamicPremium: policy.dynamicPremium.toFixed(2),

            riskMultiplier: policy.riskMultiplier

        });

    } catch (error) {

        console.error("Error en updateDynamicPremium:", error);

        res.status(500).json({ error: "Error al actualizar prima." });

    }

};



/**

 * Procesar reclamación de Alerta Amber (Integración Pilar 4)

 */

exports.processAmberAlertClaim = async (req, res) => {

    try {

        const { policyId, vetClinic, claimAmount } = req.body;

        const policy = await InsurancePolicy.findById(policyId);

        

        if (!policy || policy.status !== 'Active') {

            return res.status(404).json({ error: "Póliza no encontrada o inactiva." });

        }



        if (!policy.amberAlertCoverage) {

            return res.status(400).json({ error: "Esta póliza no tiene cobertura de Alerta Amber." });

        }



        // Procesar reclamación automática

        policy.lastAmberAlert = new Date();

        policy.totalAmberClaims += 1;

        await policy.save();



        res.status(200).json({

            success: true,

            message: "Reclamación de Alerta Amber procesada automáticamente.",

            claim: {

                amount: claimAmount,

                vetClinic,

                processedAt: new Date()

            }

        });

    } catch (error) {

        console.error("Error en processAmberAlertClaim:", error);

        res.status(500).json({ error: "Error al procesar reclamación." });

    }

};



function calculateChronologicalAge(dateOfBirth) {

    if (!dateOfBirth) return 0;

    const birthDate = new Date(dateOfBirth);

    const today = new Date();

    return (today - birthDate) / (365.25 * 24 * 60 * 60 * 1000);

}



