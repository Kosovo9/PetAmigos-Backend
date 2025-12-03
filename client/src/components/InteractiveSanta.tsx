'use client';

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function InteractiveSanta() {
    const controls = useAnimation();

    useEffect(() => {
        flySanta();
    }, []);

    const flySanta = async () => {
        while (true) {
            // Random start position (left or right)
            const startSide = Math.random() > 0.5 ? 'left' : 'right';
            const startY = Math.random() * (window.innerHeight - 300) + 50;

            // Set initial position off-screen
            await controls.set({
                x: startSide === 'left' ? -500 : window.innerWidth + 500,
                y: startY,
                scaleX: startSide === 'left' ? 1 : -1, // Flip image based on direction
                opacity: 1
            });

            // Wait random time before flying
            await new Promise(r => setTimeout(r, Math.random() * 20000 + 10000));

            // Fly across
            await controls.start({
                x: startSide === 'left' ? window.innerWidth + 500 : -500,
                y: [startY, startY - 100, startY + 50, startY],
                transition: {
                    duration: Math.random() * 10 + 15, // Slow and majestic
                    ease: "linear"
                }
            });
        }
    };

    return (
        <motion.div
            animate={controls}
            className="fixed z-50 pointer-events-none"
            style={{ top: 0, left: 0 }}
        >
            <div className="relative w-[400px] h-[200px]">
                {/* Magic dust trail */}
                <div className="absolute top-1/2 left-1/2 w-full h-4 bg-gradient-to-r from-yellow-100/50 via-white/50 to-transparent blur-xl -z-10" />

                <img
                    src="https://pngimg.com/uploads/santa_claus/santa_claus_PNG39270.png"
                    alt="Santa Claus"
                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                />
            </div>
        </motion.div>
    );
}
