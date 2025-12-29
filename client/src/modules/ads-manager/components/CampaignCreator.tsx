
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, DollarSign, Calendar, Users } from 'lucide-react';
import { useCampaignCreator } from '../hooks/useCampaignCreator';

interface Props {
    onClose: () => void;
}

export const CampaignCreator: React.FC<Props> = ({ onClose }) => {
    const { createCampaign, loading } = useCampaignCreator();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        objective: 'traffic',
        budget: 100,
        budgetType: 'daily',
        audience: {
            age: [18, 65],
            gender: 'all',
            interests: [],
            locations: [],
        },
        schedule: {
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        creative: {
            type: 'image',
            headline: '',
            description: '',
            callToAction: 'learn_more',
            media: [],
        },
    });

    const steps = [
        { number: 1, title: 'Objetivo' },
        { number: 2, title: 'Audiencia' },
        { number: 3, title: 'Presupuesto' },
        { number: 4, title: 'Creativo' },
    ];

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        await createCampaign(formData);
        onClose();
    };

    const ObjectiveStep = ({ formData, setFormData }: any) => <div>Objective Step (Mock)</div>;
    const AudienceStep = ({ formData, setFormData }: any) => <div>Audience Step (Mock)</div>;
    const BudgetStep = ({ formData, setFormData }: any) => <div>Budget Step (Mock)</div>;
    const CreativeStep = ({ formData, setFormData }: any) => <div>Creative Step (Mock)</div>;


    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-screen overflow-y-auto"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Crear Campaña PetAds</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex justify-between mb-8">
                        {steps.map((s, i) => (
                            <div
                                key={s.number}
                                className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                    ${step >= s.number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                                >
                                    {s.number}
                                </div>
                                <span className={`ml-2 text-sm ${step >= s.number ? 'text-blue-500' : 'text-gray-400'}`}>
                                    {s.title}
                                </span>
                                {i < steps.length - 1 && (
                                    <div className={`flex-1 h-1 mx-4 rounded ${step > s.number ? 'bg-blue-500' : 'bg-gray-200'}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="mb-8">
                        {step === 1 && <ObjectiveStep formData={formData} setFormData={setFormData} />}
                        {step === 2 && <AudienceStep formData={formData} setFormData={setFormData} />}
                        {step === 3 && <BudgetStep formData={formData} setFormData={setFormData} />}
                        {step === 4 && <CreativeStep formData={formData} setFormData={setFormData} />}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between">
                        <button
                            onClick={handleBack}
                            disabled={step === 1}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            Anterior
                        </button>

                        {step < 4 ? (
                            <button
                                onClick={handleNext}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Siguiente
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                            >
                                {loading ? 'Creando...' : 'Crear Campaña'}
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
