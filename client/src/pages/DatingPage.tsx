import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import { trpc } from '@/lib/trpc';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Info, Heart, X, Sparkles } from 'lucide-react';
import SuperLikeButton from '../modules/dating/components/SuperLikeButton';
import { toast } from 'sonner';

const DatingPage = () => {
    const { data: queue, isLoading } = trpc.dating.getQueue.useQuery();
    const swipeMutation = trpc.dating.swipe.useMutation();
    const [lastDirection, setLastDirection] = useState<string>();

    const onSwiped = (direction: string, targetUserId: number) => {
        setLastDirection(direction);
        const liked = direction === 'right';
        swipeMutation.mutate({ toUserId: targetUserId, liked });

        if (liked) {
            toast("Sending love...", { icon: "❤️" });
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-slate-400 animate-pulse tracking-widest uppercase text-xs">Calibrating Matches...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 overflow-hidden flex flex-col items-center">
            <div className="text-center mb-8 space-y-1">
                <h1 className="text-3xl font-black italic tracking-tighter text-rose-500">PET DISCOVERY</h1>
                <p className="text-slate-400 text-sm">Find the perfect companion for your pet.</p>
            </div>

            <div className="relative w-full max-w-sm h-[600px]">
                {queue?.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <MapPin className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">No new pets nearby</h3>
                        <p className="text-slate-500 text-sm mt-2">Try expanding your search radius or come back later for new arrivals.</p>
                    </div>
                ) : (
                    queue?.map((profile: any, index: number) => (
                        <TinderCard
                            className="absolute inset-0"
                            key={profile.userId}
                            onSwipe={(dir) => onSwiped(dir, profile.userId)}
                            preventSwipe={['up', 'down']}
                        >
                            <Card className="h-full rounded-3xl overflow-hidden border-none shadow-2xl relative group cursor-grab active:cursor-grabbing">
                                <img
                                    src={profile.pics?.[0] || 'https://placedog.net/600/800'}
                                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                    alt={profile.breed}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                                <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4 pointer-events-none">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-3xl font-black text-white">{profile.breed}</h2>
                                            <Badge className="bg-white/20 backdrop-blur-md text-white border-none">{profile.age}y</Badge>
                                        </div>
                                        <div className="flex items-center gap-1 text-white/70 text-sm">
                                            <MapPin className="w-4 h-4" />
                                            <span>2.4 km away</span>
                                        </div>
                                    </div>

                                    <p className="text-white/80 text-sm line-clamp-2 italic">"{profile.bio || "Just looking for a playdate and maybe more!"}"</p>

                                    <div className="flex gap-2 pt-2">
                                        <Badge variant="outline" className="text-white border-white/30 bg-white/5">Friendly</Badge>
                                        <Badge variant="outline" className="text-white border-white/30 bg-white/5">Active</Badge>
                                    </div>
                                </div>

                                {/* Like/Nope Overlays */}
                                <div className="absolute top-10 left-10 border-4 border-emerald-500 text-emerald-500 font-black text-4xl px-4 py-2 rounded-xl rotate-[-15deg] opacity-0 group-hover:group-active:opacity-100 transition-opacity">LIKE</div>
                                <div className="absolute top-10 right-10 border-4 border-rose-500 text-rose-500 font-black text-4xl px-4 py-2 rounded-xl rotate-[15deg] opacity-0 group-hover:group-active:opacity-100 transition-opacity">NOPE</div>
                            </Card>
                        </TinderCard>
                    ))
                )}
            </div>

            {/* Interaction Buttons Pod */}
            <div className="mt-8 flex items-center justify-center gap-6">
                <Button variant="outline" size="icon" className="w-16 h-16 rounded-full border-2 border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-500 hover:bg-rose-50 transition-all shadow-lg bg-white">
                    <X className="w-8 h-8" />
                </Button>

                <SuperLikeButton targetUserId={queue?.[0]?.userId || 0} />

                <Button variant="outline" size="icon" className="w-16 h-16 rounded-full border-2 border-slate-200 text-slate-400 hover:text-emerald-500 hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-lg bg-white">
                    <Heart className="w-8 h-8" />
                </Button>
            </div>

            <div className="mt-6 flex gap-4">
                <Button variant="ghost" className="text-slate-400 gap-2 hover:text-primary">
                    <Info className="w-4 h-4" /> Filters
                </Button>
                <Button variant="ghost" className="text-slate-400 gap-2 hover:text-primary">
                    <Sparkles className="w-4 h-4" /> Boost
                </Button>
            </div>
        </div>
    );
};

export default DatingPage;
