const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const { checkRetentionRisk, optimizeSentryThreshold } = require('../controllers/RetentionController');



// Verificar riesgo de retención (ejecutar periódicamente)

router.get('/check-risk', auth, async (req, res) => {

    const offers = await checkRetentionRisk();

    res.status(200).json({ success: true, offers });

});



// Optimizar umbral de Sentry AI

router.post('/optimize-sentry', auth, optimizeSentryThreshold);



module.exports = router;


