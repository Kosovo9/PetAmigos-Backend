'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane, Search, Globe } from 'lucide-react';
import FlightPolicyCard from '@/components/FlightPolicyCard';
import Link from 'next/link';

export default function FlyPage() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [country, setCountry] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchPolicies();
    }, [search, country, page]);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20'
            });

            if (search) params.append('search', search);
            if (country) params.append('country', country);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fly?${params}`);
            const data = await response.json();

            setPolicies(data.data || []);
        } catch (error) {
            console.error('Error fetching policies:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                        ✈️ PetMatch Fly
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        Viaja por el mundo con tu mejor amigo. Encuentra las políticas de mascotas de todas las aerolíneas en un solo lugar.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Buscar aerolínea (ej. Delta, Lufthansa)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-4 px-8 pl-14 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    </div>
                </motion.div>

                {/* Filtros Rápidos (Países Populares) */}
                <div className="flex flex-wrap gap-4 justify-center mb-12">
                    {['USA', 'Canada', 'Mexico', 'Brazil', 'Spain', 'France', 'Germany', 'Japan'].map((c) => (
                        <button
                            key={c}
                            onClick={() => setCountry(country === c ? '' : c)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${country === c
                                ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)]'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                        >
                            <Globe className="w-4 h-4" />
                            {c}
                        </button>
                    ))}
                </div>

                {/* Grid de Políticas */}
                {loading ? (
                    <div className="text-center text-white text-2xl py-20">
                        <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        Buscando vuelos...
                    </div>
                ) : policies.length === 0 ? (
                    <div className="text-center text-gray-400 text-xl py-20">
                        No encontramos aerolíneas con esos criterios. Intenta otra búsqueda.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {policies.map((policy: any) => (
                            <FlightPolicyCard key={policy._id} policy={policy} />
                        ))}
                    </div>
                )}

                {/* Paginación */}
                {!loading && policies.length > 0 && (
                    <div className="flex justify-center gap-4 mt-12">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="bg-white/10 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            ← Anterior
                        </button>
                        <span className="text-white font-semibold flex items-center px-4">
                            Página {page}
                        </span>
                        <button
                            onClick={() => setPage(page + 1)}
                            className="bg-white/10 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/20 transition-all"
                        >
                            Siguiente →
                        </button>
                    </div>
                )}

                {/* CTA Final */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 text-center bg-gradient-to-r from-blue-900/50 to-indigo-900/50 backdrop-blur-md rounded-3xl p-12 border border-blue-500/30"
                >
                    <Plane className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-white mb-4">
                        ¿Falta alguna aerolínea?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Ayúdanos a mantener la base de datos más completa del mundo. Reporta cambios o sugiere nuevas aerolíneas.
                    </p>
                    <button className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-lg">
                        Contribuir Información
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
