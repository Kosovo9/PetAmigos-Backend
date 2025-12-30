import axios from 'axios';
import { Request, Response } from 'express';
// @ts-ignore
import { User } from '../../models/User';

export class CryptoHandler {
    private cryptoPaymentProcessorUrl: string;
    private apiKey: string;

    constructor() {
        this.cryptoPaymentProcessorUrl = process.env.CRYPTO_PAYMENT_PROCESSOR_URL || 'https://api.cryptopaymentprocessor.com';
        this.apiKey = process.env.CRYPTO_PAYMENT_PROCESSOR_API_KEY || '';
    }

    // Crear una factura de pago con criptomonedas
    async createCryptoInvoice(amount: number, currency: string, cryptoCurrency: string): Promise<any> {
        const response = await axios.post(`${this.cryptoPaymentProcessorUrl}/invoices`, {
            amount: amount,
            currency: currency,
            crypto_currency: cryptoCurrency
        }, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }

    // Webhook para recibir actualizaciones de pagos
    async handleCryptoWebhook(req: Request, res: Response): Promise<void> {
        const { status, user_id } = req.body;

        if (status === 'paid') {
            await User.findByIdAndUpdate(user_id, {
                $set: {
                    'subscription.status': 'active',
                    'subscription.startDate': new Date(),
                    'subscription.endDate': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 days
                }
            });
        }
        res.status(200).send('OK');
    }
}
