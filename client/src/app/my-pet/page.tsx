'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DigitalTwinAvatar from '@/components/DigitalTwinAvatar';
import Link from 'next/link';

export default function MyPetPage() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPet, setSelectedPet] = useState<any>(null);

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Redirect to login or show message
                setLoading(false);
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pets/my-pets`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setPets(data);
                if (data.length > 0) setSelectedPet(data[0]);
            }
        } catch (error) {
            console.error('Error fetching pets:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (pets.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 text-center">
                <h1 className="text-4xl font-bold mb-4">¡Bienvenido a PetMatch!</h1>
                <p className="text-xl text-gray-400 mb-8">Para acceder a tu Gemelo Digital, primero necesitas registrar una mascota.</p>
                <Link href="/pets/create">
                    <button className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-bold transition-all">
                        Registrar Mascota
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20 px-4 bg-black">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Avatar & Interaction */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                            Digital Twin
                        </h1>
                        <p className="text-gray-400 mb-8">
                            Conectado en tiempo real con {selectedPet.name}.
                        </p>

                        {selectedPet && (
                            <DigitalTwinAvatar
                                petId={selectedPet._id}
                                petName={selectedPet.name}
                                species={selectedPet.species || 'dog'}
                            />
                        )}

                        {/* Pet Selector if multiple */}
                        {pets.length > 1 && (
                            <div className="flex gap-4 mt-8 overflow-x-auto pb-4">
                                {pets.map((pet: any) => (
                                    <button
                                        key={pet._id}
                                        onClick={() => setSelectedPet(pet)}
                                        className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${selectedPet._id === pet._id
                                                ? 'bg-purple-600/20 border-purple-500 text-white'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                                            {pet.photo ? (
                                                <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs">🐾</div>
                                            )}
                                        </div>
                                        <span className="font-semibold">{pet.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Right Column: Real World Stats & Insights */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Health Card */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                                Salud en Tiempo Real
                            </h2>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Edad Biológica</p>
                                    <p className="text-3xl font-bold text-white">
                                        {selectedPet.biologicalAge || 0} <span className="text-sm font-normal text-gray-500">años</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Health Score</p>
                                    <p className="text-3xl font-bold text-green-400">
                                        {selectedPet.healthScore || 100}<span className="text-sm text-gray-500">/100</span>
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                                <p className="text-green-300 text-sm">
                                    ✨ <strong>Insight IA:</strong> {selectedPet.name} está en excelente forma. Mantén su actividad actual para optimizar su longevidad.
                                </p>
                            </div>
                        </div>

                        {/* Smart Collar Sync */}
                        <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <svg className="w-32 h-32 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-4">Smart Collar</h2>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-blue-300 font-mono text-sm">CONECTADO • BATERÍA 85%</span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-black/30 rounded-xl p-3">
                                    <p className="text-2xl font-bold text-white">5,432</p>
                                    <p className="text-xs text-gray-400">Pasos Hoy</p>
                                </div>
                                <div className="bg-black/30 rounded-xl p-3">
                                    <p className="text-2xl font-bold text-white">3.2</p>
                                    <p className="text-xs text-gray-400">Km</p>
                                </div>
                                <div className="bg-black/30 rounded-xl p-3">
                                    <p className="text-2xl font-bold text-white">340</p>
                                    <p className="text-xs text-gray-400">Kcal</p>
                                </div>
                            </div>

                            <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">
                                Sincronizar Ahora (+50 XP)
                            </button>
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
}
