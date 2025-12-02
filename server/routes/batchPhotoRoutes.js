const express = require('express');
const router = express.Router();
const {
    batchAnalyze,
    analyzeSingle,
    categorizeAnalyzed,
    batchGenerate,
    getAnalysisStats
} = require('../controllers/batchPhotoController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Batch upload and analyze (up to 50 images)
router.post('/batch-analyze', batchAnalyze);

// Single image analysis
router.post('/analyze', analyzeSingle);

// Categorize already analyzed results
router.post('/categorize', categorizeAnalyzed);

// Batch generate from analyzed prompts
router.post('/batch-generate', batchGenerate);

// Get analysis statistics
router.get('/analysis-stats', getAnalysisStats);

module.exports = router;
