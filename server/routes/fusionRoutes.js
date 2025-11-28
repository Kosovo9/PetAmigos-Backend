const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getAirlinePolicies,
    calculateCarbonFootprint,
    getInfluencerDashboard,
    getLoveStories,
    createLoveStory
} = require('../controllers/fusionController');

// ============================================
// RUTAS DE FUSIÓN (PetMatch AI v2 + Global Platform)
// ============================================

// ✈️ PetMatch Fly
router.get('/fly/policies', getAirlinePolicies);

// 🌿 ESG & Huella de Carbono
router.post('/esg/calculate', auth, calculateCarbonFootprint);

// 💎 Microinfluencers Dashboard
router.get('/influencers/dashboard', auth, getInfluencerDashboard);

// ❤️ Love Stories (Historias de Adopción)
router.get('/love-stories', getLoveStories);
router.post('/love-stories', auth, createLoveStory);

module.exports = router;
