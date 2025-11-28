const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getSecurityLogs,
    getUsers,
    updateUserRole
} = require('../controllers/adminController');
const {
    getAffiliateStats,
    processPayoutRequest
} = require('../controllers/adminAffiliateController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Todas las rutas requieren Auth + AdminAuth
router.use(auth);
router.use(adminAuth);

router.get('/stats', getDashboardStats);
router.get('/security-logs', getSecurityLogs);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);

// Rutas de gestión de afiliados
router.get('/affiliates/stats', getAffiliateStats);
router.put('/affiliates/payouts/:id', processPayoutRequest);

router.get('/generation-stats', auth, adminAuth, adminController.getGenerationStats);

module.exports = router;
