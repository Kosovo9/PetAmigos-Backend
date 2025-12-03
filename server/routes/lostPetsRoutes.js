const express = require('express');
const router = express.Router();
const { reportLostPet, getLostPets } = require('../controllers/lostPetsController');
// const auth = require('../middleware/auth'); // Uncomment when auth is ready for this route

router.post('/', reportLostPet);
router.get('/', getLostPets);

module.exports = router;
