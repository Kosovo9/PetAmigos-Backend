const PetProfile = require('../models/PetProfile');
const { calculateBiologicalAge, getBreedRiskFactor, calculateActivityScore } = require('../services/PredictiveService');
const { segmentMarketingTarget, sendToForkAds } = require('../services/MarketingSegmentationService');
const User = require('../models/User');

// ============================================
// PET PROFILE CONTROLLER
// Integración de Lógica Predictiva y Segmentación
// ============================================

/**
 * Crear o actualizar perfil de mascota con cálculo automático de biologicalAge
 */
exports.createOrUpdatePetProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { 
            name, 
            dateOfBirth, 
            breed, 
            activityData,
            ...otherData 
        } = req.body;

        // 1. Calcular breedRiskFactor
        const breedRiskFactor = getBreedRiskFactor(breed);

        // 2. Calcular activityScore
        const activityScore = calculateActivityScore(activityData);

        // 3. Preparar datos para cálculo de biologicalAge
        const petData = {
            dateOfBirth,
            breedRiskFactor,
            activityScore,
            moodScore: otherData.moodScore || 50,
            healthScore: otherData.healthScore || 100
        };

        // 4. Calcular biologicalAge (Lógica Predictiva)
        const biologicalAge = calculateBiologicalAge(petData);

        // 5. Crear o actualizar perfil
        let pet = await PetProfile.findOne({ owner: userId, name });
        
        if (pet) {
            // Actualizar
            Object.assign(pet, {
                ...otherData,
                breed,
                dateOfBirth,
                biologicalAge,
                lastCheckup: new Date()
            });
            await pet.save();
        } else {
            // Crear nuevo
            pet = await PetProfile.create({
                owner: userId,
                name,
                dateOfBirth,
                breed,
                biologicalAge,
                ...otherData
            });
        }

        // 6. Segmentación de Marketing (Pilar 2)
        const user = await User.findById(userId);
        const chronologicalAge = calculateChronologicalAge(pet.dateOfBirth);
        
        const segmentName = segmentMarketingTarget({
            petProfile: {
                biologicalAge: pet.biologicalAge,
                moodScore: pet.moodScore,
                isLifetimeMember: pet.isLifetimeMember,
                chronologicalAge
            },
            financialScore: user?.financialScore || 0
        });

        // 7. Enviar a ForkAds.com (async, no bloquea)
        sendToForkAds(userId, segmentName).catch(err => 
            console.error("Error enviando a ForkAds:", err)
        );

        res.status(200).json({
            success: true,
            pet: {
                id: pet._id,
                name: pet.name,
                biologicalAge: pet.biologicalAge,
                moodScore: pet.moodScore,
                healthScore: pet.healthScore,
                chronologicalAge
            },
            segment: segmentName,
            message: "Perfil actualizado con cálculo predictivo."
        });

    } catch (error) {
        console.error("Error en createOrUpdatePetProfile:", error);
        res.status(500).json({ error: "Error al crear/actualizar perfil." });
    }
};

/**
 * Obtener segmentos de marketing del usuario
 */
exports.getMarketingSegments = async (req, res) => {
    try {
        const userId = req.userId;
        const petId = req.params.petId;

        const pet = await PetProfile.findById(petId);
        if (!pet || pet.owner.toString() !== userId) {
            return res.status(404).json({ error: "Mascota no encontrada." });
        }

        const user = await User.findById(userId);
        const chronologicalAge = calculateChronologicalAge(pet.dateOfBirth);
        const segmentName = segmentMarketingTarget({
            petProfile: {
                biologicalAge: pet.biologicalAge,
                moodScore: pet.moodScore,
                isLifetimeMember: pet.isLifetimeMember,
                chronologicalAge
            },
            financialScore: user?.financialScore || 0
        });

        const segments = {
            primary: segmentName,
            timestamp: new Date().toISOString()
        };

        res.status(200).json({
            success: true,
            segments
        });

    } catch (error) {
        console.error("Error en getMarketingSegments:", error);
        res.status(500).json({ error: "Error al obtener segmentos." });
    }
};

/**
 * Recalcular biologicalAge (útil cuando se actualiza actividad o mood)
 */
exports.recalculateBiologicalAge = async (req, res) => {
    try {
        const userId = req.userId;
        const { petId, activityData } = req.body;

        const pet = await PetProfile.findById(petId);
        if (!pet || pet.owner.toString() !== userId) {
            return res.status(404).json({ error: "Mascota no encontrada." });
        }

        // Recalcular
        const breedRiskFactor = getBreedRiskFactor(pet.breed);
        const activityScore = calculateActivityScore(activityData || {});

        const biologicalAge = calculateBiologicalAge({
            dateOfBirth: pet.dateOfBirth,
            breedRiskFactor,
            activityScore,
            moodScore: pet.moodScore,
            healthScore: pet.healthScore
        });

        // Actualizar
        pet.biologicalAge = biologicalAge;
        pet.lastCheckup = new Date();
        await pet.save();

        res.status(200).json({
            success: true,
            biologicalAge,
            message: "Edad biológica recalculada."
        });

    } catch (error) {
        console.error("Error en recalculateBiologicalAge:", error);
        res.status(500).json({ error: "Error al recalcular edad biológica." });
    }
};

/**
 * Helper: Calcular edad cronológica
 */
function calculateChronologicalAge(dateOfBirth) {
    if (!dateOfBirth) return 0;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const diffTime = Math.abs(today - birthDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays / 365.25;
}

