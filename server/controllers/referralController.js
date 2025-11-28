const User = require('../models/User');

// 🎁 PROCESAR REFERIDO
exports.processReferral = async (req, res) => {
    try {
        const { referralCode } = req.body;
        const newUserId = req.userId;

        // Buscar usuario que refirió
        const referrer = await User.findOne({ referralCode });

        if (!referrer) {
            return res.status(404).json({
                error: 'Código de referido inválido'
            });
        }

        // Verificar que el nuevo usuario no se auto-refiera
        if (referrer._id.toString() === newUserId) {
            return res.status(400).json({
                error: 'No puedes usar tu propio código de referido'
            });
        }

        // Procesar recompensa para el referidor
        const referrerReward = await referrer.processReferral(newUserId);

        // Dar bonus al nuevo usuario
        const newUser = await User.findById(newUserId);
        newUser.referredBy = referralCode;
        await newUser.addCredits(3, 'Signup with Referral Code');
        await newUser.save();

        res.status(200).json({
            success: true,
            message: '¡Código aplicado! Recibiste 3 créditos bonus',
            newUserCredits: newUser.credits,
            referrerReward: {
                totalReferrals: referrerReward.totalReferrals,
                creditsEarned: referrerReward.creditsEarned,
                isLifetimeFree: referrerReward.isLifetimeFree
            }
        });

    } catch (error) {
        console.error('Error en processReferral:', error);
        res.status(500).json({ error: 'Error al procesar referido' });
    }
};

// 📊 OBTENER DASHBOARD DE REFERIDOS
exports.getReferralDashboard = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Calcular próximo milestone
        let nextMilestone = 10;
        let nextReward = '50 créditos';

        if (user.totalReferrals >= 10 && user.totalReferrals < 50) {
            nextMilestone = 50;
            nextReward = '300 créditos';
        } else if (user.totalReferrals >= 50 && user.totalReferrals < 100) {
            nextMilestone = 100;
            nextReward = 'LIFETIME FREE (Premium de por vida)';
        } else if (user.totalReferrals >= 100) {
            nextMilestone = null;
            nextReward = '¡Ya desbloqueaste todo!';
        }

        res.status(200).json({
            success: true,
            data: {
                referralCode: user.referralCode,
                totalReferrals: user.totalReferrals,
                shareUrl: `https://www.petmatch.fun?ref=${user.referralCode}`,
                nextMilestone,
                nextReward,
                isLifetimeFree: user.totalReferrals >= 100,
                currentTier: user.subscriptionTier,
                credits: user.credits
            }
        });

    } catch (error) {
        console.error('Error en getReferralDashboard:', error);
        res.status(500).json({ error: 'Error al obtener dashboard' });
    }
};

// 🎯 DAILY LOGIN REWARD
exports.claimDailyReward = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const reward = await user.claimDailyReward();

        if (reward.credits === 0) {
            return res.status(200).json({
                success: false,
                message: 'Ya reclamaste tu recompensa diaria. Vuelve mañana!'
            });
        }

        res.status(200).json({
            success: true,
            message: `¡Recibiste ${reward.credits} crédito${reward.credits > 1 ? 's' : ''}!`,
            bonus: reward.bonus > 0 ? `🎉 Bonus de racha: +${reward.bonus} créditos` : null,
            totalCredits: user.credits,
            streak: user.dailyLoginStreak
        });

    } catch (error) {
        console.error('Error en claimDailyReward:', error);
        res.status(500).json({ error: 'Error al reclamar recompensa' });
    }
};

// 📱 SOCIAL SHARE REWARD
exports.rewardSocialShare = async (req, res) => {
    try {
        const { platform } = req.body; // 'facebook', 'instagram', 'tiktok', 'whatsapp'
        const userId = req.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const reward = await user.rewardSocialShare(platform);

        res.status(200).json({
            success: true,
            message: `¡Gracias por compartir en ${platform}! Recibiste ${reward.credits} créditos`,
            totalCredits: user.credits,
            totalShares: reward.totalShares
        });

    } catch (error) {
        console.error('Error en rewardSocialShare:', error);
        res.status(500).json({ error: 'Error al procesar recompensa' });
    }
};

// 💰 VERIFICAR CRÉDITOS
exports.checkCredits = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({
            success: true,
            credits: user.credits,
            creditsUsed: user.creditsUsed,
            photosGenerated: user.photosGenerated,
            isPremium: user.isPremium,
            tier: user.subscriptionTier,
            hasUnlimitedCredits: user.isPremium && user.subscriptionTier === 'pro'
        });

    } catch (error) {
        console.error('Error en checkCredits:', error);
        res.status(500).json({ error: 'Error al verificar créditos' });
    }
};
