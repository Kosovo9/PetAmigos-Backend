'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function InteractiveSanta() {
    const [santaSleighs, setSantaSleighs] = useState([
        {
            id: 1,
            image: 'https://pngimg.com/uploads/santa_claus/santa_claus_PNG39270.png',
            scale: 1,
            controls: useAnimation()
        },
        {
            id: 2,
            image: 'https://pngimg.com/uploads/reindeer/reindeer_PNG23.png',
            scale: 0.8,
            controls: useAnimation()
        },
        {
            id: 3,
            image: 'https://freepngimg.com/thumb/santa_claus/5-2-santa-claus-png-pic.png',
            scale: 1.2,
            controls: useAnimation()
        },
        {
            id: 4,
            image: 'https://pngimg.com/uploads/santa_claus/santa_claus_PNG39258.png',
            scale: 0.9,
            controls: useAnimation()
        }
    ]);

    useEffect(() => {
        santaSleighs.forEach((sleigh, index) => {
            flySanta(sleigh.controls, sleigh.scale, index * 5000);
        });
    }, []);

    const flySanta = async (controls: any, scale: number, initialDelay: number) => {
        // Initial delay to stagger the sleighs
        await new Promise(r => setTimeout(r, initialDelay));

        while (true) {
            // Random start position (left or right)
            const startSide = Math.random() > 0.5 ? 'left' : 'right';
            const startY = Math.random() * (window.innerHeight - 200) + 100;

            // Set initial position off-screen
            await controls.set({
                x: startSide === 'left' ? -400 : window.innerWidth + 400,
                y: startY,
                scaleX: startSide === 'left' ? scale : -scale,
                scaleY: scale
            });

            // Wait random time before flying
            await new Promise(r => setTimeout(r, Math.random() * 15000 + 8000));

            // Fly across with slight wave motion
            await controls.start({
                x: startSide === 'left' ? window.innerWidth + 400 : -400,
                y: [startY, startY - 50, startY + 30, startY - 20, startY],
                transition: {
                    duration: Math.random() * 8 + 10,
                    ease: "easeInOut",
                    y: {
                        duration: 4,
                        repeat: 3,
                        ease: "easeInOut"
                    }
                }
            });
        }
    };

    return (
        <>
            {santaSleighs.map((sleigh) => (
                <motion.div
                    key={sleigh.id}
                    animate={sleigh.controls}
                    className="fixed z-50 pointer-events-none"
                    style={{ top: 0, left: 0 }}
                >
                    <div className="relative" style={{ width: '300px', height: '150px' }}>
                        {/* Magic dust trail */}
                        <div className="absolute top-1/2 left-1/2 w-60 h-3 bg-gradient-to-r from-yellow-200 via-pink-200 to-transparent blur-md opacity-60 -z-10"
                            style={{ transform: 'translate(-50%, -50%)' }}
                        />

                        {/* Sparkles */}
                        <motion.div
                            className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full"
                            animate={{
                                scale: [0, 1.5, 0],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: Math.random() * 2
                            }}
                        />
                        <motion.div
                            className="absolute top-3/4 left-2/3 w-2 h-2 bg-pink-300 rounded-full"
                            animate={{
                                scale: [0, 1.5, 0],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: Math.random() * 2
                            }}
                        />

                        {/* Santa with sleigh and reindeer */}
                        <img
                            src={sleigh.image}
                            alt="Santa Sleigh"
                            className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.9)] drop-shadow-[0_0_50px_rgba(255,215,0,0.5)]"
                            style={{ filter: 'brightness(1.1)' }}
                        />
                    </div>
                </motion.div>
            ))}
        </>
    );
}
