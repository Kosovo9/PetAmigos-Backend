const AffiliatePayout = require('../models/AffiliatePayout');
const PromoCode = require('../models/PromoCode');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

// 💸 SOLICITAR PAGO DE COMISIONES
exports.requestPayout = async (req, res) => {
    try {
        const affiliateId = req.userId;
        const { paymentMethod, paymentDetails } = req.body;

        // 1. Calcular comisiones pendientes
        const promoCodes = await PromoCode.find({ affiliateId });

        let totalCommission = 0;
        let commissions = [];

        promoCodes.forEach(promo => {
            promo.usedBy.forEach(sale => {
                const commissionAmount = sale.revenue * (promo.affiliateCommission / 100);
                totalCommission += commissionAmount;

                commissions.push({
                    promoCodeId: promo._id,
                    saleAmount: sale.revenue,
                    commissionAmount,
                    saleDate: sale.usedAt
                });
            });
        });

        // 2. Verificar mínimo de pago ($50 USD)
        if (totalCommission < 50) {
            return res.status(400).json({
                error: 'Mínimo de pago: $50 USD',
                currentBalance: totalCommission.toFixed(2),
                message: `Te faltan $${(50 - totalCommission).toFixed(2)} para solicitar pago`
            });
        }

        // 3. Verificar que no haya pagos pendientes
        const pendingPayout = await AffiliatePayout.findOne({
            affiliateId,
            status: { $in: ['pending', 'processing'] }
        });

        if (pendingPayout) {
            return res.status(400).json({
                error: 'Ya tienes un pago pendiente',
                payoutId: pendingPayout._id,
                amount: pendingPayout.amount,
                status: pendingPayout.status,
                requestedAt: pendingPayout.requestedAt
            });
        }

        // 4. Crear solicitud de pago
        const payout = new AffiliatePayout({
            affiliateId,
            amount: totalCommission,
            currency: 'USD',
            paymentMethod,
            paymentDetails,
            commissions,
            status: 'pending'
        });

        await payout.save();

        // 5. Notificar al admin (TODO: enviar email)
        console.log(`💰 Nueva solicitud de pago: $${totalCommission.toFixed(2)} para afiliado ${affiliateId}`);

        res.status(201).json({
            success: true,
            message: 'Solicitud de pago recibida. Procesaremos en 3-5 días hábiles.',
            payout: {
                id: payout._id,
                amount: totalCommission.toFixed(2),
                paymentMethod,
                status: 'pending',
                estimatedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 días
            }
        });

    } catch (error) {
        console.error('Error en requestPayout:', error);
        res.status(500).json({ error: 'Error al solicitar pago' });
    }
};

// 💳 PROCESAR PAGO (ADMIN)
exports.processPayout = async (req, res) => {
    try {
        const { payoutId } = req.params;
        const adminId = req.userId;

        // Verificar que sea admin (TODO: agregar middleware de admin)
        const admin = await User.findById(adminId);
        if (!admin || !admin.isAdmin) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const payout = await AffiliatePayout.findById(payoutId);

        if (!payout) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }

        if (payout.status !== 'pending') {
            return res.status(400).json({
                error: 'Pago ya procesado',
                status: payout.status
            });
        }

        // Marcar como procesando
        await payout.markAsProcessing();

        try {
            let transactionId;

            // Procesar según método de pago
            switch (payout.paymentMethod) {
                case 'paypal':
                    transactionId = await this.processPayPalPayout(payout);
                    break;
                case 'stripe':
                    transactionId = await this.processStripePayout(payout);
                    break;
                case 'bank_transfer':
                    transactionId = `BANK_${Date.now()}`;
                    // TODO: Integrar con banco
                    break;
                case 'crypto':
                    transactionId = `CRYPTO_${Date.now()}`;
                    // TODO: Integrar con wallet
                    break;
            }

            // Marcar como completado
            await payout.markAsCompleted(transactionId);

            res.status(200).json({
                success: true,
                message: 'Pago procesado exitosamente',
                transactionId,
                amount: payout.amount
            });

        } catch (error) {
            // Marcar como fallido
            await payout.markAsFailed(error.message);

            res.status(500).json({
                error: 'Error procesando pago',
                details: error.message
            });
        }

    } catch (error) {
        console.error('Error en processPayout:', error);
        res.status(500).json({ error: 'Error al procesar pago' });
    }
};

// 💵 PROCESAR PAGO VÍA PAYPAL
exports.processPayPalPayout = async (payout) => {
    try {
        console.log('💵 Procesando pago vía PayPal...');

        const response = await axios.post(
            'https://api.paypal.com/v1/payments/payouts',
            {
                sender_batch_header: {
                    sender_batch_id: `payout_${payout._id}`,
                    email_subject: 'Pago de comisiones PetMatch.fun'
                },
                items: [{
                    recipient_type: 'EMAIL',
                    amount: {
                        value: payout.amount.toFixed(2),
                        currency: 'USD'
                    },
                    receiver: payout.paymentDetails.paypalEmail,
                    note: `Comisiones de afiliado - ${payout.commissions.length} ventas`,
                    sender_item_id: payout._id.toString()
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`
                }
            }
        );

        return response.data.batch_header.payout_batch_id;

    } catch (error) {
        console.error('❌ Error en PayPal payout:', error);
        throw error;
    }
};

// 💳 PROCESAR PAGO VÍA STRIPE
exports.processStripePayout = async (payout) => {
    try {
        console.log('💳 Procesando pago vía Stripe...');

        const transfer = await stripe.transfers.create({
            amount: Math.round(payout.amount * 100), // Convertir a centavos
            currency: 'usd',
            destination: payout.paymentDetails.stripeAccountId,
            description: `Comisiones de afiliado - ${payout.commissions.length} ventas`
        });

        return transfer.id;

    } catch (error) {
        console.error('❌ Error en Stripe payout:', error);
        throw error;
    }
};

// 📊 HISTORIAL DE PAGOS
exports.getPayoutHistory = async (req, res) => {
    try {
        const affiliateId = req.userId;

        const payouts = await AffiliatePayout.find({ affiliateId })
            .sort({ requestedAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            payouts: payouts.map(p => ({
                id: p._id,
                amount: p.amount.toFixed(2),
                status: p.status,
                paymentMethod: p.paymentMethod,
                requestedAt: p.requestedAt,
                completedAt: p.completedAt,
                transactionId: p.transactionId
            }))
        });

    } catch (error) {
        console.error('Error en getPayoutHistory:', error);
        res.status(500).json({ error: 'Error al obtener historial' });
    }
};

module.exports = {
    requestPayout,
    processPayout,
    processPayPalPayout,
    processStripePayout,
    getPayoutHistory
};
