const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const { testPaymentProcessors, testPredictiveLoop, testSocketScalability, testGeoSpatial } = require('../controllers/QAController');



// Tests de QA (requieren auth de admin en producción)

router.get('/payment-processors', auth, testPaymentProcessors);

router.get('/predictive-loop', auth, testPredictiveLoop);

router.get('/socket-scalability', auth, testSocketScalability);

router.get('/geospatial', auth, testGeoSpatial);



module.exports = router;


