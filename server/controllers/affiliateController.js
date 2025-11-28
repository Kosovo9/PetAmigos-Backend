const User = require('../models/User');
const PromoCode = require('../models/PromoCode');
const QRCode = require('qrcode');
const { sendSaleNotification, sendTierUpgradeNotification } = require('../services/EmailNotificationService');

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

// 📊 PANEL DE AFILIADO (DASHBOARD ROBUSTO)
exports.getAffiliateDashboard = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        // Si no es afiliado, activarlo (Auto-Join por ahora)
        if (!user.affiliate.isAffiliate) {
            user.affiliate.isAffiliate = true;
            await user.save();
        }

        // Buscar códigos
        const promoCodes = await PromoCode.find({ affiliateId: userId });

        // Calcular TIER basado en lifetime earnings
        let currentTier = 'bronze';
        const earnings = user.affiliate.lifetimeEarnings;

        if (earnings > 10000) currentTier = 'platinum';
        else if (earnings > 5000) currentTier = 'gold';
        else if (earnings > 1000) currentTier = 'silver';

        if (user.affiliate.tier !== currentTier) {
            const oldTier = user.affiliate.tier;
            user.affiliate.tier = currentTier;
            await user.save();

            // Enviar notificación de upgrade
            const tierBenefits = {
                silver: ['Comisión 22%', 'Soporte prioritario'],
                gold: ['Comisión 25%', 'Pagos semanales', 'Dashboard avanzado'],
                platinum: ['Comisión 30%', 'Pagos instantáneos', 'Gerente de cuenta dedicado']
            };

            if (tierBenefits[currentTier]) {
                sendTierUpgradeNotification(user.email, {
                    newTier: currentTier,
                    benefits: tierBenefits[currentTier]
                }).catch(err => console.error('Error enviando email de tier:', err));
            }
        }

        // Obtener transacciones recientes
        const AffiliateTransaction = require('../models/AffiliateTransaction');
        const transactions = await AffiliateTransaction.find({ affiliateId: userId })
            .sort({ createdAt: -1 })
            .limit(10);

        // Métricas en tiempo real
        const metrics = {
            balance: user.affiliate.balance,
            lifetimeEarnings: user.affiliate.lifetimeEarnings,
            tier: user.affiliate.tier,
            nextTierProgress: calculateNextTierProgress(earnings),
            activeCodes: promoCodes.length,
            totalClicks: promoCodes.reduce((acc, curr) => acc + (curr.clicks || 0), 0), // Asumiendo que agregamos clicks al modelo
            conversionRate: '4.5%' // Placeholder, calcular real
        };

        res.status(200).json({
            success: true,
            dashboard: metrics,
            codes: promoCodes,
            transactions,
            settings: user.affiliate.settings
        });

    } catch (error) {
        console.error('Error en getAffiliateDashboard:', error);
        res.status(500).json({ error: 'Error al obtener dashboard' });
    }
};

function calculateNextTierProgress(earnings) {
    if (earnings >= 10000) return 100;
    if (earnings >= 5000) return ((earnings - 5000) / 5000) * 100;
    if (earnings >= 1000) return ((earnings - 1000) / 4000) * 100;
    return (earnings / 1000) * 100;
}

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

        // Si hay afiliado, notificarle y actualizar balance
        if (promoCode.affiliateId) {
            const affiliate = await User.findById(promoCode.affiliateId);
            const commission = purchaseAmount * (promoCode.affiliateCommission / 100);

            // Actualizar balance del afiliado
            affiliate.affiliate.balance += commission;
            affiliate.affiliate.lifetimeEarnings += commission;
            await affiliate.save();

            // Crear transacción
            const AffiliateTransaction = require('../models/AffiliateTransaction');
            await AffiliateTransaction.create({
                affiliateId: promoCode.affiliateId,
                type: 'commission',
                amount: commission,
                source: 'sale',
                status: 'completed',
                metadata: {
                    commissionRate: promoCode.affiliateCommission,
                    customerEmail: userId
                }
            });

            // Enviar email de notificación
            if (affiliate.affiliate.settings.emailNotifications) {
                sendSaleNotification(affiliate.email, {
                    amount: purchaseAmount.toFixed(2),
                    commission: commission.toFixed(2),
                    code: promoCode.code
                }).catch(err => console.error('Error enviando email:', err));
            }

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

