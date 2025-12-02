const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const { processHighValueTransaction, getLegacyHistory } = require('../controllers/LegacyController');



router.post('/process-transaction', auth, processHighValueTransaction);

router.get('/history/:ownerId', auth, getLegacyHistory);



module.exports = router;



