
import { Router } from "express";
import { db } from "../db";
import { moderationQueue } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { approveContent, rejectContent } from "../services/moderationService";

const router = Router();

// Get Pending Items
router.get('/pending', async (req, res) => {
    // In strict system, verify moderator role here
    const pendingItems = await db.select()
        .from(moderationQueue)
        .where(eq(moderationQueue.status, 'pending'))
        .orderBy(desc(moderationQueue.createdAt));
    res.json(pendingItems);
});

// Approve
router.post('/:id/approve', async (req, res) => {
    const { id } = req.params;
    const { moderatorId } = req.body; // In Prod, get from verified user token
    await approveContent(Number(id), moderatorId || 1); // fallback admin
    res.json({ success: true, action: 'approved' });
});

// Reject
router.post('/:id/reject', async (req, res) => {
    const { id } = req.params;
    const { moderatorId } = req.body;
    await rejectContent(Number(id), moderatorId || 1);
    res.json({ success: true, action: 'rejected' });
});

export default router;
