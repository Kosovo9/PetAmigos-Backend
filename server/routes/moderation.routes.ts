import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { moderationTickets } from '../../drizzle/schema';
import { db } from '../db';

const router = Router();

// Create a moderation ticket
router.post('/ticket', async (req, res) => {
    const { targetId, targetType, reason } = req.body;
    if (!targetId || !targetType || !reason) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    try {
        const result = await db.insert(moderationTickets).values({ targetId, targetType, reason }).returning();
        res.json({ ticket: result[0] });
    } catch (err) {
        console.error('Create ticket error', err);
        res.status(500).json({ error: 'Failed to create ticket' });
    }
});

// List tickets (admin view)
router.get('/tickets', async (req, res) => {
    try {
        const tickets = await db.select().from(moderationTickets).orderBy(moderationTickets.createdAt);
        res.json({ tickets });
    } catch (err) {
        console.error('List tickets error', err);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});

export default router;
