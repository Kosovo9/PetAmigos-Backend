const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const { generateMonthlyReport } = require('../controllers/MSRController');



// Generar Reporte Estratégico Mensual (MSR)

router.get('/monthly-report', auth, generateMonthlyReport);



module.exports = router;



