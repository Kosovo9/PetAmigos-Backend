const express = require('express');
const router = express.Router();
const MegaPromptLibrary = require('../models/MegaPromptLibrary');
const ImageAnalysisService = require('../services/ImageAnalysisService');
const auth = require('../middleware/auth');
const multer = require('multer');

// Configure upload for reverse engineering
const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only images are allowed'));
    }
});

/**
 * 📚 GET LIBRARY PROMPTS
 * Fetch the curated list of 10000x prompts
 */
router.get('/library', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const prompts = await MegaPromptLibrary.find(query)
            .sort({ usageCount: -1 })
            .limit(50);

        res.json({ success: true, prompts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * 👁️ REVERSE ENGINEERING (Photo -> Prompt)
 * Upload a photo, get the Hollywood & Raw prompts
 */
router.post('/reverse', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No image provided' });
        }

        // Analyze image using our upgraded service
        const result = await ImageAnalysisService.analyzeImage(req.file.buffer, req.file.originalname);

        if (!result.success) {
            return res.status(500).json({ success: false, error: result.error });
        }

        res.json({
            success: true,
            analysis: result.analysis,
            prompts: {
                hollywood: result.analysis.hollywoodPrompt,
                raw: result.analysis.rawPrompt
            }
        });

    } catch (error) {
        console.error('Reverse Prompt Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * 🎨 GENERATE IMAGE (The "Manifestation" Button)
 * Takes a prompt and mode, returns the AI generated image.
 */
router.post('/generate', auth, async (req, res) => {
    try {
        const { prompt, mode, aspectRatio } = req.body;
        const UniversalGenerator = require('../services/UniversalGeneratorService');

        if (!prompt) {
            return res.status(400).json({ success: false, error: 'Prompt is required' });
        }

        // Generate the image
        const result = await UniversalGenerator.generateImage(prompt, {
            mode,
            aspectRatio
        });

        if (!result.success) {
            return res.status(500).json({ success: false, error: result.error });
        }

        res.json({
            success: true,
            imageUrl: result.imageUrl,
            provider: result.provider,
            metadata: result.metadata
        });

    } catch (error) {
        console.error('Generation Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
