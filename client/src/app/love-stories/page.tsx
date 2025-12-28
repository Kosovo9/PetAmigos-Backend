'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, Filter } from 'lucide-react';
import LoveStoryCard from '@/components/LoveStoryCard';
import Link from 'next/link';
import { config } from '../../lib/config';

export default function LoveStoriesPage() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchStories();
    }, [filter, page]);

    const fetchStories = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '12'
            });

            if (filter !== 'all') {
                params.append('species', filter);
            }

            const response = await fetch(`${config.apiUrl}/love-stories?${params}`);
            const data = await response.json();

            setStories(data.stories || []);
        } catch (error) {
            console.error('Error fetching stories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (storyId: string) => {
        try {
            // Requiere autenticación
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Debes iniciar sesión para dar like');
                return;
            }

            await fetch(`${config.apiUrl}/love-stories/${storyId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Refrescar historias
            fetchStories();
        } catch (error) {
            console.error('Error liking story:', error);
        }
    };

    const handleShare = async (storyId: string) => {
        try {
            await fetch(`${config.apiUrl}/love-stories/${storyId}/share`, {
                method: 'POST'
            });

            // Copiar link al portapapeles
            const shareUrl = `${window.location.origin}/love-stories/${storyId}`;
            navigator.clipboard.writeText(shareUrl);
            alert('¡Link copiado al portapapeles!');
        } catch (error) {
            console.error('Error sharing story:', error);
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
                    <h1 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                        ❤️ Love Stories
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        Historias reales de adopción que cambiaron vidas. Comparte tu experiencia y inspira a otros.
                    </p>

                    <Link href="/love-stories/create">
                        <button className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-110 transition-all shadow-[0_0_30px_rgba(236,72,153,0.6)] flex items-center gap-3 mx-auto">
                            <Plus className="w-6 h-6" />
                            Compartir Mi Historia
                        </button>
                    </Link>
                </motion.div>

                {/* Filtros */}
                <div className="flex flex-wrap gap-4 justify-center mb-12">
                    {['all', 'dog', 'cat', 'bird', 'rabbit', 'other'].map((species) => (
                        <button
                            key={species}
                            onClick={() => setFilter(species)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all ${filter === species
                                ? 'bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.6)]'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                        >
                            {species === 'all' ? '🌟 Todas' :
                                species === 'dog' ? '🐕 Perros' :
                                    species === 'cat' ? '🐈 Gatos' :
                                        species === 'bird' ? '🦜 Aves' :
                                            species === 'rabbit' ? '🐰 Conejos' : '🐾 Otras'}
                        </button>
                    ))}
                </div>

                {/* Grid de Historias */}
                {loading ? (
                    <div className="text-center text-white text-2xl py-20">
                        <div className="animate-spin w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        Cargando historias...
                    </div>
                ) : stories.length === 0 ? (
                    <div className="text-center text-gray-400 text-xl py-20">
                        No hay historias aún. ¡Sé el primero en compartir!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stories.map((story: any) => (
                            <LoveStoryCard
                                key={story._id}
                                story={story}
                                onLike={handleLike}
                                onShare={handleShare}
                            />
                        ))}
                    </div>
                )}

                {/* Paginación */}
                {!loading && stories.length > 0 && (
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
                    className="mt-20 text-center bg-gradient-to-r from-pink-900/50 to-rose-900/50 backdrop-blur-md rounded-3xl p-12 border border-pink-500/30"
                >
                    <Heart className="w-16 h-16 text-pink-400 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-white mb-4">
                        ¿Adoptaste recientemente?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Comparte tu historia de amor y ayuda a otros a dar el paso. Cada historia inspira a más personas a adoptar.
                    </p>
                    <Link href="/love-stories/create">
                        <button className="bg-white text-pink-600 px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all shadow-lg">
                            Compartir Ahora
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
