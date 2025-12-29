
// server/routes/metricsRoutes.js
import express from 'express';
import SecurityLog from '../models/SecurityLog.js';
import PetProfile from '../models/PetProfile.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Solo moderadores/admin (se debe reforzar el auth middleware para checar roles)
router.use(auth);

router.get('/dashboard', async (req, res) => {
    try {
        // Example metrics
        const blockedContent = await SecurityLog.countDocuments({ action: 'blocked_content' });
        const alerts = await SecurityLog.countDocuments({ action: 'amber_alert' });
        const activeLostPets = await PetProfile.countDocuments({ status: 'lost' });

        // Last 7 days logs
        const recentLogs = await SecurityLog.find().sort({ createdAt: -1 }).limit(10);

        res.json({
            metrics: {
                blockedContent,
                alerts,
                activeLostPets
            },
            recentLogs
        });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

export default router;
