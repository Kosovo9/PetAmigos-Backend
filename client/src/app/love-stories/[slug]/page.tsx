'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Share2, Eye, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoveStoryDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [story, setStory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (slug) {
            fetchStory();
        }
    }, [slug]);

    const fetchStory = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/love-stories/${slug}`);
            const data = await response.json();
            setStory(data);
        } catch (error) {
            console.error('Error fetching story:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Debes iniciar sesión para dar like');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/love-stories/${story._id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            setLiked(data.liked);
            setStory({ ...story, likes: data.likes });
        } catch (error) {
            console.error('Error liking story:', error);
        }
    };

    const handleShare = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/love-stories/${story._id}/share`, {
                method: 'POST'
            });

            const shareUrl = window.location.href;
            navigator.clipboard.writeText(shareUrl);
            alert('¡Link copiado al portapapeles!');

            setStory({ ...story, shares: story.shares + 1 });
        } catch (error) {
            console.error('Error sharing story:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="animate-spin w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-xl">Cargando historia...</p>
                </div>
            </div>
        );
    }

    if (!story) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-4">Historia no encontrada</h1>
                    <Link href="/love-stories">
                        <button className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-600 transition-all">
                            Ver todas las historias
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Back Button */}
                <Link href="/love-stories">
                    <button className="flex items-center gap-2 text-white hover:text-pink-400 transition-colors mb-8">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold">Volver a historias</span>
                    </button>
                </Link>

                {/* Hero Image */}
                {story.photos && story.photos.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative h-96 rounded-3xl overflow-hidden mb-8 shadow-[0_0_50px_rgba(236,72,153,0.3)]"
                    >
                        <img
                            src={story.photos[0].url}
                            alt={story.petName}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        {/* Badges */}
                        <div className="absolute top-6 left-6 flex gap-3">
                            {story.isVerified && (
                                <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                    ✓ Verificada
                                </div>
                            )}
                            {story.featured && (
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                    ⭐ Destacada
                                </div>
                            )}
                        </div>

                        {/* Title Overlay */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">
                                {story.title}
                            </h1>
                            <p className="text-2xl text-pink-300 font-semibold">
                                {story.petSpecies === 'dog' ? '🐕' : story.petSpecies === 'cat' ? '🐈' : '🐾'} {story.petName}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Content Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 mb-8"
                >
                    {/* Author Info */}
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                        <img
                            src={story.userId?.profilePicture || '/default-avatar.png'}
                            alt={story.userId?.name}
                            className="w-16 h-16 rounded-full border-4 border-pink-400"
                        />
                        <div>
                            <p className="text-white font-bold text-lg">{story.userId?.name}</p>
                            <div className="flex items-center gap-4 text-gray-400 text-sm">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(story.adoptionDate).toLocaleDateString('es-MX', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                                {story.location?.city && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {story.location.city}, {story.location.country}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Story Content */}
                    <div className="prose prose-invert prose-lg max-w-none mb-8">
                        <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                            {story.story}
                        </p>
                    </div>

                    {/* Additional Photos */}
                    {story.photos && story.photos.length > 1 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {story.photos.slice(1).map((photo: any, index: number) => (
                                <div key={index} className="relative h-48 rounded-xl overflow-hidden">
                                    <img
                                        src={photo.url}
                                        alt={photo.caption || `Foto ${index + 2}`}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-8 border-t border-white/10">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all ${liked
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-white/10 text-pink-400 hover:bg-white/20'
                                }`}
                        >
                            <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
                            <span>{story.likes} Me gusta</span>
                        </button>

                        <button
                            onClick={handleShare}
                            className="flex items-center gap-3 px-6 py-3 rounded-full font-semibold bg-white/10 text-blue-400 hover:bg-white/20 transition-all"
                        >
                            <Share2 className="w-6 h-6" />
                            <span>{story.shares} Compartir</span>
                        </button>

                        <div className="flex items-center gap-3 text-gray-400">
                            <Eye className="w-6 h-6" />
                            <span className="font-semibold">{story.views} vistas</span>
                        </div>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center bg-gradient-to-r from-pink-900/50 to-rose-900/50 backdrop-blur-md rounded-3xl p-8 border border-pink-500/30"
                >
                    <h2 className="text-3xl font-bold text-white mb-4">
                        ¿Te inspiró esta historia?
                    </h2>
                    <p className="text-gray-300 mb-6">
                        Comparte tu propia experiencia de adopción y ayuda a otros a dar el paso.
                    </p>
                    <Link href="/love-stories/create">
                        <button className="bg-white text-pink-600 px-8 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-lg">
                            Compartir Mi Historia
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
