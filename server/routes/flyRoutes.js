const express = require('express');
const router = express.Router();
const {
    getAllPolicies,
    getPolicyById,
    createPolicy,
    updatePolicy,
    deletePolicy
} = require('../controllers/flyController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Public routes
router.get('/', getAllPolicies);
router.get('/:id', getPolicyById);

// Admin routes
router.post('/', auth, adminAuth, createPolicy);
router.put('/:id', auth, adminAuth, updatePolicy);
router.delete('/:id', auth, adminAuth, deletePolicy);

module.exports = router;
