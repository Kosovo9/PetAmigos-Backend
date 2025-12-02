const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const { applyForBNPLLoan, getUserLoans } = require('../controllers/FinTechController');



// Aplicar para préstamo BNPL

router.post('/apply-loan', auth, applyForBNPLLoan);



// Obtener préstamos del usuario

router.get('/loans', auth, getUserLoans);



module.exports = router;



