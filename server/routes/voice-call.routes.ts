import { Router } from 'express';
import { generateVoiceToken } from '../services/voiceCallService';

const router = Router();

router.get('/token', async (req, res) => {
    const { room, userId } = req.query as { room?: string; userId?: string };
    if (!room || !userId) {
        return res.status(400).json({ error: 'room and userId required' });
    }
    try {
        const token = generateVoiceToken(room, userId);
        res.json({ token });
    } catch (err) {
        console.error('Voice token generation error', err);
        res.status(500).json({ error: 'Failed to generate token' });
    }
});

export default router;
