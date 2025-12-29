
// Mock hooks for Quantum Recommendations
export const useQuantumRecommendations = () => ({
    recommendations: [
        { id: '1', type: 'Product', content: { title: 'Quantum Treat', description: 'Optimized for your pet' }, quantum_confidence: 0.98, quantum_properties: { amplitude: 0.9, coherence: 0.95, entanglement_strength: 0.8 } },
        { id: '2', type: 'Service', content: { title: 'Premium Grooming', description: 'Based on shedding cycle' }, quantum_confidence: 0.92, quantum_properties: { amplitude: 0.85, coherence: 0.9, entanglement_strength: 0.75 } }
    ],
    loading: false,
    quantumState: { coherence: 0.95, entanglement_count: 1240, amplitude: 0.88 }
});
