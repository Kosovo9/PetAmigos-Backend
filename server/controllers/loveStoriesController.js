const LoveStory = require('../models/LoveStory');
const { StorageService } = require('../services/StorageService');

// @desc    Obtener todas las historias aprobadas
// @route   GET /api/love-stories
// @access  Public
exports.getAllStories = async (req, res) => {
    try {
        const { page = 1, limit = 12, country, species, featured } = req.query;

        const query = { status: 'approved' };

        if (country) query['location.country'] = country;
        if (species) query.petSpecies = species;
        if (featured === 'true') query.featured = true;

        const stories = await LoveStory.find(query)
            .populate('userId', 'name profilePicture')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const count = await LoveStory.countDocuments(query);

        res.json({
            stories,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Obtener una historia por slug
// @route   GET /api/love-stories/:slug
// @access  Public
exports.getStoryBySlug = async (req, res) => {
    try {
        const story = await LoveStory.findOne({ slug: req.params.slug, status: 'approved' })
            .populate('userId', 'name profilePicture location');

        if (!story) {
            return res.status(404).json({ error: 'Historia no encontrada' });
        }

        // Incrementar vistas
        await story.incrementViews();

        res.json(story);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Crear nueva historia
// @route   POST /api/love-stories
// @access  Private
exports.createStory = async (req, res) => {
    try {
        const { petName, petSpecies, petBreed, title, story, adoptionDate, location } = req.body;

        // Validaciones
        if (!petName || !petSpecies || !title || !story || !adoptionDate) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        const newStory = new LoveStory({
            userId: req.user.id,
            petName,
            petSpecies,
            petBreed,
            title,
            story,
            adoptionDate,
            location,
            status: 'pending' // Requiere aprobación
        });

        await newStory.save();

        res.status(201).json({
            message: 'Historia creada exitosamente. Será revisada antes de publicarse.',
            story: newStory
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Subir foto a una historia
// @route   POST /api/love-stories/:id/photos
// @access  Private
exports.uploadPhoto = async (req, res) => {
    try {
        const story = await LoveStory.findById(req.params.id);

        if (!story) {
            return res.status(404).json({ error: 'Historia no encontrada' });
        }

        // Verificar que el usuario es el dueño
        if (story.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        if (!req.files || !req.files.photo) {
            return res.status(400).json({ error: 'No se envió ninguna foto' });
        }

        const photo = req.files.photo;

        // Subir a storage (Supabase o Cloudflare R2)
        const photoUrl = await StorageService.uploadImage(photo, 'love-stories');

        story.photos.push({
            url: photoUrl,
            caption: req.body.caption || '',
            isVerified: false
        });

        await story.save();

        res.json({
            message: 'Foto subida exitosamente',
            photo: story.photos[story.photos.length - 1]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Dar/quitar like a una historia
// @route   POST /api/love-stories/:id/like
// @access  Private
exports.toggleLike = async (req, res) => {
    try {
        const story = await LoveStory.findById(req.params.id);

        if (!story) {
            return res.status(404).json({ error: 'Historia no encontrada' });
        }

        await story.toggleLike(req.user.id);

        res.json({
            likes: story.likes,
            liked: story.likedBy.includes(req.user.id)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Incrementar contador de shares
// @route   POST /api/love-stories/:id/share
// @access  Public
exports.shareStory = async (req, res) => {
    try {
        const story = await LoveStory.findById(req.params.id);

        if (!story) {
            return res.status(404).json({ error: 'Historia no encontrada' });
        }

        await story.incrementShares();

        res.json({ shares: story.shares });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Aprobar historia (Admin)
// @route   PUT /api/love-stories/:id/approve
// @access  Private/Admin
exports.approveStory = async (req, res) => {
    try {
        const story = await LoveStory.findById(req.params.id);

        if (!story) {
            return res.status(404).json({ error: 'Historia no encontrada' });
        }

        story.status = 'approved';
        story.isVerified = true;
        story.verifiedAt = new Date();
        story.verifiedBy = req.user.id;

        await story.save();

        res.json({ message: 'Historia aprobada', story });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Obtener historias del usuario autenticado
// @route   GET /api/love-stories/my-stories
// @access  Private
exports.getMyStories = async (req, res) => {
    try {
        const stories = await LoveStory.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.json(stories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Destacar historia (Admin)
// @route   PUT /api/love-stories/:id/feature
// @access  Private/Admin
exports.featureStory = async (req, res) => {
    try {
        const { days = 7 } = req.body;

        const story = await LoveStory.findById(req.params.id);

        if (!story) {
            return res.status(404).json({ error: 'Historia no encontrada' });
        }

        story.featured = true;
        story.featuredUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

        await story.save();

        res.json({ message: `Historia destacada por ${days} días`, story });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
