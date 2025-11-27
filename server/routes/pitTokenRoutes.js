const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const { mintPITToken, getPITToken } = require('../controllers/PITTokenController');



// Acuñar PIT Token (Soft Mint)

router.post('/mint', auth, mintPITToken);



// Obtener PIT Token de una mascota

router.get('/:petId', auth, getPITToken);



module.exports = router;


