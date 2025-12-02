'use client';
import { useRouter } from 'next/navigation';

export default function PaymentCancel() {
    const router = useRouter();

    return (
        <div className="flex h-screen items-center justify-center bg-black text-white flex-col gap-6">
            <div className="text-6xl">❌</div>
            <h1 className="text-3xl font-bold">Payment Cancelled</h1>
            <p className="text-white/60">No worries, you haven't been charged.</p>
            <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
            >
                Go Back
            </button>
        </div>
    );
}
