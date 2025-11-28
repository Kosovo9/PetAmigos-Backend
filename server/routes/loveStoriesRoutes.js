const express = require('express');
const router = express.Router();
const {
    getAllStories,
    getStoryBySlug,
    createStory,
    uploadPhoto,
    toggleLike,
    shareStory,
    approveStory,
    getMyStories,
    featureStory
} = require('../controllers/loveStoriesController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Rutas públicas
router.get('/', getAllStories);
router.get('/:slug', getStoryBySlug);
router.post('/:id/share', shareStory);

// Rutas privadas (requieren autenticación)
router.post('/', auth, createStory);
router.post('/:id/photos', auth, uploadPhoto);
router.post('/:id/like', auth, toggleLike);
router.get('/my/stories', auth, getMyStories);

// Rutas de admin
router.put('/:id/approve', auth, adminAuth, approveStory);
router.put('/:id/feature', auth, adminAuth, featureStory);

module.exports = router;
