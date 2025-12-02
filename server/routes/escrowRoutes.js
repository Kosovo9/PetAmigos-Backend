const express = require('express');
const router = express.Router();
const {
    getEscrowStats,
    releaseFunds
} = require('../controllers/escrowController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// 📊 Get Escrow Stats (User sees their own vault)
router.get('/stats', auth, async (req, res) => {
    // Inject userId into params for the controller to use
    req.params.userId = req.user.id;
    return getEscrowStats(req, res);
});

// 🔓 Release Funds (Admin only - or triggered by cron)
// This manually triggers the check for funds ready to be released
router.post('/release-funds', auth, adminAuth, releaseFunds);

module.exports = router;
