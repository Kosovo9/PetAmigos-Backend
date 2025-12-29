import { Router } from "express";
import { db } from "../db";
import { users } from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";

const router = Router();

// Send treats to another user
router.post('/send', async (req, res) => {
    try {
        const { senderId, receiverId, amount } = req.body;

        if (amount <= 0) return res.status(400).json({ error: "Invalid amount" });

        // Transaction logic (simulated with standard queries for now)
        const [sender] = await db.select().from(users).where(eq(users.id, senderId));
        if (!sender || (sender.treats !== null && sender.treats < amount)) {
            return res.status(400).json({ error: "Insufficient treats" });
        }

        // Deduct from sender
        await db.update(users)
            .set({ treats: sql`${users.treats} - ${amount}` })
            .where(eq(users.id, senderId));

        // Add to receiver
        await db.update(users)
            .set({ treats: sql`${users.treats} + ${amount}` })
            .where(eq(users.id, receiverId));

        res.json({ success: true, message: `Sent ${amount} treats successfully` });
    } catch (error) {
        res.status(500).json({ error: "Transaction failed" });
    }
});

// Get balance
router.get('/balance/:userId', async (req, res) => {
    const { userId } = req.params;
    const [user] = await db.select().from(users).where(eq(users.id, Number(userId)));
    res.json({ balance: user?.treats || 0 });
});

export default router;
