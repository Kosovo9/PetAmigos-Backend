const PetProfile = require('../models/PetProfile');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// ============================================
// PAYMENT CONTROLLER - CASH HARVEST 10X
// Pasarela Global: Stripe, Mercado Pago, Lemon Squeezy, PayPal
// ============================================

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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
                paymentResult = await processLemonSqueezy(amount, currency, paymentMethod);
                break;
            case 'US':
            default:
                paymentResult = await processStripe(amount, currency, paymentMethod);
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
    // Por currency
    if (['ARS', 'BRL', 'MXN', 'CLP', 'COP'].includes(currency)) {
        return 'LATAM';
    }

    // Por IP (si está disponible)
    const country = req.headers['cf-ipcountry'] || req.headers['x-country-code'];
    if (['AR', 'BR', 'MX', 'CL', 'CO'].includes(country)) {
        return 'LATAM';
    }

    // Por defecto: Global (Lemon Squeezy) o US (Stripe)
    if (currency === 'USD' && !country) {
        return 'US';
    }

    return 'GLOBAL';
}

/**
 * Procesar pago con Stripe (US/Global)
 */
async function processStripe(amount, currency, paymentMethod) {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: currency.toLowerCase(),
                    product_data: {
                        name: "PetAmigos World - Lifetime Membership",
                        description: "Pasaporte de Longevidad - Acceso de por vida"
                    },
                    unit_amount: Math.round(amount * 100)
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`
        });

        return {
            success: true,
            transactionId: session.id,
            paymentUrl: session.url,
            processor: 'STRIPE'
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Procesar pago con Mercado Pago (LATAM)
 */
async function processMercadoPago(amount, currency, paymentMethod) {
    try {
        const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

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
 * Procesar pago con Lemon Squeezy (Global Compliance)
 */
async function processLemonSqueezy(amount, currency, paymentMethod) {
    try {
        const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
        const storeId = process.env.LEMON_SQUEEZY_STORE_ID;

        const response = await axios.post(`https://api.lemonsqueezy.com/v1/checkouts`, {
            data: {
                type: 'checkouts',
                attributes: {
                    custom_price: amount,
                    product_options: {
                        name: "PetAmigos World - Lifetime Membership",
                        description: "Pasaporte de Longevidad - Acceso de por vida"
                    },
                    checkout_options: {
                        embed: false,
                        media: false,
                        logo: true
                    },
                    checkout_data: {
                        custom: {
                            petId: paymentMethod.petId || null
                        }
                    },
                    preview: false,
                    test_mode: process.env.NODE_ENV !== 'production'
                },
                relationships: {
                    store: {
                        data: {
                            type: 'stores',
                            id: storeId
                        }
                    },
                    variant: {
                        data: {
                            type: 'variants',
                            id: paymentMethod.variantId || 'default'
                        }
                    }
                }
            }
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            }
        });

        return {
            success: true,
            transactionId: response.data.data.id,
            paymentUrl: response.data.data.attributes.url,
            processor: 'LEMON_SQUEEZY'
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.errors?.[0]?.detail || error.message
        };
    }
}

/**
 * Crear Checkout Session (Dinámico: $1 Test o Producción)
 */
exports.createCheckoutSession = async (req, res) => {
    try {
        const { action, priceId, type } = req.body; // type: 'credit', 'lifetime', 'pack'
        const userId = req.userId;

        // 🎛️ CONFIGURACIÓN DE LANZAMIENTO
        // Si LAUNCH_MODE es 'TEST_DOLLAR', forzamos todo a $1 USD
        const isTestMode = process.env.LAUNCH_MODE === 'TEST_DOLLAR';

        let finalPriceData = {};
        let metadata = {
            userId: userId,
            action: action || 'generation',
            type: type || 'ONE_DOLLAR_CREDIT'
        };

        if (isTestMode) {
            // 🧪 MODO PRUEBA: Todo cuesta $1
            finalPriceData = {
                currency: 'usd',
                product_data: {
                    name: `TEST MODE: ${type || 'Credit'}`,
                    description: 'Test Transaction ($1.00)'
                },
                unit_amount: 100 // $1.00 USD
            };
        } else {
            // 🚀 MODO PRODUCCIÓN (Precios Reales)
            if (type === 'lifetime') {
                finalPriceData = {
                    currency: 'usd',
                    product_data: { name: "PetMatch Founder Lifetime", description: "Acceso de por vida + Beneficios VIP" },
                    unit_amount: 9700 // $97.00 USD
                };
            } else if (type === 'pack_starter') {
                finalPriceData = {
                    currency: 'usd',
                    product_data: { name: "Starter Pack (50 Credits)", description: "Paquete de inicio" },
                    unit_amount: 1900 // $19.00 USD
                };
            } else {
                // Default Single Credit
                finalPriceData = {
                    currency: 'usd',
                    product_data: { name: "Single Credit", description: "1 Credit for Image Generation" },
                    unit_amount: 299 // $2.99 USD (Precio normal unitario)
                };
            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: finalPriceData,
                quantity: 1
            }],
            mode: 'payment',
            metadata: metadata,
            success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment/cancel`
        });

        // Registrar transacción pendiente
        await Transaction.create({
            user: userId,
            stripeSessionId: session.id,
            amount: finalPriceData.unit_amount / 100,
            status: 'pending',
            action: action || type || 'generation',
            isTestMode: isTestMode
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout:', error);
        res.status(500).json({ error: 'Error initiating payment' });
    }
};

/**
 * Webhook para procesar confirmaciones de pago
 */
exports.handlePaymentWebhook = async (req, res) => {
    try {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.warn(`⚠️ Webhook signature verification failed.`, err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            // Manejar pago de $1
            if (session.metadata.type === 'ONE_DOLLAR_CREDIT') {
                const txn = await Transaction.findOne({ stripeSessionId: session.id });
                if (txn) {
                    txn.status = 'paid';
                    await txn.save();

                    const user = await User.findById(txn.user);
                    if (user) {
                        await user.addCredits(1, `Payment $1 for ${txn.action}`);
                        console.log(`✅ Added 1 credit to user ${user.email}`);
                    }
                }
            }
            // Manejar Lifetime Membership (Legacy/Existing)
            else if (session.metadata.petId) {
                await activateLifetimeMembership(session.metadata.petId);
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error("Error en webhook:", error);
        res.status(400).json({ error: "Webhook processing failed" });
    }
};

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


