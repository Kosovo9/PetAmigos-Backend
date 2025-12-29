/**
 * Mercado Pago Payment Routes
 */
import express from 'express';
import mercadopago from 'mercadopago';

const router = express.Router();

// Configure Mercado Pago SDK
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN || '',
});

/**
 * Create payment preference
 * POST /api/payments/mercadopago/create
 */
router.post('/create', async (req, res) => {
    try {
        const { items, payer, back_urls, external_reference } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: 'Items are required and must be an array'
            });
        }

        const preference = {
            items: items.map(item => ({
                title: item.title || 'PetMatch Service',
                quantity: item.quantity || 1,
                currency_id: 'USD',
                unit_price: parseFloat(item.unit_price) || 0
            })),
            payer: payer || {},
            back_urls: {
                success: back_urls?.success || `${process.env.FRONTEND_URL}/payment/success`,
                failure: back_urls?.failure || `${process.env.FRONTEND_URL}/payment/cancel`,
                pending: back_urls?.pending || `${process.env.FRONTEND_URL}/payment/pending`
            },
            auto_return: 'approved',
            statement_descriptor: 'PETMATCH',
            external_reference: external_reference || req.user?.id || 'guest',
            notification_url: `${process.env.BACKEND_URL}/api/payments/mercadopago/webhook`,
            expires: false,
            payment_methods: {
                excluded_payment_types: [],
                installments: 1
            }
        };

        const response = await mercadopago.preferences.create(preference);

        res.json({
            id: response.body.id,
            init_point: response.body.init_point,
            sandbox_init_point: response.body.sandbox_init_point
        });
    } catch (error) {
        console.error('Mercado Pago Create Preference Error:', error);
        res.status(500).json({
            error: 'Failed to create payment preference',
            details: error.message
        });
    }
});

/**
 * Webhook handler for payment notifications
 * POST /api/payments/mercadopago/webhook
 */
router.post('/webhook', async (req, res) => {
    try {
        const { type, data } = req.body;

        console.log('Mercado Pago Webhook:', { type, data });

        if (type === 'payment') {
            const paymentId = data.id;

            // Get payment details
            const payment = await mercadopago.payment.findById(paymentId);
            const paymentData = payment.body;

            console.log('Payment Details:', {
                id: paymentData.id,
                status: paymentData.status,
                amount: paymentData.transaction_amount,
                external_reference: paymentData.external_reference
            });

            // Process based on payment status
            switch (paymentData.status) {
                case 'approved':
                    // Payment successful - update database, send confirmation email, etc.
                    console.log('✅ Payment approved:', paymentData.id);
                    // TODO: Add your business logic here
                    break;

                case 'pending':
                    console.log('⏳ Payment pending:', paymentData.id);
                    // TODO: Handle pending payment
                    break;

                case 'rejected':
                case 'cancelled':
                    console.log('❌ Payment rejected/cancelled:', paymentData.id);
                    // TODO: Handle failed payment
                    break;

                default:
                    console.log('⚠️  Unknown payment status:', paymentData.status);
            }
        }

        // Always respond 200 to acknowledge receipt
        res.status(200).send('OK');
    } catch (error) {
        console.error('Mercado Pago Webhook Error:', error);
        // Still respond 200 to avoid retries
        res.status(200).send('Webhook processing failed');
    }
});

/**
 * Get payment status
 * GET /api/payments/mercadopago/status/:paymentId
 */
router.get('/status/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await mercadopago.payment.findById(paymentId);

        res.json({
            id: payment.body.id,
            status: payment.body.status,
            status_detail: payment.body.status_detail,
            amount: payment.body.transaction_amount,
            currency: payment.body.currency_id,
            date_approved: payment.body.date_approved
        });
    } catch (error) {
        console.error('Get Payment Status Error:', error);
        res.status(500).json({
            error: 'Failed to get payment status'
        });
    }
});

export default router;
