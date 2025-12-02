const express = require('express');
const router = express.Router();
const {
    createUniverse,
    generateUniverseImages,
    getMyUniverses,
    getUniverseById
} = require('../controllers/photoUniverseController');
const auth = require('../middleware/auth');

// All routes protected
router.use(auth);

// 🌌 Create a new universe (setup scene)
router.post('/create', createUniverse);

// 🚀 Generate images for a specific universe
router.post('/:universeId/generate', generateUniverseImages);

// 📂 Get my universes
router.get('/my-universes', getMyUniverses);

// 🔍 Get details of a specific universe
router.get('/:id', getUniverseById);

module.exports = router;
