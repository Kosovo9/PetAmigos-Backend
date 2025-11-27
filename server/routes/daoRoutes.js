const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const { mintGovernanceToken, vote, getProposalResults } = require('../controllers/DAOController');



// Acuñar tokens de gobernanza

router.post('/mint-tokens', auth, mintGovernanceToken);



// Votar sobre propuestas

router.post('/vote', auth, vote);



// Obtener resultados de propuesta

router.get('/proposal/:proposalId/results', auth, getProposalResults);



module.exports = router;


