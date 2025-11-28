'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Share2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoveStoryCardProps {
    story: {
        _id: string;
        slug: string;
        title: string;
        petName: string;
        petSpecies: string;
        story: string;
        photos: { url: string; caption?: string }[];
        likes: number;
        shares: number;
        views: number;
        userId: {
            name: string;
            profilePicture?: string;
        };
        createdAt: string;
        isVerified: boolean;
        featured: boolean;
    };
    onLike?: (id: string) => void;
    onShare?: (id: string) => void;
}

export default function LoveStoryCard({ story, onLike, onShare }: LoveStoryCardProps) {
    const firstPhoto = story.photos[0]?.url || '/placeholder-pet.jpg';
    const excerpt = story.story.substring(0, 150) + '...';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="group relative"
        >
            <Link href={`/love-stories/${story.slug}`}>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-pink-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transform hover:-translate-y-2">
                    {/* Badge de Featured */}
                    {story.featured && (
                        <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            ⭐ Destacada
                        </div>
                    )}

                    {/* Badge de Verificado */}
                    {story.isVerified && (
                        <div className="absolute top-4 left-4 z-10 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            ✓ Verificada
                        </div>
                    )}

                    {/* Imagen */}
                    <div className="relative h-64 overflow-hidden">
                        <img
                            src={firstPhoto}
                            alt={story.petName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                        {/* Especie Badge */}
                        <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {story.petSpecies === 'dog' ? '🐕' : story.petSpecies === 'cat' ? '🐈' : '🐾'} {story.petName}
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-6">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                            {story.title}
                        </h3>

                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                            {excerpt}
                        </p>

                        {/* Autor */}
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={story.userId.profilePicture || '/default-avatar.png'}
                                alt={story.userId.name}
                                className="w-10 h-10 rounded-full border-2 border-pink-400"
                            />
                            <div>
                                <p className="text-white font-semibold text-sm">{story.userId.name}</p>
                                <p className="text-gray-400 text-xs">
                                    {new Date(story.createdAt).toLocaleDateString('es-MX', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onLike?.(story._id);
                                }}
                                className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
                            >
                                <Heart className="w-5 h-5" />
                                <span className="text-sm font-semibold">{story.likes}</span>
                            </button>

                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onShare?.(story._id);
                                }}
                                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                                <span className="text-sm font-semibold">{story.shares}</span>
                            </button>

                            <div className="flex items-center gap-2 text-gray-400">
                                <Eye className="w-5 h-5" />
                                <span className="text-sm font-semibold">{story.views}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
