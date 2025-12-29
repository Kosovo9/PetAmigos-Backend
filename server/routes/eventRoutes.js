
// server/routes/eventRoutes.js
import express from 'express';
import Event from '../models/Event.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Crear evento
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, date, coordinates } = req.body;
        const event = await Event.create({
            title, description, date,
            location: { type: 'Point', coordinates },
            host: req.user.id
        });
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ error: 'Error creating event' });
    }
});

// Obtener eventos cercanos
router.get('/', async (req, res) => {
    try {
        const { lng, lat, distance = 10000 } = req.query; // Default 10km

        if (!lng || !lat) return res.status(400).json({ error: 'Coordinates required' });

        const events = await Event.find({
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
                    $maxDistance: parseInt(distance)
                }
            }
        }).populate('host', 'name');

        res.json(events);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching events' });
    }
});

export default router;
