const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getGenerationQueue,
    getEngineHealth
} = require('../controllers/generationDashboardController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// All routes require admin authentication
router.use(auth);
router.use(adminAuth);

// Generation Command Center Routes
router.get('/dashboard', getDashboardStats);
router.get('/queue', getGenerationQueue);
router.get('/health', getEngineHealth);

module.exports = router;
