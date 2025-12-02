import { useState } from 'react';
import { useAuth } from './useAuth';

export const usePayment = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createCheckout = async (action: string) => {
        setLoading(true);
        setError(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/pay/create-checkout`, {
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
