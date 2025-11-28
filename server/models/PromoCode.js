const mongoose = require('mongoose');

const PromoCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },

    // Tipo de promoción
    type: {
        type: String,
        enum: ['discount', 'credits', 'free_premium'],
        required: true
    },

    // Valor del descuento
    discountPercent: { type: Number, min: 0, max: 100 },
    discountAmount: { type: Number, min: 0 },
    creditsBonus: { type: Number, min: 0 },
    premiumDays: { type: Number, min: 0 },

    // Límites de uso
    maxUses: { type: Number, default: null }, // null = ilimitado
    currentUses: { type: Number, default: 0 },
    maxUsesPerUser: { type: Number, default: 1 },

    // Validez
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date },
    isActive: { type: Boolean, default: true },

    // Afiliado (si aplica)
    affiliateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    affiliateCommission: { type: Number, default: 0 }, // Porcentaje

    // Analytics
    usedBy: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        usedAt: { type: Date, default: Date.now },
        revenue: { type: Number, default: 0 }
    }],

    totalRevenue: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Métodos
PromoCodeSchema.methods.canBeUsed = function (userId) {
    // Verificar si está activo
    if (!this.isActive) return { valid: false, reason: 'Código inactivo' };

    // Verificar fecha
    const now = new Date();
    if (this.validFrom && now < this.validFrom) {
        return { valid: false, reason: 'Código aún no válido' };
    }
    if (this.validUntil && now > this.validUntil) {
        return { valid: false, reason: 'Código expirado' };
    }

    // Verificar máximo de usos totales
    if (this.maxUses && this.currentUses >= this.maxUses) {
        return { valid: false, reason: 'Código agotado' };
    }

    // Verificar máximo de usos por usuario
    const userUses = this.usedBy.filter(u => u.userId.toString() === userId.toString()).length;
    if (userUses >= this.maxUsesPerUser) {
        return { valid: false, reason: 'Ya usaste este código' };
    }

    return { valid: true };
};

PromoCodeSchema.methods.apply = async function (userId, purchaseAmount = 0) {
    const check = this.canBeUsed(userId);
    if (!check.valid) {
        throw new Error(check.reason);
    }

    // Registrar uso
    this.usedBy.push({
        userId,
        usedAt: new Date(),
        revenue: purchaseAmount
    });
    this.currentUses += 1;
    this.totalRevenue += purchaseAmount;

    await this.save();

    // Calcular beneficio
    let benefit = {};

    if (this.type === 'discount') {
        if (this.discountPercent) {
            benefit.discount = purchaseAmount * (this.discountPercent / 100);
        } else if (this.discountAmount) {
            benefit.discount = this.discountAmount;
        }
    } else if (this.type === 'credits') {
        benefit.credits = this.creditsBonus;
    } else if (this.type === 'free_premium') {
        benefit.premiumDays = this.premiumDays;
    }

    return benefit;
};

module.exports = mongoose.model('PromoCode', PromoCodeSchema);
