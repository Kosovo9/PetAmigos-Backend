const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },

  // 🔥 SISTEMA DE CRÉDITOS
  credits: { type: Number, default: 5 }, // 5 fotos gratis al signup
  creditsUsed: { type: Number, default: 0 },

  // 💎 VIRAL LOOP
  referralCode: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(4).toString('hex').toUpperCase()
  },
  referredBy: { type: String },
  totalReferrals: { type: Number, default: 0 },

  // 🎁 REWARDS
  dailyLoginStreak: { type: Number, default: 0 },
  lastLoginDate: { type: Date },
  socialSharesCount: { type: Number, default: 0 },

  // 💳 SUBSCRIPTION
  isPremium: { type: Boolean, default: false },
  subscriptionTier: {
    type: String,
    enum: ['free', 'basic', 'pro'],
    default: 'free'
  },
  subscriptionExpiry: { type: Date },

  // 📊 ANALYTICS
  photosGenerated: { type: Number, default: 0 },
  lastPhotoGenerated: { type: Date },
  favoriteStyle: { type: String },

  // 💼 AFFILIATE SYSTEM (PLATINUM SUITE)
  affiliate: {
    isAffiliate: { type: Boolean, default: false },
    tier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze'
    },
    balance: { type: Number, default: 0.00 }, // Wallet actual
    lifetimeEarnings: { type: Number, default: 0.00 },
    payoutMethod: { type: String, enum: ['paypal', 'stripe', 'bank'], default: 'paypal' },
    payoutDetails: { type: Object }, // Email de PayPal o datos bancarios (encriptados idealmente)
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String }, // Para Google Authenticator
    settings: {
      emailNotifications: { type: Boolean, default: true },
      autoPayout: { type: Boolean, default: false },
      autoPayoutThreshold: { type: Number, default: 100 }
    }
  },

  // 🔔 NOTIFICACIONES
  pushSubscription: { type: Object }, // Objeto de suscripción VAPID

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 🎯 MÉTODOS DEL MODELO

// Verificar si tiene créditos
UserSchema.methods.hasCredits = function (amount = 1) {
  if (this.isPremium && this.subscriptionTier === 'pro') {
    return true; // Pro = ilimitado
  }
  return this.credits >= amount;
};

// Usar créditos
UserSchema.methods.useCredits = async function (amount = 1) {
  if (this.isPremium && this.subscriptionTier === 'pro') {
    this.photosGenerated += amount;
    await this.save();
    return true;
  }

  if (this.credits >= amount) {
    this.credits -= amount;
    this.creditsUsed += amount;
    this.photosGenerated += amount;
    this.lastPhotoGenerated = new Date();
    await this.save();
    return true;
  }

  return false;
};

// Agregar créditos
UserSchema.methods.addCredits = async function (amount, reason) {
  this.credits += amount;
  await this.save();

  // Log para analytics
  console.log(`✅ User ${this.email} received ${amount} credits. Reason: ${reason}`);

  return this.credits;
};

// Daily login reward
UserSchema.methods.claimDailyReward = async function () {
  const today = new Date().toDateString();
  const lastLogin = this.lastLoginDate ? this.lastLoginDate.toDateString() : null;

  if (today !== lastLogin) {
    this.dailyLoginStreak += 1;
    this.lastLoginDate = new Date();

    // 1 crédito por login diario
    await this.addCredits(1, 'Daily Login');

    // Bonus cada 7 días
    if (this.dailyLoginStreak % 7 === 0) {
      await this.addCredits(5, '7-Day Streak Bonus');
    }

    await this.save();
    return { credits: 1, bonus: this.dailyLoginStreak % 7 === 0 ? 5 : 0 };
  }

  return { credits: 0, message: 'Already claimed today' };
};

// Procesar referido
UserSchema.methods.processReferral = async function (newUserId) {
  this.totalReferrals += 1;

  // Recompensas por milestones
  let bonusCredits = 10; // Base: 10 créditos por referido

  if (this.totalReferrals === 10) {
    bonusCredits += 50; // Milestone: 10 referidos
  } else if (this.totalReferrals === 50) {
    bonusCredits += 300; // Milestone: 50 referidos
  } else if (this.totalReferrals === 100) {
    // LIFETIME FREE
    this.isPremium = true;
    this.subscriptionTier = 'pro';
    this.subscriptionExpiry = new Date('2099-12-31');
    bonusCredits += 1000;
  }

  await this.addCredits(bonusCredits, `Referral #${this.totalReferrals}`);
  await this.save();

  return {
    totalReferrals: this.totalReferrals,
    creditsEarned: bonusCredits,
    isLifetimeFree: this.totalReferrals >= 100
  };
};

// Social share reward
UserSchema.methods.rewardSocialShare = async function (platform) {
  this.socialSharesCount += 1;
  await this.addCredits(2, `Social Share on ${platform}`);
  await this.save();

  return { credits: 2, totalShares: this.socialSharesCount };
};

module.exports = mongoose.model('User', UserSchema);
