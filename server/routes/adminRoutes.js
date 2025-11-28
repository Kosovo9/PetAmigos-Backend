const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getSecurityLogs,
    getUsers,
    updateUserRole
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Todas las rutas requieren Auth + AdminAuth
router.use(auth);
router.use(adminAuth);

router.get('/stats', getDashboardStats);
router.get('/security-logs', getSecurityLogs);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);

module.exports = router;
