
// server/routes/storyRoutes.js
import express from 'express';
import Story from '../models/Story.js';
import auth from '../middleware/auth.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/stories';
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

// Get active stories
router.get('/', auth, async (req, res) => {
    try {
        const stories = await Story.find()
            .populate('userId', 'name avatar')
            .sort({ createdAt: -1 });
        res.json(stories);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching stories' });
    }
});

// Create story
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Image required' });

        const imageUrl = `/uploads/stories/${req.file.filename}`;

        const story = await Story.create({
            userId: req.user.id,
            imageUrl
        });

        res.status(201).json(story);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating story' });
    }
});

export default router;
