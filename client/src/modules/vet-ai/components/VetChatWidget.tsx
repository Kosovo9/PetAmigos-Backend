import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useVetConsultation } from '../hooks/useVetConsultation';
import { PetSelector } from './PetSelector';

export const VetChatWidget: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState<string>('');
    const [symptoms, setSymptoms] = useState('');
    const { consult, loading, response } = useVetConsultation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPet || !symptoms) return;
        await consult(selectedPet, symptoms);
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(!open)}
                className="fixed bottom-20 right-4 bg-green-500 text-white rounded-full p-4 shadow-lg z-50 flex items-center justify-center"
            >
                <span className="text-2xl">🏥</span>
            </motion.button>

            {open && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-32 right-4 w-96 max-w-[90vw] bg-white rounded-2xl shadow-2xl p-4 z-50 border border-gray-100"
                >
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="font-bold text-green-600">Veterinario AI 24/7</h3>
                        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mascota</label>
                            <PetSelector onChange={setSelectedPet} selectedPetId={selectedPet} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Síntomas</label>
                            <textarea
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                placeholder="Describe los síntomas de tu mascota..."
                                className="w-full p-3 border rounded-lg resize-none h-24 focus:ring-2 focus:ring-green-500 outline-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-500 text-white py-2 rounded-lg disabled:opacity-50 font-semibold hover:bg-green-600 transition-colors"
                        >
                            {loading ? 'Analizando...' : 'Consultar Veterinario'}
                        </button>
                    </form>

                    {response && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100 max-h-60 overflow-y-auto"
                        >
                            <div className="text-sm whitespace-pre-wrap text-gray-800 leading-relaxed">{response}</div>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </>
    );
};
