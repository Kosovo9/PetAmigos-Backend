const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const { findPlaymates, findWalkers, validateCountryFilter } = require('../controllers/petMatchController');



// Buscar compañeros de juego (con validación cross-country)

router.get('/playmates', auth, validateCountryFilter, findPlaymates);



// Buscar walkers (con filtro regional)

router.get('/walkers', auth, validateCountryFilter, findWalkers);



module.exports = router;


