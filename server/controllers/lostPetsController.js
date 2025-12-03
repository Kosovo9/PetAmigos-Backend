const LostPet = require('../models/LostPet');

exports.reportLostPet = async (req, res) => {
    try {
        const { name, type, breed, description, address, latitude, longitude, lastSeenDate, contactPhone, images } = req.body;

        const newReport = new LostPet({
            name,
            type,
            breed,
            description,
            lastSeenLocation: {
                type: 'Point',
                coordinates: [longitude, latitude],
                address
            },
            lastSeenDate,
            contactPhone,
            images,
            owner: req.user ? req.user.id : null // Optional owner if not logged in, but better if logged in
        });

        await newReport.save();
        res.status(201).json({ success: true, data: newReport });
    } catch (error) {
        console.error('Error reporting lost pet:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getLostPets = async (req, res) => {
    try {
        // Simple fetch for now, can add geospatial query later
        const pets = await LostPet.find({ status: 'lost' }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: pets.length, data: pets });
    } catch (error) {
        console.error('Error fetching lost pets:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
