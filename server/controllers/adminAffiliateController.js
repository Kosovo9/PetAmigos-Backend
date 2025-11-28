const User = require('../models/User');
const AffiliateTransaction = require('../models/AffiliateTransaction');
const PromoCode = require('../models/PromoCode');

// @desc    Obtener estadísticas de afiliados (Admin)
// @route   GET /api/admin/affiliates/stats
// @access  Private/Admin
exports.getAffiliateStats = async (req, res) => {
    try {
        // Total de afiliados activos
        const totalAffiliates = await User.countDocuments({ 'affiliate.isAffiliate': true });

        // Distribución por tier
        const tierDistribution = await User.aggregate([
            { $match: { 'affiliate.isAffiliate': true } },
            { $group: { _id: '$affiliate.tier', count: { $sum: 1 } } }
        ]);

        // Comisiones totales pagadas
        const totalCommissions = await AffiliateTransaction.aggregate([
            { $match: { type: 'commission', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Pagos pendientes
        const pendingPayouts = await AffiliateTransaction.aggregate([
            { $match: { type: 'payout', status: 'pending' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Top 10 afiliados
        const topAffiliates = await User.find({ 'affiliate.isAffiliate': true })
            .sort({ 'affiliate.lifetimeEarnings': -1 })
            .limit(10)
            .select('name email affiliate.lifetimeEarnings affiliate.tier');

        res.json({
            success: true,
            stats: {
                totalAffiliates,
                tierDistribution,
                totalCommissionsPaid: totalCommissions[0]?.total || 0,
                pendingPayouts: pendingPayouts[0]?.total || 0,
                topAffiliates
            }
        });

    } catch (error) {
        console.error('Error en getAffiliateStats:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas de afiliados' });
    }
};

// @desc    Aprobar/Rechazar solicitud de pago
// @route   PUT /api/admin/affiliates/payouts/:id
// @access  Private/Admin
exports.processPayoutRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, notes } = req.body; // 'approve' or 'reject'

        const transaction = await AffiliateTransaction.findById(id);

        if (!transaction || transaction.type !== 'payout') {
            return res.status(404).json({ error: 'Solicitud de pago no encontrada' });
        }

        if (action === 'approve') {
            transaction.status = 'completed';
            transaction.processedAt = new Date();

            // Descontar del balance del afiliado
            const affiliate = await User.findById(transaction.affiliateId);
            affiliate.affiliate.balance -= transaction.amount;
            await affiliate.save();

            // TODO: Procesar pago real con Stripe/PayPal

        } else if (action === 'reject') {
            transaction.status = 'cancelled';
            transaction.metadata = { ...transaction.metadata, rejectionReason: notes };
        }

        await transaction.save();

        res.json({
            success: true,
            message: `Pago ${action === 'approve' ? 'aprobado' : 'rechazado'}`,
            transaction
        });

    } catch (error) {
        console.error('Error en processPayoutRequest:', error);
        res.status(500).json({ error: 'Error al procesar solicitud de pago' });
    }
};

module.exports = {
    getAffiliateStats,
    processPayoutRequest
};
