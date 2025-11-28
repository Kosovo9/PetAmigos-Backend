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

// 💎 Crear código de afiliado personalizado
router.post('/create-code', auth, createAffiliateCode);

// 📊 Dashboard de afiliado
router.get('/dashboard', auth, getAffiliateDashboard);

// 🎁 Aplicar código promocional
router.post('/apply-code', auth, applyPromoCode);

// 💸 Solicitar pago de comisiones
router.post('/request-payout', auth, requestPayout);

// 📱 Generar QR code
router.get('/qr/:code', generateQR);

module.exports = router;
