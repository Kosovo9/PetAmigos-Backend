const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createAffiliateCode,
    getAffiliateDashboard,
    applyPromoCode,
    requestPayout,
    generateQR
} = require('../controllers/affiliateController');
const { enable2FA, verify2FA, disable2FA } = require('../controllers/twoFactorController');

// Rutas públicas
router.post('/apply-code', auth, applyPromoCode);

// Rutas de afiliado (requieren auth)
router.post('/create-code', auth, createAffiliateCode);
router.get('/dashboard', auth, getAffiliateDashboard);
router.post('/request-payout', auth, requestPayout);
router.get('/qr/:code', generateQR);

// 🔐 Rutas de 2FA
router.post('/2fa/enable', auth, enable2FA);
router.post('/2fa/verify', auth, verify2FA);
router.post('/2fa/disable', auth, disable2FA);

module.exports = router;
