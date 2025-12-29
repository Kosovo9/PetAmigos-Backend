import { Router } from 'express';
import { getSuperLikeStatus, useSuperLike, getSuperLikeStreak } from '../services/superLikeService';

const router = Router();

router.get('/status/:userId', async (req, res) => {
    try {
        const result = await getSuperLikeStatus(Number(req.params.userId));
        res.json(result);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.post('/use', async (req, res) => {
    try {
        const { fromUserId, toUserId } = req.body;
        await useSuperLike(Number(fromUserId), Number(toUserId));
        res.json({ success: true });
    } catch (e: any) { res.status(400).json({ error: e.message }); }
});

router.get('/streak/:userId', async (req, res) => {
    try {
        const streak = await getSuperLikeStreak(Number(req.params.userId));
        res.json({ streak });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
});

export default router;
