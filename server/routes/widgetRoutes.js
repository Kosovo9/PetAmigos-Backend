
// server/routes/widgetRoutes.js
import express from 'express';
import Pet from '../models/PetProfile.js'; // Ensure correct path to models

const router = express.Router();

// API pública (sin autenticación) para widget
router.get('/pet/:petId', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.petId).select('name bio photo image status'); // Select safe fields
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        // Normalize image field
        const image = pet.photo || pet.image || null;

        res.json({
            _id: pet._id,
            name: pet.name,
            bio: pet.bio,
            image: image,
            status: pet.status
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

export default router;
