
// server/routes/pushRoutes.js
import express from 'express';
import webPush from '../utils/webPush.js';
import User from '../models/User.js'; // Ensure User model export is correct
import auth from '../middleware/auth.js';

const router = express.Router();

// Guardar suscripción del usuario
router.post('/subscribe', auth, async (req, res) => {
    const { subscription } = req.body;
    if (!subscription) return res.status(400).json({ error: 'Subscription object required' });

    try {
        // Add subscription to user
        // Assuming User model has a pushSubscriptions array or field. 
        // We'll update the User schema later to strictly support this.
        await User.findByIdAndUpdate(req.user.id, {
            $set: { pushSubscription: subscription } // Simple 1-device approach for now
        });
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error saving subscription' });
    }
});

export default router;
