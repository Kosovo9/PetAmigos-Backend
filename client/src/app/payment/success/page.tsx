'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';

function PaymentSuccessContent() {
    const search = useSearchParams();
    const sessionId = search.get('session_id');
    const router = useRouter();
    const { token, refreshUser } = useAuth();

    useEffect(() => {
        if (sessionId && token) {
            // Refresh user data to show updated credits
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            fetch(`${apiUrl}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((r) => r.json())
                .then((data) => {
                    if (data.success) {
                        refreshUser(data.user);
                    }
                })
                .catch(console.error);

            // Redirect after a short delay
            setTimeout(() => {
                router.replace('/prompts');
            }, 3000);
        }
    }, [sessionId, token, router, refreshUser]);

    return (
        <div className="flex h-screen items-center justify-center bg-black text-white">
            <div className="text-center space-y-4">
                <div className="text-6xl">✅</div>
                <h1 className="text-3xl font-bold">Payment Successful!</h1>
                <p className="text-white/60">Thank you! Your credit has been added.</p>
                <p className="text-sm text-white/40">Redirecting back to the vault...</p>
            </div>
        </div>
    );
}

export default function PaymentSuccess() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
