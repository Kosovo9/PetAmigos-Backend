const User = require('../models/User');
const ImageGenerationService = require('../services/ImageGenerationService');
const { uploadToSupabase } = require('../services/StorageService');
const { generateBothVersions } = require('../services/WatermarkService');
const mongoose = require('mongoose');

// 📸 MODELO DE FOTO GENERADA
const GeneratedPhotoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // URLs de las imágenes
    watermarkedUrl: { type: String, required: true }, // Versión con watermark (free)
    cleanUrl: { type: String, required: true }, // Versión sin watermark (premium)

    // Metadata de generación
    prompt: String,
    category: String,
    scenario: String,
    style: String,
    engine: String, // 'google-ai', 'higgsfield', 'huggingface'
    quality: String, // '1K', '4K', '8K'

    // Estado de pago
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    paymentAmount: { type: Number },
    paymentMethod: String,

    // Download tracking
    downloadCount: { type: Number, default: 0 },
    lastDownloadAt: { type: Date },

    // Expiración (para usuarios free)
    expiresAt: { type: Date },
    isExpired: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now }
});

// Índices
GeneratedPhotoSchema.index({ userId: 1, createdAt: -1 });
GeneratedPhotoSchema.index({ isPaid: 1, expiresAt: 1 });

// Métodos
GeneratedPhotoSchema.methods.markAsPaid = async function (amount, method) {
    this.isPaid = true;
    this.paidAt = new Date();
    this.paymentAmount = amount;
    this.paymentMethod = method;
    this.expiresAt = null; // No expira si está pagado
    await this.save();
};

GeneratedPhotoSchema.methods.canDownload = function (user) {
    // Premium users pueden descargar siempre
    if (user.isPremium) return { allowed: true };

    // Si está pagado, puede descargar
    if (this.isPaid) return { allowed: true };

    // Si expiró, no puede descargar
    if (this.expiresAt && new Date() > this.expiresAt) {
        return { allowed: false, reason: 'Foto expirada. Compra para descargar.' };
    }

    // Free users solo pueden ver versión con watermark
    return { allowed: true, watermarked: true };
};

const GeneratedPhoto = mongoose.model('GeneratedPhoto', GeneratedPhotoSchema);

// 🎨 GENERAR FOTO CON WATERMARK
exports.generatePhoto = async (req, res) => {
    try {
        const userId = req.userId;
        const options = req.body;

        // 1. Verificar usuario y créditos
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        if (!user.hasCredits(1)) {
            return res.status(402).json({
                error: 'Sin créditos',
                upsell: {
                    basic: { price: 4.99, credits: 50 },
                    pro: { price: 14.99, credits: 'unlimited' }
                }
            });
        }

        // 2. Generar imagen con IA
        console.log(`🎨 Generando foto para ${user.email}...`);
        const imageResult = await ImageGenerationService.generate(options, user.subscriptionTier);

        // 3. Convertir a buffer si es base64
        let imageBuffer;
        if (imageResult.imageUrl.startsWith('data:image')) {
            const base64Data = imageResult.imageUrl.split(',')[1];
            imageBuffer = Buffer.from(base64Data, 'base64');
        } else {
            // Descargar imagen si es URL
            const axios = require('axios');
            const response = await axios.get(imageResult.imageUrl, { responseType: 'arraybuffer' });
            imageBuffer = Buffer.from(response.data);
        }

        // 4. Generar versiones con y sin watermark
        const versions = await generateBothVersions(imageBuffer);

        // 5. Subir ambas versiones a storage
        const watermarkedUrl = await uploadToSupabase(versions.watermarked, userId);
        const cleanUrl = await uploadToSupabase(versions.clean, `${userId}/premium`);

        // 6. Guardar en BD
        const photo = new GeneratedPhoto({
            userId,
            watermarkedUrl,
            cleanUrl,
            prompt: JSON.stringify(options),
            category: options.category,
            scenario: options.scenario,
            style: options.style,
            engine: imageResult.engine,
            quality: imageResult.quality,
            isPaid: user.isPremium, // Premium users ya tienen acceso
            expiresAt: user.isPremium ? null : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días para free
        });

        await photo.save();

        // 7. Usar crédito
        await user.useCredits(1);

        // 8. Retornar resultado
        res.status(200).json({
            success: true,
            photoId: photo._id,
            imageUrl: user.isPremium ? cleanUrl : watermarkedUrl, // Premium ve versión limpia
            hasWatermark: !user.isPremium,
            engine: imageResult.engine,
            quality: imageResult.quality,
            creditsRemaining: user.credits,
            expiresAt: photo.expiresAt,
            message: user.isPremium ? null : '💎 Actualiza a Premium para remover la marca de agua'
        });

    } catch (error) {
        console.error('Error en generatePhoto:', error);
        res.status(500).json({ error: 'Error al generar foto' });
    }
};

// 📥 DESCARGAR FOTO
exports.downloadPhoto = async (req, res) => {
    try {
        const { photoId } = req.params;
        const userId = req.userId;

        const photo = await GeneratedPhoto.findById(photoId);

        if (!photo) {
            return res.status(404).json({ error: 'Foto no encontrada' });
        }

        // Verificar que sea del usuario
        if (photo.userId.toString() !== userId) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const user = await User.findById(userId);
        const downloadCheck = photo.canDownload(user);

        if (!downloadCheck.allowed) {
            return res.status(402).json({
                error: downloadCheck.reason,
                photoId: photo._id,
                upsell: {
                    message: 'Compra esta foto por $2.99 o actualiza a Premium',
                    options: {
                        singlePhoto: { price: 2.99, name: 'Comprar esta foto' },
                        premium: { price: 14.99, name: 'Premium Mensual (ilimitado)' }
                    }
                }
            });
        }

        // Actualizar contador de descargas
        photo.downloadCount += 1;
        photo.lastDownloadAt = new Date();
        await photo.save();

        // Retornar URL correcta
        const downloadUrl = (user.isPremium || photo.isPaid) ? photo.cleanUrl : photo.watermarkedUrl;

        res.status(200).json({
            success: true,
            downloadUrl,
            hasWatermark: downloadCheck.watermarked || false,
            message: downloadCheck.watermarked ? 'Versión con marca de agua. Paga para obtener versión limpia.' : 'Descarga lista'
        });

    } catch (error) {
        console.error('Error en downloadPhoto:', error);
        res.status(500).json({ error: 'Error al descargar foto' });
    }
};

// 💳 COMPRAR FOTO INDIVIDUAL
exports.purchasePhoto = async (req, res) => {
    try {
        const { photoId } = req.params;
        const { paymentMethod } = req.body; // 'stripe', 'paypal', etc
        const userId = req.userId;

        const photo = await GeneratedPhoto.findById(photoId);

        if (!photo) {
            return res.status(404).json({ error: 'Foto no encontrada' });
        }

        if (photo.userId.toString() !== userId) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        if (photo.isPaid) {
            return res.status(400).json({ error: 'Foto ya comprada' });
        }

        // TODO: Procesar pago real con Stripe/PayPal
        // Por ahora simulamos pago exitoso

        await photo.markAsPaid(2.99, paymentMethod);

        res.status(200).json({
            success: true,
            message: '¡Foto comprada! Ya puedes descargar la versión sin marca de agua',
            photoId: photo._id,
            downloadUrl: photo.cleanUrl
        });

    } catch (error) {
        console.error('Error en purchasePhoto:', error);
        res.status(500).json({ error: 'Error al comprar foto' });
    }
};
