import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Info, MapPin, Star, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

/**
 * PetDiscovery Page - 1000X AI Matching Experience
 * Connects to the High-Performance Breed Compatibility Engine
 */
export default function PetDiscovery() {
    const { user } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Initial query to get user's first pet (for discovery context)
    // In a real app, we might have a pet selector
    const petsQuery = trpc.users.getProfile.useQuery({ userId: user?.id }, { enabled: !!user });

    // We assume the first pet for this demo
    const myPetId = 1; // Falling back to ID 1 for demonstration if profile is incomplete

    const discoveryQuery = trpc.matches.getDiscoveryFeed.useQuery(
        { petId: myPetId, limit: 10 },
        {
            enabled: !!user,
            staleTime: 1000 * 60 * 5 // 5 minutes cache
        }
    );

    const matches = discoveryQuery.data || [];
    const currentMatch = matches[currentIndex % matches.length];

    const handleAction = (type: 'like' | 'dislike') => {
        if (!currentMatch) return;
        console.log(`Action: ${type} on pet ${currentMatch.pet.name}`);
        setCurrentIndex(prev => prev + 1);
    };

    if (discoveryQuery.isLoading) {
        return (
            <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                <p className="text-neutral-400 font-medium">AI Matching Engine is analyzing potential companions...</p>
            </div>
        );
    }

    if (!currentMatch) {
        return (
            <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-6 text-center">
                <Sparkles className="w-16 h-16 text-orange-500 mb-6 opacity-20" />
                <h2 className="text-2xl font-bold text-white mb-2">No More Potential Matches</h2>
                <p className="text-neutral-400 max-w-xs mx-auto">
                    Try expanding your search radius or check back later!
                </p>
                <Button className="mt-8 bg-orange-500 hover:bg-orange-600" onClick={() => discoveryQuery.refetch()}>
                    Refresh Discovery
                </Button>
            </div>
        );
    }

    const { pet, score, confidence, reasons, distance } = currentMatch;

    return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4 overflow-hidden">
            <div className="w-full max-w-md relative h-[650px]">
                <header className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent rounded-t-3xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg transform -rotate-6">
                            <Heart className="w-6 h-6 fill-white text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight leading-none">PetMatch</h1>
                            <span className="text-[10px] uppercase tracking-widest text-orange-500 font-bold">Global AI v2</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                            <Info className="w-6 h-6" />
                        </Button>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={pet.id}
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 1.05, opacity: 0, x: 200 }} // Simplified exit
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute inset-0"
                    >
                        <Card className="h-full border-none rounded-[40px] overflow-hidden shadow-2xl shadow-orange-500/10 bg-neutral-800">
                            <div
                                className="h-full w-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
                                style={{
                                    backgroundImage: `url(${pet.avatarUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop'})`
                                }}
                            >
                                <div className="h-full w-full bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8">
                                    <div className="flex justify-between items-end mb-4">
                                        <div className="flex-1 mr-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h2 className="text-4xl font-black">{pet.name}</h2>
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-glow" title="Online now" />
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-neutral-300 font-medium">
                                                <MapPin className="w-4 h-4 text-orange-500" />
                                                {distance ? `${distance.toFixed(1)} km away` : 'Nearby'} • {pet.breed}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center mb-1">
                                                <span className="text-lg font-black text-orange-500 leading-none">{score}%</span>
                                            </div>
                                            <span className="text-[10px] uppercase font-bold text-white/60">Match</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {reasons.slice(0, 2).map((reason, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-xs font-semibold flex items-center gap-1.5">
                                                <Sparkles className="w-3 h-3 text-orange-400" />
                                                {reason}
                                            </span>
                                        ))}
                                        {confidence < 100 && (
                                            <span className="px-3 py-1 bg-blue-500/20 backdrop-blur-sm border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-400 uppercase">
                                                Low Data Confidence
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-neutral-200 text-lg leading-snug line-clamp-3 mb-12 italic">
                                        "{pet.bio || `I'm a happy ${pet.breed} looking for new friends to play with!`}"
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </AnimatePresence>

                <div className="absolute -bottom-10 left-0 right-0 flex justify-center items-center gap-8 z-30">
                    <motion.div whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.1 }}>
                        <Button
                            onClick={() => handleAction('dislike')}
                            className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-xl hover:bg-red-500/20 border border-white/10 text-neutral-300 transition-all duration-300"
                            size="icon"
                        >
                            <X className="w-8 h-8" />
                        </Button>
                    </motion.div>

                    <motion.div whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.1 }}>
                        <Button
                            onClick={() => handleAction('like')}
                            className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-[0_0_30px_rgba(249,115,22,0.4)] text-white"
                            size="icon"
                        >
                            <Heart className="w-10 h-10 fill-white" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// Add CSS to index.css for glow effect
// .shadow-glow { box-shadow: 0 0 10px rgba(34, 197, 94, 0.8); }
