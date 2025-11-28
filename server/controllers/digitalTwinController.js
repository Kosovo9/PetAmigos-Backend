const DigitalTwin = require('../models/DigitalTwin');
const PetProfile = require('../models/PetProfile');

// @desc    Get digital twin status
// @route   GET /api/digital-twin/:petId
// @access  Private
exports.getTwinStatus = async (req, res) => {
    try {
        let twin = await DigitalTwin.findOne({ petId: req.params.petId });

        if (!twin) {
            // Check if pet exists and belongs to user
            const pet = await PetProfile.findOne({ _id: req.params.petId, owner: req.user._id });
            if (!pet) {
                return res.status(404).json({ error: 'Pet not found or unauthorized' });
            }

            // Create new twin if not exists
            twin = await DigitalTwin.create({
                petId: req.params.petId,
                userId: req.user._id
            });
        }

        // Decay stats based on time passed since last update
        const now = new Date();
        const hoursPassed = (now - new Date(twin.updatedAt)) / (1000 * 60 * 60);

        if (hoursPassed > 0.1) { // Only update if significant time passed
            // Simple decay logic
            twin.energy = Math.max(0, twin.energy - (hoursPassed * 5));
            twin.hunger = Math.min(100, twin.hunger + (hoursPassed * 8));
            twin.hygiene = Math.max(0, twin.hygiene - (hoursPassed * 2));
            twin.happiness = Math.max(0, twin.happiness - (hoursPassed * 3));

            await twin.save();
        }

        res.json(twin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Perform action on twin
// @route   POST /api/digital-twin/:petId/action
// @access  Private
exports.performAction = async (req, res) => {
    try {
        const { action } = req.body; // feed, play, clean, sleep
        const twin = await DigitalTwin.findOne({ petId: req.params.petId, userId: req.user._id });

        if (!twin) {
            return res.status(404).json({ error: 'Digital Twin not found' });
        }

        let xpGain = 0;
        let message = '';

        switch (action) {
            case 'feed':
                if (twin.hunger < 10) return res.status(400).json({ error: 'Not hungry!' });
                twin.hunger = Math.max(0, twin.hunger - 30);
                twin.energy = Math.min(100, twin.energy + 5);
                xpGain = 10;
                message = 'Yummy!';
                break;
            case 'play':
                if (twin.energy < 20) return res.status(400).json({ error: 'Too tired to play!' });
                twin.happiness = Math.min(100, twin.happiness + 20);
                twin.energy = Math.max(0, twin.energy - 20);
                twin.hunger = Math.min(100, twin.hunger + 10);
                xpGain = 15;
                message = 'Fun time!';
                break;
            case 'clean':
                twin.hygiene = 100;
                twin.happiness = Math.min(100, twin.happiness + 5);
                xpGain = 5;
                message = 'Squeaky clean!';
                break;
            case 'sleep':
                twin.status = 'sleeping';
                twin.energy = 100; // Instant recharge for demo purposes (or start timer)
                message = 'Zzz...';
                break;
            case 'wake':
                twin.status = 'awake';
                message = 'Good morning!';
                break;
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }

        if (xpGain > 0) {
            twin.xp += xpGain;
            twin.calculateLevel();
        }

        await twin.save();

        res.json({
            success: true,
            message,
            twin
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Sync with real world data (e.g. from Smart Collar)
// @route   POST /api/digital-twin/:petId/sync
// @access  Private
exports.syncRealWorld = async (req, res) => {
    try {
        const { steps, activityType } = req.body;
        const twin = await DigitalTwin.findOne({ petId: req.params.petId, userId: req.user._id });

        if (!twin) {
            return res.status(404).json({ error: 'Digital Twin not found' });
        }

        // Convert real steps to game stats
        if (steps) {
            twin.stepsToday += steps;
            twin.xp += Math.floor(steps / 100); // 1 XP per 100 steps
            twin.happiness = Math.min(100, twin.happiness + 10); // Walking makes pets happy
            twin.energy = Math.max(0, twin.energy - 10); // Walking tires them out
        }

        twin.calculateLevel();
        twin.lastSync = new Date();
        await twin.save();

        res.json({ success: true, twin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
