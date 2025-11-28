const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    processReferral,
    getReferralDashboard,
    claimDailyReward,
    rewardSocialShare,
    checkCredits
} = require('../controllers/referralController');

// 🎁 Procesar código de referido
router.post('/process', auth, processReferral);

// 📊 Dashboard de referidos
router.get('/dashboard', auth, getReferralDashboard);

// 🎯 Reclamar recompensa diaria
router.post('/daily-reward', auth, claimDailyReward);

// 📱 Recompensa por compartir en redes
router.post('/social-share', auth, rewardSocialShare);

// 💰 Verificar créditos
router.get('/credits', auth, checkCredits);

module.exports = router;
