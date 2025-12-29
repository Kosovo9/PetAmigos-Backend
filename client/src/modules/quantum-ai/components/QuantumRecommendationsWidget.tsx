
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, Zap, Brain, Sparkles } from 'lucide-react';
import { useQuantumRecommendations } from '../hooks/useQuantumRecommendations';

export const QuantumRecommendationsWidget: React.FC = () => {
    const { recommendations, loading, quantumState } = useQuantumRecommendations();
    const [showQuantumExplanation, setShowQuantumExplanation] = useState(false);
    const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);

    const executeQuantumRecommendation = (rec: any) => {
        console.log('Executing recommendation:', rec);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                >
                    <Atom className="w-8 h-8 text-white" />
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 rounded-3xl p-8 text-white relative overflow-hidden"
        >
            {/* Quantum particles animation */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full"
                        initial={{
                            x: Math.random() * 100 + '%',
                            y: Math.random() * 100 + '%',
                        }}
                        animate={{
                            x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                            y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <div className="relative z-10 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        >
                            <Atom className="w-8 h-8" />
                        </motion.div>
                        <h2 className="text-2xl font-bold">Quantum AI Recommends</h2>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowQuantumExplanation(!showQuantumExplanation)}
                        className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                        <Brain className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Quantum State Info */}
                {quantumState && (
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-white/80">Estado Cuántico</span>
                            <span className="text-sm text-green-400">● Activo</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{Math.round(quantumState.coherence * 100)}%</p>
                                <p className="text-xs text-white/70">Coherencia</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">{quantumState.entanglement_count}</p>
                                <p className="text-xs text-white/70">Entrelazados</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold">{Math.round(quantumState.amplitude * 100)}%</p>
                                <p className="text-xs text-white/70">Amplitud</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quantum Explanation */}
            <AnimatePresence>
                {showQuantumExplanation && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative z-10 mb-6 p-4 bg-white/10 backdrop-blur rounded-xl"
                    >
                        <h3 className="font-bold mb-2">¿Cómo funciona?</h3>
                        <p className="text-sm text-white/80">
                            Utilizamos algoritmos cuánticos simulados que analizan tu estado de superposición,
                            entrelazan con usuarios similares y colapsan a las mejores recomendaciones con
                            máxima probabilidad cuántica.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Recommendations */}
            <div className="relative z-10 space-y-4">
                {recommendations.map((rec, index) => (
                    <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="bg-white/10 backdrop-blur rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-all"
                        onClick={() => setSelectedRecommendation(rec)}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-400" />
                                <span className="font-medium">{rec.type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-green-400">
                                    {Math.round(rec.quantum_confidence * 100)}%
                                </span>
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        <p className="text-sm text-white/90 mb-2">{rec.content.title}</p>
                        <p className="text-xs text-white/70">{rec.content.description}</p>

                        {/* Quantum properties visualization */}
                        <div className="mt-3 flex items-center gap-4 text-xs text-white/60">
                            <span>Amplitude: {rec.quantum_properties.amplitude.toFixed(2)}</span>
                            <span>Coherence: {rec.quantum_properties.coherence.toFixed(2)}</span>
                            <span>Entanglement: {rec.quantum_properties.entanglement_strength.toFixed(2)}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Selected Recommendation Detail */}
            <AnimatePresence>
                {selectedRecommendation && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative z-10 mt-6 p-4 bg-white/20 backdrop-blur rounded-xl"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold">{selectedRecommendation.content.title}</h3>
                            <button
                                onClick={() => setSelectedRecommendation(null)}
                                className="text-white/60 hover:text-white"
                            >
                                ×
                            </button>
                        </div>

                        <p className="text-sm text-white/90 mb-4">
                            {selectedRecommendation.content.description}
                        </p>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm text-white/80">
                                    Quantum Confidence: {Math.round(selectedRecommendation.quantum_confidence * 100)}%
                                </span>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                onClick={() => {
                                    // Execute recommendation
                                    executeQuantumRecommendation(selectedRecommendation);
                                }}
                            >
                                Aplicar Recomendación
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quantum Call to Action */}
            <motion.div
                className="relative z-10 mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <p className="text-sm text-white/60 mb-4">
                    Powered by Quantum AI • Entrelazado con {quantumState?.entanglement_count || 0} usuarios
                </p>
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full"
                >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Estado Cuántico Activo</span>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};
