const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const { logConversion, getABTestResults } = require('../controllers/ABTestingController');



// Registrar conversión para A/B Testing

router.post('/log-conversion', logConversion);



// Obtener resultados de A/B Test

router.get('/results/:testId', auth, getABTestResults);



module.exports = router;


