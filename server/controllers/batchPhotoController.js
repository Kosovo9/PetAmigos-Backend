const ImageAnalysisService = require('../services/ImageAnalysisService');
const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
        files: 50 // Max 50 files at once
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
}).array('images', 50);

/**
 * @desc    Batch upload and analyze images with auto-categorization
 * @route   POST /api/photos/batch-analyze
 * @access  Private
 */
exports.batchAnalyze = async (req, res) => {
    try {
        // Handle file upload
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    error: err.message
                });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'No images uploaded'
                });
            }

            console.log(`🚀 Starting batch analysis of ${req.files.length} images...`);

            // Prepare images for analysis
            const images = req.files.map(file => ({
                filename: file.originalname,
                buffer: file.buffer,
                size: file.size,
                mimetype: file.mimetype
            }));

            // Analyze all images
            const startTime = Date.now();
            const categorizedResults = await ImageAnalysisService.analyzeBatch(images);
            const processingTime = Date.now() - startTime;

            // Generate summary
            const summary = {
                totalImages: req.files.length,
                processingTime: `${(processingTime / 1000).toFixed(2)}s`,
                avgTimePerImage: `${(processingTime / req.files.length / 1000).toFixed(2)}s`,
                successful: categorizedResults.stats.successful,
                failed: categorizedResults.stats.failed,
                categories: categorizedResults.stats.categories
            };

            res.json({
                success: true,
                message: `Successfully analyzed ${categorizedResults.stats.successful} images`,
                summary,
                results: categorizedResults
            });
        });

    } catch (error) {
        console.error('Error in batch analyze:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * @desc    Single image analysis
 * @route   POST /api/photos/analyze
 * @access  Private
 */
exports.analyzeSingle = async (req, res) => {
    try {
        const uploadSingle = multer({ storage }).single('image');

        uploadSingle(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    error: err.message
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: 'No image uploaded'
                });
            }

            console.log(`🔍 Analyzing single image: ${req.file.originalname}`);

            const result = await ImageAnalysisService.analyzeImage(
                req.file.buffer,
                req.file.originalname
            );

            if (result.success) {
                res.json({
                    success: true,
                    filename: req.file.originalname,
                    analysis: result.analysis,
                    prompt: result.analysis.hyperRealisticPrompt
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error,
                    fallback: result.fallback
                });
            }
        });

    } catch (error) {
        console.error('Error in single analyze:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * @desc    Get categories and organize analyzed images
 * @route   POST /api/photos/categorize
 * @access  Private
 */
exports.categorizeAnalyzed = async (req, res) => {
    try {
        const { results } = req.body;

        if (!results || !Array.isArray(results)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid results format'
            });
        }

        const categorized = ImageAnalysisService.categorizeResults(results);

        res.json({
            success: true,
            categorized
        });

    } catch (error) {
        console.error('Error categorizing:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * @desc    Batch generate photos from analyzed images
 * @route   POST /api/photos/batch-generate
 * @access  Private
 */
exports.batchGenerate = async (req, res) => {
    try {
        const { analyzedImages, scenario = 'christmas' } = req.body;

        if (!analyzedImages || !Array.isArray(analyzedImages)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid analyzed images format'
            });
        }

        // This will generate photos based on the hyper-realistic prompts
        // Integration with existing photo generation system
        const generations = [];

        for (const analyzedImage of analyzedImages) {
            if (!analyzedImage.analysis) continue;

            const { hyperRealisticPrompt, species, breed } = analyzedImage.analysis;

            // Create generation job
            const generationJob = {
                userId: req.userId,
                prompt: hyperRealisticPrompt,
                scenario,
                species,
                breed,
                quality: '8K',
                sourceFile: analyzedImage.filename,
                status: 'pending'
            };

            generations.push(generationJob);
        }

        res.json({
            success: true,
            message: `Queued ${generations.length} images for generation`,
            jobs: generations,
            estimatedTime: `${generations.length * 15}s` // ~15s per image
        });

    } catch (error) {
        console.error('Error in batch generate:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * @desc    Get analysis statistics
 * @route   GET /api/photos/analysis-stats
 * @access  Private
 */
exports.getAnalysisStats = async (req, res) => {
    try {
        // This would query your database for historical analysis data
        // For now, returning sample stats
        const stats = {
            totalAnalyzed: 0,
            byCategory: {},
            bySpecies: {},
            topBreeds: [],
            avgProcessingTime: '0s'
        };

        res.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    batchAnalyze: exports.batchAnalyze,
    analyzeSingle: exports.analyzeSingle,
    categorizeAnalyzed: exports.categorizeAnalyzed,
    batchGenerate: exports.batchGenerate,
    getAnalysisStats: exports.getAnalysisStats
};
