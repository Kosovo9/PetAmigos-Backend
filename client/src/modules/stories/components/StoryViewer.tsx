import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { X, ChevronLeft, ChevronRight, MoreHorizontal, MessageCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StoryViewer = ({ isOpen, onClose, stories, initialIndex = 0 }: any) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isOpen) return;

        const duration = 5000; // 5 seconds per story
        const interval = 50;
        const step = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    if (currentIndex < stories.length - 1) {
                        setCurrentIndex(prev => prev + 1);
                        return 0;
                    } else {
                        onClose();
                        return 100;
                    }
                }
                return prev + step;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [isOpen, currentIndex, stories.length, onClose]);

    if (!isOpen || !stories.length) return null;

    const currentStory = stories[currentIndex];

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/70 hover:text-white z-[110]"
            >
                <X className="w-8 h-8" />
            </button>

            <div className="relative w-full max-w-md aspect-[9/16] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
                {/* Progress Indicators */}
                <div className="absolute top-4 left-4 right-4 z-50 flex gap-1">
                    {stories.map((_: any, idx: number) => (
                        <div key={idx} className="h-0.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all duration-75 ease-linear"
                                style={{
                                    width: idx === currentIndex ? `${progress}%` : (idx < currentIndex ? '100%' : '0%')
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Header */}
                <div className="absolute top-8 left-4 right-4 z-50 flex justify-between items-center bg-transparent">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-primary">
                            <AvatarFallback>P</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-white text-sm font-bold">{currentStory.ownerName || "Pet Story"}</p>
                            <p className="text-white/60 text-xs">{currentStory.timeAgo || "2h ago"}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-white">
                        <MoreHorizontal className="w-5 h-5" />
                    </Button>
                </div>

                {/* Navigation Controls */}
                <div className="absolute inset-0 z-40 flex">
                    <div
                        className="w-1/3 h-full cursor-pointer"
                        onClick={() => {
                            if (currentIndex > 0) {
                                setCurrentIndex(currentIndex - 1);
                                setProgress(0);
                            }
                        }}
                    />
                    <div
                        className="w-2/3 h-full cursor-pointer"
                        onClick={() => {
                            if (currentIndex < stories.length - 1) {
                                setCurrentIndex(currentIndex + 1);
                                setProgress(0);
                            } else {
                                onClose();
                            }
                        }}
                    />
                </div>

                {/* Media Content */}
                <div className="w-full h-full bg-slate-800">
                    <img
                        src={currentStory.mediaUrl}
                        className="w-full h-full object-cover"
                        alt="Story content"
                    />
                </div>

                {/* Footer / Reply */}
                <div className="absolute bottom-6 left-4 right-4 z-50 flex gap-3 items-center">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Send a message..."
                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-3 px-6 text-white text-sm outline-none focus:ring-2 focus:ring-white/30"
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                        <Heart className="w-6 h-6" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                        <MessageCircle className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StoryViewer;
