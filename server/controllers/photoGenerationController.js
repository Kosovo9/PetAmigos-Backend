const User = require('../models/User');
const ImageGenerationService = require('../services/ImageGenerationService');
const { uploadToSupabase } = require('../services/StorageService'); // Lo crearemos después

// 🎨 GENERAR FOTO CON IA (CON SISTEMA DE CRÉDITOS)
exports.generatePhoto = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            category = 'christmas',
            scenario = 'santa',
            style = 'professional',
            petType = 'dog',
            petBreed = '',
            customDetails = ''
        } = req.body;

        // 1. Verificar usuario y créditos
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // 2. Verificar si tiene créditos
        if (!user.hasCredits(1)) {
            return res.status(402).json({
                error: 'Sin créditos suficientes',
                credits: user.credits,
                message: 'Compra más créditos o invita amigos para obtener más gratis',
                upsell: {
                    option1: { price: 4.99, credits: 50, name: 'Pack Básico' },
                    option2: { price: 14.99, credits: 'unlimited', name: 'Premium Mensual' }
                }
            });
        }

        // 3. Generar imagen con multi-engine
        console.log(`🎨 Generando foto para usuario ${user.email}...`);

        const imageResult = await ImageGenerationService.generate({
            category,
            scenario,
            style,
            petType,
            petBreed,
            customDetails
        }, user.subscriptionTier);

        // 4. Subir a storage (Supabase/Cloudflare)
        let finalImageUrl = imageResult.imageUrl;

        if (imageResult.imageUrl.startsWith('data:image')) {
            // Si es base64, subir a storage
            finalImageUrl = await uploadToSupabase(imageResult.imageUrl, userId);
        }

        // 5. Usar crédito
        await user.useCredits(1);

        // 6. Retornar resultado
        res.status(200).json({
            success: true,
            imageUrl: finalImageUrl,
            engine: imageResult.engine,
            quality: imageResult.quality,
            creditsRemaining: user.credits,
            isPremium: user.isPremium,
            watermark: !user.isPremium, // Solo premium sin watermark
            message: user.credits <= 2 ? '⚠️ Te quedan pocos créditos. Invita amigos para obtener más!' : null
        });

    } catch (error) {
        console.error('Error en generatePhoto:', error);
        res.status(500).json({
            error: 'Error al generar foto',
            details: error.message
        });
    }
};

// 🎥 GENERAR VIDEO (SOLO PREMIUM)
exports.generateVideo = async (req, res) => {
    try {
        const userId = req.userId;
        const { imageUrl, prompt } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar que sea premium
        if (!user.isPremium) {
            return res.status(403).json({
                error: 'Feature solo para usuarios Premium',
                upsell: {
                    message: 'Actualiza a Premium para generar videos con Sora',
                    price: 14.99,
                    features: ['Videos ilimitados', 'Fotos ilimitadas', 'Sin watermark', 'Prioridad en cola']
                }
            });
        }

        // Generar video con Sora
        const videoResult = await ImageGenerationService.generateVideo(imageUrl, prompt);

        res.status(200).json({
            success: true,
            videoUrl: videoResult.videoUrl,
            duration: videoResult.duration,
            engine: 'sora'
        });

    } catch (error) {
        console.error('Error en generateVideo:', error);
        res.status(500).json({ error: 'Error al generar video' });
    }
};

// 📊 OBTENER HISTORIAL DE FOTOS
exports.getPhotoHistory = async (req, res) => {
    try {
        const userId = req.userId;

        // TODO: Implementar modelo PhotoHistory
        // Por ahora retornamos mock

        res.status(200).json({
            success: true,
            photos: [
                {
                    id: 1,
                    imageUrl: 'https://example.com/photo1.jpg',
                    createdAt: new Date(),
                    style: 'christmas',
                    engine: 'google-ai'
                }
            ]
        });

    } catch (error) {
        console.error('Error en getPhotoHistory:', error);
        res.status(500).json({ error: 'Error al obtener historial' });
    }
};

module.exports = {
    generatePhoto,
    generateVideo,
    getPhotoHistory
};
