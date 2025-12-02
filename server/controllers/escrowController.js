const AffiliateEscrow = require('../models/AffiliateEscrow');
const User = require('../models/User');

/**
 * 🏦 ESCROW CONTROLLER
 * Manages the "Virtual Vault" for affiliate commissions.
 */

// 1. Add Funds to Escrow (Called when a sale is made)
exports.addToEscrow = async (affiliateId, transactionId, commissionAmount, currency = 'USD') => {
    try {
        // Hold period (e.g., 30 days for refund buffer)
        const HOLD_DAYS = 30;
        const releaseDate = new Date();
        releaseDate.setDate(releaseDate.getDate() + HOLD_DAYS);

        // Calculate Tax/Fees (Example: 0% for now, configurable)
        const taxRate = 0;
        const taxWithheld = commissionAmount * taxRate;
        const net = commissionAmount - taxWithheld;

        const escrowEntry = await AffiliateEscrow.create({
            affiliateId,
            sourceTransactionId: transactionId,
            amount: {
                gross: commissionAmount,
                taxWithheld,
                net,
                currency
            },
            status: 'held',
            releaseDate
        });

        console.log(`💰 [ESCROW] Added $${net} for Affiliate ${affiliateId}. Releases: ${releaseDate.toISOString()}`);
        return escrowEntry;

    } catch (error) {
        console.error('❌ [ESCROW ERROR] Add failed:', error);
        throw error;
    }
};

// 2. Release Cleared Funds (Cron Job or Admin Trigger)
exports.releaseFunds = async (req, res) => {
    try {
        const now = new Date();

        // Find all 'held' funds that are past their release date
        const readyFunds = await AffiliateEscrow.find({
            status: 'held',
            releaseDate: { $lte: now }
        });

        let releasedCount = 0;
        let totalReleased = 0;

        for (const entry of readyFunds) {
            // Update status to cleared
            entry.status = 'cleared';
            await entry.save();

            // Update User's "Available Balance" (Wallet)
            await User.findByIdAndUpdate(entry.affiliateId, {
                $inc: { 'affiliate.walletBalance': entry.amount.net }
            });

            releasedCount++;
            totalReleased += entry.amount.net;
        }

        if (res) {
            res.json({
                success: true,
                message: `Released ${releasedCount} entries totaling $${totalReleased}`,
                releasedCount,
                totalReleased
            });
        }

        return { releasedCount, totalReleased };

    } catch (error) {
        console.error('❌ [ESCROW ERROR] Release failed:', error);
        if (res) res.status(500).json({ success: false, error: error.message });
    }
};

// 3. Get Escrow Balance (Held vs Cleared)
exports.getEscrowStats = async (req, res) => {
    try {
        const { userId } = req.params; // Or req.user.id

        const stats = await AffiliateEscrow.aggregate([
            { $match: { affiliateId: mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: '$status',
                    total: { $sum: '$amount.net' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
