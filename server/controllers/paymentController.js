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
 * Webhook para procesar confirmaciones de pago
 */
exports.handlePaymentWebhook = async (req, res) => {
    try {
        const { processor, event, data } = req.body;

        if (processor === 'STRIPE') {
            // Verificar firma de Stripe
            const sig = req.headers['stripe-signature'];
            const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
            
            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;
                await activateLifetimeMembership(session.metadata.petId);
            }
        } else if (processor === 'MERCADOPAGO') {
            if (data.status === 'approved') {
                await activateLifetimeMembership(data.metadata.petId);
            }
        } else if (processor === 'LEMON_SQUEEZY') {
            if (event === 'order_created' || event === 'subscription_created') {
                await activateLifetimeMembership(data.custom.petId);
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
    }
}


