
import { Router } from "express";
import { db } from "../db";
import { playdates } from "../../drizzle/schema"; // Reusing playdates as 'Events'
import { eq, sql } from "drizzle-orm";

const router = Router();

// Create Event (using playdates schema for simplicity as per request context)
router.post('/', async (req, res) => {
    try {
        const { organizerId, location, scheduledAt, durationMinutes } = req.body;
        // Basic validation...

        await db.insert(playdates).values({
            organizerId,
            location: JSON.stringify(location), // Store geojson
            scheduledAt: new Date(scheduledAt),
            durationMinutes,
            status: 'confirmed'
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to create event" });
    }
});

// Get Events for Map
router.get('/map', async (req, res) => {
    // In real app, filter by viewport bbox
    const events = await db.select().from(playdates);
    res.json(events);
});

export default router;
