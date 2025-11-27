const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const { licenseData, getLicenseStats } = require('../controllers/DataExchangeController');



// Licenciar datos científicos (requiere auth especial en producción)

router.post('/license', auth, licenseData);



// Obtener estadísticas de licenciamiento

router.get('/stats', auth, getLicenseStats);



module.exports = router;


