const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const { triggerServiceOffer, updateOwnerAnxiety, registerMoodScore } = require('../controllers/SentryAIController');



// Endpoint principal: Registro de Mood Score (Datos 10X)

router.post('/register-mood', auth, registerMoodScore);



// Endpoints adicionales

router.post('/trigger-offer', auth, triggerServiceOffer);

router.post('/update-anxiety', auth, updateOwnerAnxiety);



module.exports = router;

