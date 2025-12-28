import { useState } from 'react';
import { useAuth } from './useAuth';
import { config } from '../lib/config';

export const usePayment = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createCheckout = async (action: string) => {
        setLoading(true);
        setError(null);
        try {
            const apiUrl = config.apiUrl;
            const res = await fetch(`${apiUrl}/pay/create-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ action }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error initiating payment');
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                setError('No payment URL received');
            }
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Error al iniciar el pago');
        } finally {
            setLoading(false);
        }
    };

    return { createCheckout, loading, error };
};
