/**
 * PayPal Payment Routes
 */
import express from 'express';
import axios from 'axios';

const router = express.Router();

// PayPal API URLs
const PAYPAL_API_URL = process.env.NODE_ENV === 'production'
    ? 'https://api.paypal.com'
    : 'https://api.sandbox.paypal.com';

/**
 * Get PayPal access token
 */
const getPayPalAccessToken = async () => {
    const auth = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64');

    try {
        const response = await axios.post(
            `${PAYPAL_API_URL}/v1/oauth2/token`,
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error('PayPal Auth Error:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with PayPal');
    }
};

/**
 * Create PayPal order
 * POST /api/payments/paypal/create-order
 */
router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency = 'USD', description } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const accessToken = await getPayPalAccessToken();

        const response = await axios.post(
            `${PAYPAL_API_URL}/v2/checkout/orders`,
            {
                intent: 'CAPTURE',
                purchase_units: [{
                    description: description || 'PetMatch Premium Service',
                    amount: {
                        currency_code: currency,
                        value: parseFloat(amount).toFixed(2)
                    }
                }],
                application_context: {
                    brand_name: 'PetMatch',
                    landing_page: 'NO_PREFERENCE',
                    user_action: 'PAY_NOW',
                    return_url: `${process.env.FRONTEND_URL}/payment/success`,
                    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({
            id: response.data.id,
            status: response.data.status,
            links: response.data.links
        });
    } catch (error) {
        console.error('PayPal Create Order Error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to create PayPal order',
            details: error.response?.data || error.message
        });
    }
});

/**
 * Capture PayPal payment
 * POST /api/payments/paypal/capture-order/:orderId
 */
router.post('/capture-order/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        const accessToken = await getPayPalAccessToken();

        const response = await axios.post(
            `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const captureData = response.data;

        console.log('✅ PayPal Payment Captured:', {
            orderId: captureData.id,
            status: captureData.status,
            payer: captureData.payer?.email_address
        });

        res.json({
            id: captureData.id,
            status: captureData.status,
            payer: captureData.payer,
            purchase_units: captureData.purchase_units
        });
    } catch (error) {
        console.error('PayPal Capture Error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to capture PayPal payment',
            details: error.response?.data || error.message
        });
    }
});

/**
 * Get order details
 * GET /api/payments/paypal/order/:orderId
 */
router.get('/order/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const accessToken = await getPayPalAccessToken();

        const response = await axios.get(
            `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Get PayPal Order Error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to get order details'
        });
    }
});

/**
 * Webhook handler for PayPal IPN
 * POST /api/payments/paypal/webhook
 */
router.post('/webhook', async (req, res) => {
    try {
        const webhookEvent = req.body;

        console.log('PayPal Webhook Event:', {
            type: webhookEvent.event_type,
            resourceId: webhookEvent.resource?.id
        });

        // Verify webhook signature (recommended for production)
        // TODO: Implement webhook signature verification

        // Process based on event type
        switch (webhookEvent.event_type) {
            case 'PAYMENT.CAPTURE.COMPLETED':
                console.log('✅ Payment capture completed');
                // TODO: Update database, send confirmation email
                break;

            case 'PAYMENT.CAPTURE.DENIED':
                console.log('❌ Payment capture denied');
                // TODO: Handle denied payment
                break;

            case 'PAYMENT.CAPTURE.PENDING':
                console.log('⏳ Payment capture pending');
                // TODO: Handle pending payment
                break;

            default:
                console.log('⚠️  Unhandled webhook event:', webhookEvent.event_type);
        }

        res.status(200).send('Webhook processed');
    } catch (error) {
        console.error('PayPal Webhook Error:', error);
        res.status(200).send('Webhook processing failed');
    }
});

export default router;
