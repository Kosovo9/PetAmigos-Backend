const PetProfile = require('../models/PetProfile');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// ============================================
// PAYMENT CONTROLLER - OPEN SOURCE 10X
// 💳 Mercado Pago (LATAM) + PayPal (Global)
// 🚫 NO STRIPE - 100% Open Source Stack
// ============================================

const axios = require('axios');

/**
 * Procesar pago del Pasaporte de Longevidad (Lifetime Membership)
 * Detecta región y usa procesador correcto
 */
exports.processLifetimeMembership = async (req, res) => {
    try {
        const { petId, paymentMethod, amount = 97.00, currency = 'USD' } = req.body;
        const userId = req.userId;

        // 1. Validar que la mascota existe y pertenece al usuario
        const pet = await PetProfile.findOne({ _id: petId, owner: userId });
        if (!pet) {
            return res.status(404).json({ error: "Mascota no encontrada o no autorizada." });
        }

        // 2. Detectar región del usuario (por IP o currency)
        const region = detectRegion(currency, req);

        // 3. Procesar pago según región
        let paymentResult;
        switch (region) {
            case 'LATAM':
                paymentResult = await processMercadoPago(amount, currency, paymentMethod);
                break;
            case 'GLOBAL':
            case 'EU':
            case 'US':
            default:
                // Todo fuera de LATAM usa PayPal
                paymentResult = await processPayPal(amount, currency, paymentMethod);
                break;
        }

        if (!paymentResult.success) {
            return res.status(400).json({ error: paymentResult.error });
        }

        // 4. Actualizar perfil de mascota con membresía Lifetime
        pet.isLifetimeMember = true;
        pet.lastCheckup = new Date();
        await pet.save();

        // 5. Registrar transacción
        await Transaction.create({
            userId,
            type: 'SUBSCRIPTION',
            amount,
            currency,
            status: 'COMPLETED',
            metadata: {
                serviceType: 'LIFETIME_MEMBERSHIP',
                petId: pet._id,
                paymentProcessor: region,
                transactionId: paymentResult.transactionId
            },
            processedAt: new Date()
        });

        res.status(200).json({
            success: true,
            message: "Pasaporte de Longevidad activado exitosamente.",
            pet: {
                id: pet._id,
                name: pet.name,
                isLifetimeMember: true
            },
            transaction: paymentResult
        });

    } catch (error) {
        console.error("Error en processLifetimeMembership:", error);
        res.status(500).json({ error: "Error al procesar pago." });
    }
};

/**
 * Detectar región del usuario
 */
function detectRegion(currency, req) {
    // LATAM currencies → Mercado Pago
    if (['ARS', 'BRL', 'MXN', 'CLP', 'COP', 'PEN', 'UYU'].includes(currency)) {
        return 'LATAM';
    }

    // LATAM countries by IP → Mercado Pago
    const country = req.headers['cf-ipcountry'] || req.headers['x-country-code'];
    if (['AR', 'BR', 'MX', 'CL', 'CO', 'PE', 'UY'].includes(country)) {
        return 'LATAM';
    }

    // Todo lo demás → PayPal (USD, EUR, GBP, etc.)
    return 'GLOBAL';
}

// Stripe function removed - using only Mercado Pago and PayPal

/**
 * Procesar pago con Mercado Pago (LATAM)
 */
