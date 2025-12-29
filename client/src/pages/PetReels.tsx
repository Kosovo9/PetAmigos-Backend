import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Music2, Plus } from 'lucide-react';
import { trpc } from '@/lib/trpc';

const PetReels = () => {
    const { data: reels, isLoading } = trpc.reels.getTrending.useQuery();
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="h-screen w-full bg-black overflow-hidden flex justify-center">
            {/* Mobile Vertical Feed Emulator */}
            <div className="h-full aspect-[9/16] bg-slate-900 relative snap-y snap-mandatory overflow-y-scroll no-scrollbar">
                {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-white space-y-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="font-bold tracking-widest text-xs uppercase animate-pulse">Loading Trends...</p>
                    </div>
                ) : (
                    reels?.map((reel: any, index: number) => (
                        <div key={reel.id} className="h-full w-full snap-start relative flex items-center justify-center">
                            {/* Video Placeholder (In production this uses hls.js) */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />
                            <img
                                src={reel.thumbnailUrl || `https://placedog.net/1080/1920?id=${index}`}
                                alt={reel.title}
                                className="w-full h-full object-cover"
                            />

                            {/* Interactions Sidebar */}
                            <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-6">
                                <div className="relative">
                                    <Avatar className="w-12 h-12 border-2 border-white shadow-xl">
                                        <AvatarFallback>C</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-rose-500 rounded-full p-0.5">
                                        <Plus className="w-3 h-3 text-white" />
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Button variant="ghost" size="icon" className="text-white hover:bg-transparent group">
                                        <Heart className="w-8 h-8 group-hover:fill-rose-500 group-hover:text-rose-500 transition-all drop-shadow-lg" />
                                    </Button>
                                    <span className="text-white text-xs font-bold drop-shadow-md">{reel.likeCount || 0}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Button variant="ghost" size="icon" className="text-white hover:bg-transparent">
                                        <MessageCircle className="w-8 h-8 drop-shadow-lg" />
                                    </Button>
                                    <span className="text-white text-xs font-bold drop-shadow-md">42</span>
                                </div>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-transparent">
                                    <Share2 className="w-8 h-8 drop-shadow-lg" />
                                </Button>
                                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 animate-spin-slow flex items-center justify-center overflow-hidden">
                                    <Music2 className="text-white w-5 h-5" />
                                </div>
                            </div>

                            {/* Video Info Bottom Overlay */}
                            <div className="absolute left-0 right-0 bottom-0 p-6 z-20 space-y-3">
                                <div className="space-y-1">
                                    <h3 className="text-white font-bold text-lg">@{reel.title.replace(' ', '_').toLowerCase()}</h3>
                                    <p className="text-white/90 text-sm line-clamp-2">{reel.description || "The cuttest dog on PetMatch today! #pets #discovery #viral"}</p>
                                </div>
                                <div className="flex items-center gap-2 text-white/80">
                                    <Music2 className="w-4 h-4 animate-pulse" />
                                    <marquee className="text-xs font-medium w-48">Original Sound - PetMatch Global Trends 2024</marquee>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop Sidebar (Web Experience) */}
            <div className="hidden lg:flex flex-col gap-4 p-8 w-80 text-white">
                <div className="space-y-2">
                    <h2 className="text-2xl font-black italic tracking-tighter text-primary">REELS.PET</h2>
                    <p className="text-slate-500 text-sm">Discover the global trend in pet entertainment.</p>
                </div>
                <div className="mt-8 space-y-6">
                    <Button className="w-full justify-start gap-3 bg-white/10 hover:bg-white/20 transition-all" variant="ghost">
                        <Heart className="w-5 h-5 text-rose-500" />
                        Trending Now
                    </Button>
                    <Button className="w-full justify-start gap-3 bg-white/10 hover:bg-white/20 transition-all" variant="ghost">
                        <Plus className="w-5 h-5 text-blue-500" />
                        Create Reel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PetReels;
