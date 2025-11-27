const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const { processLifetimeMembership, handlePaymentWebhook } = require('../controllers/paymentController');



// 🔒 Rutas protegidas: requieren autenticación

// Endpoint principal para Pasaporte de Longevidad (Cash Harvest 10X)

router.post('/lifetime-membership', auth, processLifetimeMembership);



// Webhook para confirmaciones de pago (sin auth, verificado por firma)

router.post('/webhook', handlePaymentWebhook);



// Endpoint legacy de Stripe (mantener compatibilidad)

router.post('/create-checkout-session', auth, async (req, res) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    try {

        const { type } = req.body;

        let line_items = [];

        if (type === 'lifetime') {

            line_items.push({

                price_data: { currency: 'usd', product_data: { name: "Founder Lifetime" }, unit_amount: 9700 },

                quantity: 1,

            });

        }

        const session = await stripe.checkout.sessions.create({

            payment_method_types: ['card'], line_items, mode: 'payment',

            success_url: `${process.env.CLIENT_URL}/success`,

            cancel_url: `${process.env.CLIENT_URL}/cancel`,

        });

        res.json({ url: session.url });

    } catch (e) { res.status(500).json({ error: e.message }); }

});

module.exports = router;

