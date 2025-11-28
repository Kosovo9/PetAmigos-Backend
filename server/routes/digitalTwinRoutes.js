const express = require('express');
const router = express.Router();
const {
    getTwinStatus,
    performAction,
    syncRealWorld
} = require('../controllers/digitalTwinController');
const auth = require('../middleware/auth');

// All routes require auth
router.use(auth);

router.get('/:petId', getTwinStatus);
router.post('/:petId/action', performAction);
router.post('/:petId/sync', syncRealWorld);

module.exports = router;