async function processMercadoPago(amount, currency, paymentMethod) {
    try {
        const accessToken = process.env.MP_ACCESS_TOKEN;

        const response = await axios.post('https://api.mercadopago.com/checkout/preferences', {
            items: [{
                title: "PetAmigos World - Lifetime Membership",
                quantity: 1,
                unit_price: amount,
                currency_id: currency
            }],
            back_urls: {
                success: `${process.env.CLIENT_URL}/success`,
                failure: `${process.env.CLIENT_URL}/cancel`,
                pending: `${process.env.CLIENT_URL}/pending`
            },
            auto_return: "approved"
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return {
            success: true,
            transactionId: response.data.id,
            paymentUrl: response.data.init_point,
            processor: 'MERCADOPAGO'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
}

/**
 * Procesar pago con PayPal (EU/Alternative)
 */
async function processPayPal(amount, currency, paymentMethod) {
    try {
        const clientId = process.env.PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_SECRET;
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        // Use production or sandbox based on NODE_ENV
        const paypalURL = process.env.NODE_ENV === 'production'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';

        // 1. Get Access Token
        const tokenResponse = await axios.post(`${paypalURL}/v1/oauth2/token`, 'grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const accessToken = tokenResponse.data.access_token;

        // 2. Create Order
        const orderResponse = await axios.post(`${paypalURL}/v2/checkout/orders`, {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: currency,
                    value: amount.toString()
                },
                description: "PetAmigos World - Lifetime Membership"
            }],
            application_context: {
                return_url: `${process.env.CLIENT_URL}/success`,
                cancel_url: `${process.env.CLIENT_URL}/cancel`
            }
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const approveLink = orderResponse.data.links.find(link => link.rel === 'approve');

        return {
            success: true,
            transactionId: orderResponse.data.id,
            paymentUrl: approveLink.href,
            processor: 'PAYPAL'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message
        };
    }
}

// Lemon Squeezy removed - using only Mercado Pago and PayPal

/**
 * Crear Checkout Session - Mercado Pago o PayPal según región
 */
exports.createCheckoutSession = async (req, res) => {
    try {
        const { action, type, currency = 'USD', region } = req.body;
        const userId = req.userId;

        // Determinar monto según tipo
        let amount = 2.99; // Default: Single Credit
        let description = '1 Credit for PetMatch';

        if (type === 'lifetime') {
            amount = 97.00;
            description = 'PetMatch Founder Lifetime - Acceso de por vida';
        } else if (type === 'pack_starter') {
            amount = 19.00;
            description = 'Starter Pack (50 Credits)';
        }

        // Detectar región
        const detectedRegion = region || detectRegion(currency, req);

        let paymentResult;

        if (detectedRegion === 'LATAM') {
            // Usar Mercado Pago
            paymentResult = await processMercadoPago(amount, currency, { description });
        } else {
            // Usar PayPal
            paymentResult = await processPayPal(amount, currency, { description });
        }

        if (!paymentResult.success) {
            return res.status(400).json({ error: paymentResult.error });
        }

        // Registrar transacción pendiente
        await Transaction.create({
            user: userId,
            paymentId: paymentResult.transactionId,
            processor: paymentResult.processor,
            amount,
            currency,
            status: 'pending',
            action: action || type || 'generation',
            metadata: { type, description }
        });

        res.json({
            url: paymentResult.paymentUrl,
            processor: paymentResult.processor
        });
    } catch (error) {
        console.error('Error creating checkout:', error);
        res.status(500).json({ error: 'Error initiating payment' });
    }
};

/**
 * Webhook handler removed - using dedicated routes in /routes/payments/
 * See: server/routes/payments/mercadopago.js and server/routes/payments/paypal.js
 */

/**
 * Activar membresía Lifetime después de pago confirmado
 */
async function activateLifetimeMembership(petId) {
    const pet = await PetProfile.findById(petId);
    if (pet) {
        pet.isLifetimeMember = true;
        pet.lastCheckup = new Date();
        await pet.save();

        // 🚀 PROCESAR COMISIÓN DE AFILIADO (ESCROW VAULT)
        await processAffiliateCommission(pet.owner, 97.00, 'LIFETIME_MEMBERSHIP');
    }
}

/**
 * Procesar comisión de afiliado y enviarla al Escrow Vault
 */
async function processAffiliateCommission(userId, amount, type) {
    try {
        const user = await User.findById(userId);
        if (!user || !user.referredBy) return;

        // Buscar al afiliado por código de referido
        const affiliate = await User.findOne({ referralCode: user.referredBy });
        if (!affiliate) return;

        // Calcular comisión (30% estándar)
        const COMMISSION_RATE = 0.30;
        const commissionAmount = amount * COMMISSION_RATE;

        // Importar controlador de Escrow dinámicamente para evitar ciclos
        const escrowController = require('./escrowController');

        // Generar ID de transacción interno si no hay uno externo disponible aquí
        const txId = `COMM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // 🏦 AGREGAR AL VAULT (No toca cuentas operativas)
        await escrowController.addToEscrow(
            affiliate._id,
            txId,
            commissionAmount,
            'USD'
        );

        console.log(`✅ Affiliate Commission Processed: $${commissionAmount} for ${affiliate.email}`);

        // Actualizar estadísticas del afiliado
        affiliate.affiliate.lifetimeEarnings += commissionAmount;
        if (!affiliate.affiliate.isAffiliate) {
            affiliate.affiliate.isAffiliate = true; // Auto-convertir a afiliado
        }
        await affiliate.save();

    } catch (error) {
        console.error('❌ Error processing affiliate commission:', error);
    }
}


