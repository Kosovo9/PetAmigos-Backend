import { Router } from 'express';
import { Webhook } from 'svix';
import { db, getDb } from '../db';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

const router = Router();

router.post('/webhook', async (req, res) => {
    const payload = JSON.stringify(req.body);
    const headers = req.headers as any;
    const secret = process.env.CLERK_WEBHOOK_SECRET || '';

    if (!secret) {
        console.error("Missing CLERK_WEBHOOK_SECRET");
        return res.status(500).send("Configuration error");
    }

    const wh = new Webhook(secret);
    let evt: any;

    try {
        evt = wh.verify(payload, headers);
    } catch (err) {
        return res.status(400).send("Invalid signature");
    }

    const d = await getDb();
    if (!d) return res.status(500).send("DB error");

    const { id } = evt.data;
    const eventType = evt.type;

    if (eventType === 'user.created') {
        await d.insert(users).values({
            clerkId: id,
            email: evt.data.email_addresses[0].email_address,
            name: `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim(),
            avatarUrl: evt.data.image_url,
            openId: `clerk_${id}` // Fallback/compatibility
        });
    }

    if (eventType === 'user.updated') {
        await d.update(users)
            .set({
                name: `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim(),
                avatarUrl: evt.data.image_url,
            })
            .where(eq(users.clerkId, id));
    }

    if (eventType === 'user.deleted') {
        await d.delete(users).where(eq(users.clerkId, id));
    }

    res.sendStatus(204);
});

export default router;
