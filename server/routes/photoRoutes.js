const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    generatePhoto,
    downloadPhoto,
    purchasePhoto
} = require('../controllers/photoController');

// 🎨 Generar foto con IA (con watermark para free users)
router.post('/generate', auth, generatePhoto);

// 📥 Descargar foto (verifica pago/premium)
router.get('/download/:photoId', auth, downloadPhoto);

// 💳 Comprar foto individual ($2.99)
router.post('/purchase/:photoId', auth, purchasePhoto);

module.exports = router;
