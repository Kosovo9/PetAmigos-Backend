const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const { biometricCheckIn, getLegalClause, acceptLegalClause, verifyBiometricAccess } = require('../controllers/verificationController');



router.post('/biometric-checkin', auth, biometricCheckIn);

router.post('/biometric-access', auth, verifyBiometricAccess);

router.get('/legal-clause', getLegalClause);

router.post('/accept-legal', auth, acceptLegalClause);



module.exports = router;


