/**
 * Payment Configuration - Mercado Pago & PayPal
 * Open Source, Zero Stripe Dependencies
 */

export const paymentConfig = {
    mercadopago: {
        publicKey: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '',
        sandbox: process.env.NODE_ENV !== 'production',
        endpoints: {
            createPreference: '/api/payments/mercadopago/create',
            webhook: '/api/payments/mercadopago/webhook'
        },
        currency: 'USD',
        locale: 'es-MX'
    },
    paypal: {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
        sandbox: process.env.NODE_ENV !== 'production',
        currency: 'USD',
        intent: 'capture' as const,
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
    }
} as const;

export type PaymentProvider = 'mercadopago' | 'paypal';

export interface PaymentItem {
    title: string;
    quantity: number;
    unit_price: number;
    description?: string;
}

export interface PaymentConfig {
    amount: number;
    currency?: string;
    description?: string;
    items?: PaymentItem[];
    metadata?: Record<string, unknown>;
}

export const getPaymentProviderConfig = (provider: PaymentProvider) => {
    return paymentConfig[provider];
};

export const isPaymentConfigured = (provider: PaymentProvider): boolean => {
    if (provider === 'mercadopago') {
        return !!paymentConfig.mercadopago.publicKey;
    }
    if (provider === 'paypal') {
        return !!paymentConfig.paypal.clientId;
    }
    return false;
};
