import { Router } from 'express';
import { createLiveRoom } from '../services/liveStreamService';

const router = Router();

router.post('/create', async (req, res) => {
    const { streamId } = req.body;
    if (!streamId) {
        return res.status(400).json({ error: 'streamId required' });
    }
    try {
        const room = await createLiveRoom(streamId);
        res.json({ room });
    } catch (err) {
        console.error('Live stream creation error', err);
        res.status(500).json({ error: 'Failed to create live room' });
    }
});

export default router;
