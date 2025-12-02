const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const { createInsurancePolicy, updateDynamicPremium, processAmberAlertClaim } = require('../controllers/InsuranceController');



// Crear póliza de seguro

router.post('/create', auth, createInsurancePolicy);



// Actualizar prima dinámica

router.put('/:policyId/update-premium', auth, updateDynamicPremium);



// Procesar reclamación de Alerta Amber

router.post('/:policyId/amber-claim', auth, processAmberAlertClaim);



module.exports = router;



