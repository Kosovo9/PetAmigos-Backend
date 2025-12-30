import axios from 'axios';
import { Request, Response } from 'express';

export class PaymentGateway {
    private paypalClientId: string;
    private paypalClientSecret: string;
    private paypalApiUrl: string;

    constructor() {
        this.paypalClientId = process.env.PAYPAL_CLIENT_ID || '';
        this.paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
        this.paypalApiUrl = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
    }

    // Crear un pago con PayPal
    async createPayPalPayment(amount: number, currency: string, description: string): Promise<any> {
        const accessToken = await this.getPayPalAccessToken();

        const response = await axios.post(`${this.paypalApiUrl}/v2/checkout/orders`, {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: currency,
                    value: amount.toString()
                },
                description: description
            }]
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    }

    // Capturar un pago de PayPal
    async capturePayPalPayment(orderId: string): Promise<any> {
        const accessToken = await this.getPayPalAccessToken();

        const response = await axios.post(`${this.paypalApiUrl}/v2/checkout/orders/${orderId}/capture`, {}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    }

    // Obtener access token de PayPal
    private async getPayPalAccessToken(): Promise<string> {
        const credentials = Buffer.from(`${this.paypalClientId}:${this.paypalClientSecret}`).toString('base64');
        const response = await axios.post(`${this.paypalApiUrl}/v1/oauth2/token`, 'grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return response.data.access_token;
    }

    // MercadoPago integration
    async createMercadoPagoPayment(amount: number, description: string, payerEmail: string): Promise<any> {
        const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

        const response = await axios.post('https://api.mercadopago.com/v1/payments', {
            transaction_amount: amount,
            description: description,
            payment_method_id: 'pix', // Default to Pix or parameterize
            payer: {
                email: payerEmail
            }
        }, {
            headers: {
                'Authorization': `Bearer ${mpAccessToken}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    }
}
