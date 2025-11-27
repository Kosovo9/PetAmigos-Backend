const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PetProfile = require('../models/PetProfile');
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');

// Obtener matches para breeding
router.get('/matches', auth, async (req, res) => {
  try {
    const { breed, gender, availableForBreeding, excludePetId } = req.query;
    
    const query = {
      availableForBreeding: true,
      _id: { $ne: excludePetId }
    };
    
    if (breed) query.breed = breed;
    if (gender) query.gender = gender === 'male' ? 'female' : 'male';
    
    const pets = await PetProfile.find(query)
      .select('name breed age gender location photo bio availableForBreeding')
      .limit(50)
      .lean();
    
    res.status(200).json({ success: true, pets });
  } catch (error) {
    console.error('Error obteniendo matches:', error);
    res.status(500).json({ error: 'Error al obtener matches' });
  }
});

// Registrar swipe (like/reject)
router.post('/swipe', auth, async (req, res) => {
  try {
    const { swiperPetId, swipedPetId, action } = req.body;
    
    // Registrar swipe
    const swipe = await Swipe.create({
      swiperPetId,
      swipedPetId,
      action, // 'like' o 'reject'
      timestamp: new Date()
    });
    
    // Si es un like, verificar match mutuo
    if (action === 'like') {
      const mutualLike = await Swipe.findOne({
        swiperPetId: swipedPetId,
        swipedPetId: swiperPetId,
        action: 'like'
      });
      
      if (mutualLike) {
        // ¡MATCH!
        const match = await Match.create({
          pet1Id: swiperPetId,
          pet2Id: swipedPetId,
          matchedAt: new Date(),
          status: 'PENDING_PAYMENT'
        });
        
        return res.status(200).json({
          success: true,
          isMatch: true,
          match: {
            id: match._id,
            pet: await PetProfile.findById(swipedPetId).lean()
          }
        });
      }
    }
    
    res.status(200).json({ success: true, isMatch: false });
  } catch (error) {
    console.error('Error registrando swipe:', error);
    res.status(500).json({ error: 'Error al registrar swipe' });
  }
});

// Procesar pago de match
router.post('/match/pay', auth, async (req, res) => {
  try {
    const { matchId, amount, currency } = req.body;
    
    // Procesar pago (simulado - integrar con Stripe/Mercado Pago)
    // En producción, usar paymentController
    
    const match = await Match.findByIdAndUpdate(matchId, {
      status: 'PAID',
      paidAt: new Date()
    });
    
    if (!match) {
      return res.status(404).json({ error: 'Match no encontrado' });
    }
    
    res.status(200).json({ success: true, match });
  } catch (error) {
    console.error('Error procesando pago:', error);
    res.status(500).json({ error: 'Error al procesar pago' });
  }
});

module.exports = router;


