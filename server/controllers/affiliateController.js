const User = require('../models/User');
const PromoCode = require('../models/PromoCode');
const QRCode = require('qrcode');

// 💎 CREAR CÓDIGO DE AFILIADO PERSONALIZADO
exports.createAffiliateCode = async (req, res) => {
    try {
        const userId = req.userId;
        const { customCode, commission = 20 } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Generar código único
        const code = customCode || `${user.name.substring(0, 3).toUpperCase()}${user.referralCode}`;

        // Crear código promocional
        const promoCode = new PromoCode({
            code,
            type: 'discount',
            discountPercent: 10, // 10% descuento para el cliente
            affiliateId: userId,
            affiliateCommission: commission, // 20% comisión para el afiliado
            maxUsesPerUser: 1,
            createdBy: userId
        });

        await promoCode.save();

        // Generar QR code
        const affiliateUrl = `https://www.petmatch.fun?promo=${code}`;
        const qrCodeDataUrl = await QRCode.toDataURL(affiliateUrl, {
            width: 300,
            margin: 2,
            color: {
                dark: '#7C3AED', // Purple
                light: '#FFFFFF'
            }
        });

        res.status(201).json({
            success: true,
            code,
            affiliateUrl,
            qrCode: qrCodeDataUrl,
            commission: `${commission}%`,
            message: 'Código de afiliado creado. ¡Comparte y gana!'
        });

    } catch (error) {
        console.error('Error en createAffiliateCode:', error);
        res.status(500).json({ error: 'Error al crear código de afiliado' });
    }
};

// 📊 PANEL DE AFILIADO (DASHBOARD)
exports.getAffiliateDashboard = async (req, res) => {
    try {
        const userId = req.userId;

        // Buscar todos los códigos del afiliado
        const promoCodes = await PromoCode.find({ affiliateId: userId });

        // Calcular estadísticas
        let totalUses = 0;
        let totalRevenue = 0;
        let totalCommission = 0;
        let recentSales = [];

        promoCodes.forEach(promo => {
            totalUses += promo.currentUses;
            totalRevenue += promo.totalRevenue;
            totalCommission += promo.totalRevenue * (promo.affiliateCommission / 100);

            // Últimas 10 ventas
            promo.usedBy.slice(-10).forEach(sale => {
                recentSales.push({
                    date: sale.usedAt,
                    revenue: sale.revenue,
                    commission: sale.revenue * (promo.affiliateCommission / 100),
                    code: promo.code
                });
            });
        });

        // Ordenar ventas por fecha
        recentSales.sort((a, b) => b.date - a.date);

        res.status(200).json({
            success: true,
            dashboard: {
                totalCodes: promoCodes.length,
                totalUses,
                totalRevenue: totalRevenue.toFixed(2),
                totalCommission: totalCommission.toFixed(2),
                pendingPayout: totalCommission.toFixed(2), // TODO: Restar pagos ya realizados
                commissionRate: '20%',
                codes: promoCodes.map(p => ({
                    code: p.code,
                    uses: p.currentUses,
                    revenue: p.totalRevenue.toFixed(2),
                    commission: (p.totalRevenue * (p.affiliateCommission / 100)).toFixed(2),
                    isActive: p.isActive,
                    affiliateUrl: `https://www.petmatch.fun?promo=${p.code}`
                })),
                recentSales: recentSales.slice(0, 10)
            }
        });

    } catch (error) {
        console.error('Error en getAffiliateDashboard:', error);
        res.status(500).json({ error: 'Error al obtener dashboard' });
    }
};

// 🎁 APLICAR CÓDIGO PROMOCIONAL
exports.applyPromoCode = async (req, res) => {
    try {
        const { code, purchaseAmount = 0 } = req.body;
        const userId = req.userId;

        const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });

        if (!promoCode) {
            return res.status(404).json({ error: 'Código inválido' });
        }

        // Verificar si puede usarse
        const check = promoCode.canBeUsed(userId);
        if (!check.valid) {
            return res.status(400).json({ error: check.reason });
        }

        // Aplicar código
        const benefit = await promoCode.apply(userId, purchaseAmount);

        // Si hay afiliado, notificarle (opcional)
        if (promoCode.affiliateId) {
            const affiliate = await User.findById(promoCode.affiliateId);
            const commission = purchaseAmount * (promoCode.affiliateCommission / 100);

            // TODO: Enviar notificación al afiliado
            console.log(`💰 Afiliado ${affiliate.email} ganó $${commission.toFixed(2)}`);
        }

        res.status(200).json({
            success: true,
            message: '¡Código aplicado!',
            benefit,
            finalAmount: purchaseAmount - (benefit.discount || 0)
        });

    } catch (error) {
        console.error('Error en applyPromoCode:', error);
        res.status(500).json({ error: error.message });
    }
};

// 💸 SOLICITAR PAGO DE COMISIONES
exports.requestPayout = async (req, res) => {
    try {
        const userId = req.userId;
        const { amount, paymentMethod } = req.body; // 'paypal', 'stripe', 'bank'

        const user = await User.findById(userId);

        // Verificar mínimo de pago ($50 USD)
        if (amount < 50) {
            return res.status(400).json({
                error: 'Mínimo de pago: $50 USD',
                currentBalance: amount
            });
        }

        // TODO: Procesar pago real
        // Por ahora solo registramos la solicitud

        res.status(200).json({
            success: true,
            message: 'Solicitud de pago recibida. Procesaremos en 3-5 días hábiles.',
            amount,
            paymentMethod,
            estimatedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 días
        });

    } catch (error) {
        console.error('Error en requestPayout:', error);
        res.status(500).json({ error: 'Error al solicitar pago' });
    }
};

// 📱 GENERAR QR PARA AFILIADO
exports.generateQR = async (req, res) => {
    try {
        const { code } = req.params;

        const promoCode = await PromoCode.findOne({ code: code.toUpperCase() });

        if (!promoCode) {
            return res.status(404).json({ error: 'Código no encontrado' });
        }

        const affiliateUrl = `https://www.petmatch.fun?promo=${code}`;

        // Generar QR en alta resolución
        const qrCodeDataUrl = await QRCode.toDataURL(affiliateUrl, {
            width: 500,
            margin: 3,
            color: {
                dark: '#7C3AED',
                light: '#FFFFFF'
            }
        });

        res.status(200).json({
            success: true,
            qrCode: qrCodeDataUrl,
            url: affiliateUrl,
            code
        });

    } catch (error) {
        console.error('Error en generateQR:', error);
        res.status(500).json({ error: 'Error al generar QR' });
    }
};

