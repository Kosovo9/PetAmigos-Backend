/**
 * PayPal Payment Button Component
 */
'use client';

import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { paymentConfig } from '@/lib/payments';

interface PayPalButtonProps {
    amount: number;
    description?: string;
    onSuccess?: (details: unknown) => void;
    onError?: (error: Error) => void;
    onCancel?: () => void;
    className?: string;
}

export function PayPalButton({
    amount,
    description,
    onSuccess,
    onError,
    onCancel,
    className = ''
}: PayPalButtonProps) {
    if (!paymentConfig.paypal.clientId) {
        return (
            <div className={`p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
                <p className="text-yellow-800 text-sm">
                    PayPal no está configurado. Por favor contacta al administrador.
                </p>
            </div>
        );
    }

    return (
        <div className={className}>
            <PayPalScriptProvider
                options={{
                    clientId: paymentConfig.paypal.clientId,
                    currency: paymentConfig.paypal.currency,
                    intent: paymentConfig.paypal.intent,
                    disableFunding: 'credit,card' // Optional: only show PayPal
                }}
            >
                <PayPalButtons
                    style={{
                        layout: 'vertical',
                        shape: 'rect',
                        label: 'paypal',
                        height: 48
                    }}
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            intent: 'CAPTURE',
                            purchase_units: [
                                {
                                    description: description || 'PetMatch Premium',
                                    amount: {
                                        currency_code: paymentConfig.paypal.currency,
                                        value: amount.toFixed(2)
                                    }
                                }
                            ],
                            application_context: {
                                shipping_preference: 'NO_SHIPPING'
                            }
                        });
                    }}
                    onApprove={async (data, actions) => {
                        try {
                            if (!actions.order) {
                                throw new Error('Order actions not available');
                            }

                            const details = await actions.order.capture();
                            console.log('Payment successful:', details);
                            onSuccess?.(details);
                        } catch (error) {
                            console.error('Payment capture error:', error);
                            onError?.(error as Error);
                        }
                    }}
                    onCancel={() => {
                        console.log('Payment cancelled by user');
                        onCancel?.();
                    }}
                    onError={(err) => {
                        console.error('PayPal error:', err);
                        onError?.(new Error('PayPal initialization failed'));
                    }}
                />
            </PayPalScriptProvider>
        </div>
    );
}

export default PayPalButton;
