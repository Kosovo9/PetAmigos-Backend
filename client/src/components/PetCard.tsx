'use client';

import { Heart, MapPin, Share2, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';

interface PetCardProps {
    name: string;
    breed: string;
    age: number;
    location: string;
    image: string;
    isLiked: boolean;
    tags: string[];
    type: 'dog' | 'cat';
}

export function PetCard({ name, breed, age, location, image, isLiked, tags, type }: PetCardProps) {
    const [liked, setLiked] = useState(isLiked);
    const [hover, setHover] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            onHoverStart={() => setHover(true)}
            onHoverEnd={() => setHover(false)}
            className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20"
        >
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-700" />

            {/* Image Container */}
            <div className="relative h-72 overflow-hidden rounded-t-3xl">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Tags */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs font-semibold text-white tracking-wide shadow-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Like Button */}
                <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setLiked(!liked)}
                    className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full hover:bg-white/40 transition-colors shadow-sm"
                >
                    <Heart
                        className={`w-5 h-5 transition-all duration-300 ${liked ? 'fill-red-500 text-red-500 drop-shadow-glow' : 'text-white'
                            }`}
                    />
                </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 leading-tight">{name}</h3>
                        <p className="text-slate-500 font-medium text-sm">{breed}</p>
                    </div>
                    <div className="text-right bg-blue-50 px-3 py-1 rounded-lg">
                        <span className="text-2xl font-black text-blue-600">{age}</span>
                        <span className="text-xs text-blue-400 font-bold block -mt-1">AÑOS</span>
                    </div>
                </div>

                <div className="flex items-center text-slate-500 mb-6 bg-slate-50/50 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="text-sm font-medium">{location}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center group-hover:scale-[1.02]">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contactar
                    </button>
                    <button className="p-3.5 border-2 border-slate-100 rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-600">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Hover Indicator Line */}
            <motion.div
                className="absolute bottom-0 left-1/2 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0, x: "-50%", opacity: 0 }}
                animate={{ width: hover ? "80%" : "0%", x: "-50%", opacity: hover ? 1 : 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
            />
        </motion.div>
    );
}
