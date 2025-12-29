import { useState } from 'react';

export function useVetConsultation() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);

    const consult = async (petId: string, symptoms: string) => {
        setLoading(true);
        setResponse(null);
        try {
            // Hardcoded userId for dev
            const userId = '1';
            const res = await fetch('/api/vet-ai/consult', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, petId, symptoms }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setResponse(data.aiResponse);
        } catch (error) {
            console.error('Consultation failed:', error);
            setResponse('Error: Could not reach the vet service. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return { consult, loading, response };
}
