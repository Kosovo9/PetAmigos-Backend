
import { Router } from "express";
import { db } from "../db";
import { pets } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const router = Router();

// API pública (sin autenticación) para widget
router.get('/pet/:petId', async (req, res) => {
    try {
        const petId = parseInt(req.params.petId);
        if (isNaN(petId)) return res.status(400).json({ error: "Invalid ID" });

        const [pet] = await db.select({
            name: pets.name,
            bio: pets.bio,
            avatarUrl: pets.avatarUrl,
            species: pets.species
        }).from(pets).where(eq(pets.id, petId));

        if (!pet) return res.status(404).json({ error: "Pet not found" });

        res.json(pet);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
