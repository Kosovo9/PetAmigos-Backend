const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/User');

// 🔐 HABILITAR 2FA (Two-Factor Authentication)
exports.enable2FA = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Generar secret para Google Authenticator
        const secret = speakeasy.generateSecret({
            name: `PetMatch Affiliates (${user.email})`,
            length: 32
        });

        // Guardar secret temporalmente (se confirmará después de verificar)
        user.affiliate.twoFactorSecret = secret.base32;
        await user.save();

        // Generar QR code para escanear
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

        res.json({
            success: true,
            secret: secret.base32,
            qrCode: qrCodeUrl,
            message: 'Escanea el código QR con Google Authenticator y verifica con el código generado'
        });

    } catch (error) {
        console.error('Error en enable2FA:', error);
        res.status(500).json({ error: 'Error al habilitar 2FA' });
    }
};

// ✅ VERIFICAR Y CONFIRMAR 2FA
exports.verify2FA = async (req, res) => {
    try {
        const userId = req.userId;
        const { token } = req.body;

        const user = await User.findById(userId);

        if (!user || !user.affiliate.twoFactorSecret) {
            return res.status(400).json({ error: 'Primero debes habilitar 2FA' });
        }

        // Verificar el token
        const verified = speakeasy.totp.verify({
            secret: user.affiliate.twoFactorSecret,
            encoding: 'base32',
            token,
            window: 2
        });

        if (!verified) {
            return res.status(400).json({ error: 'Código inválido. Intenta de nuevo.' });
        }

        // Activar 2FA permanentemente
        user.affiliate.twoFactorEnabled = true;
        await user.save();

        res.json({
            success: true,
            message: '¡2FA activado exitosamente! Tu cuenta ahora está más segura.'
        });

    } catch (error) {
        console.error('Error en verify2FA:', error);
        res.status(500).json({ error: 'Error al verificar 2FA' });
    }
};

// 🔓 DESACTIVAR 2FA
exports.disable2FA = async (req, res) => {
    try {
        const userId = req.userId;
        const { token } = req.body;

        const user = await User.findById(userId);

        if (!user || !user.affiliate.twoFactorEnabled) {
            return res.status(400).json({ error: '2FA no está habilitado' });
        }

        // Verificar token antes de desactivar
        const verified = speakeasy.totp.verify({
            secret: user.affiliate.twoFactorSecret,
            encoding: 'base32',
            token,
            window: 2
        });

        if (!verified) {
            return res.status(400).json({ error: 'Código inválido' });
        }

        user.affiliate.twoFactorEnabled = false;
        user.affiliate.twoFactorSecret = null;
        await user.save();

        res.json({
            success: true,
            message: '2FA desactivado'
        });

    } catch (error) {
        console.error('Error en disable2FA:', error);
        res.status(500).json({ error: 'Error al desactivar 2FA' });
    }
};

