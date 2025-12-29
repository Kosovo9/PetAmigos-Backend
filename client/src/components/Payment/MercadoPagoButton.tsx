/**
 * Mercado Pago Payment Button Component
 */
'use client';

import React, { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { paymentConfig } from '@/lib/payments';
import axios from 'axios';

interface MercadoPagoButtonProps {
    amount: number;
    description: string;
    items?: Array<{
        title: string;
        quantity: number;
        unit_price: number;
    }>;
    onSuccess?: (paymentId: string) => void;
    onError?: (error: Error) => void;
    className?: string;
}

export function MercadoPagoButton({
    amount,
    description,
    items,
    onSuccess,
    onError,
    className = ''
}: MercadoPagoButtonProps) {
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize Mercado Pago SDK
    useEffect(() => {
        if (paymentConfig.mercadopago.publicKey) {
            initMercadoPago(paymentConfig.mercadopago.publicKey, {
                locale: 'es-MX'
            });
        }
    }, []);

    // Create payment preference
    const createPreference = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/payments/mercadopago/create', {
                items: items || [{
                    title: description,
                    quantity: 1,
                    unit_price: amount
                }],
                back_urls: {
                    success: `${window.location.origin}/payment/success`,
                    failure: `${window.location.origin}/payment/cancel`,
                    pending: `${window.location.origin}/payment/pending`
                }
            });

            setPreferenceId(response.data.id);
        } catch (err) {
            const error = err as Error;
            setError('Error al crear la preferencia de pago');
            onError?.(error);
            console.error('Mercado Pago error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!preferenceId) {
            createPreference();
        }
    }, []);

    if (error) {
        return (
            <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
                <p className="text-red-600 text-sm">{error}</p>
                <button
                    onClick={createPreference}
                    className="mt-2 text-sm text-red-700 underline hover:text-red-800"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    if (isLoading || !preferenceId) {
        return (
            <div className={`flex items-center justify-center p-6 ${className}`}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Cargando opciones de pago...</span>
            </div>
        );
    }

    return (
        <div className={className}>
            <Wallet
                initialization={{ preferenceId, redirectMode: 'modal' }}
                customization={{
                    visual: {
                        buttonBackground: 'blue',
                        borderRadius: '8px',
                        verticalPadding: '12px',
                        horizontalPadding: '24px'
                    },
                    texts: {
                        valueProp: 'security_safety'
                    }
                }}
                onReady={() => console.log('Mercado Pago ready')}
                onError={(error) => {
                    console.error('Mercado Pago Wallet error:', error);
                    onError?.(new Error('Payment initialization failed'));
                }}
            />
        </div>
    );
}

export default MercadoPagoButton;
