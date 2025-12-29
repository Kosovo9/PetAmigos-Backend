import { Router } from 'express';
import { consultVet } from '../services/petVetAIService';

const router = Router();

router.post('/consult', async (req, res) => {
    try {
        const { userId, petId, symptoms } = req.body;
        // Basic validation
        if (!userId || !petId || !symptoms) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const result = await consultVet(Number(userId), Number(petId), symptoms);
        res.json(result);
    } catch (error: any) {
        console.error('Vet Consult Error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
