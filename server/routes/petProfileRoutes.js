const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const petProfileController = require('../controllers/petProfileController');
const PetProfile = require('../models/PetProfile');

// Obtener datos de aging (Edad Biológica)
router.get('/:petId/aging-data', auth, async (req, res) => {
  try {
    const { petId } = req.params;
    const userId = req.userId;

    const pet = await PetProfile.findById(petId);
    if (!pet || pet.owner.toString() !== userId) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    // Calcular edad cronológica
    const chronologicalAge = calculateChronologicalAge(pet.dateOfBirth);

    res.status(200).json({
      success: true,
      biologicalAge: pet.biologicalAge,
      chronologicalAge,
      healthScore: pet.healthScore,
      isLifetimeMember: pet.isLifetimeMember || false,
    });
  } catch (error) {
    console.error('Error obteniendo datos de aging:', error);
    res.status(500).json({ error: 'Error al obtener datos de aging' });
  }
});

function calculateChronologicalAge(dateOfBirth) {
  if (!dateOfBirth) return 0;
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  return (today - birthDate) / (365.25 * 24 * 60 * 60 * 1000);
}

// Usar controlador existente para crear/actualizar
router.post('/create-update', auth, petProfileController.createOrUpdatePetProfile);
router.get('/:petId/segments', auth, petProfileController.getMarketingSegments);
router.post('/recalculate-age', auth, petProfileController.recalculateBiologicalAge);

module.exports = router;
