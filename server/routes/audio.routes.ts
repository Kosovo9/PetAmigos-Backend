import { Router } from 'express';
import multer from 'multer';
import { processVoiceComment } from '../services/voiceCommentService';
import fs from 'fs';
import path from 'path';

const upload = multer({ dest: 'uploads/' });
const router = Router();

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

router.post('/comment', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No audio file' });
        const { userId, postId } = req.body;

        const result = await processVoiceComment(
            Number(userId),
            req.file.path,
            postId ? Number(postId) : null
        );

        // Clean up temp file
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.json(result);
    } catch (error: any) {
        console.error("Audio processing error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
