'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function PetCursorChase() {
    return (
        <>
            {/* Perrito fijo en esquina inferior izquierda */}
            <motion.div
                className="fixed bottom-4 left-4 z-50 pointer-events-none"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            >
                <motion.div
                    animate={{
                        y: [-5, 5, -5],
                        rotate: [-2, 2, -2]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative"
                >
                    {/* Perrito 3D Plush */}
                    <div className="w-32 h-32 relative">
                        <Image
                            src="/assets/pets/puppy_3d.png"
                            alt="Puppy"
                            fill
                            className="object-contain drop-shadow-2xl"
                        />
                    </div>

                    {/* Corazones flotantes */}
                    <motion.div
                        className="absolute -top-8 -right-8 text-3xl"
                        animate={{
                            y: [-10, -20, -10],
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        💖
                    </motion.div>

                    {/* Sombra */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-black/30 rounded-full blur-md" />
                </motion.div>
            </motion.div>

            {/* Gatito fijo en esquina inferior derecha */}
            <motion.div
                className="fixed bottom-4 right-4 z-50 pointer-events-none"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
            >
                <motion.div
                    animate={{
                        y: [-8, 8, -8],
                        rotate: [2, -2, 2]
                    }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative"
                >
                    {/* Gatito 3D Plush */}
                    <div className="w-32 h-32 relative">
                        <Image
                            src="/assets/pets/kitten_3d.png"
                            alt="Kitten"
                            fill
                            className="object-contain drop-shadow-2xl"
                        />
                    </div>

                    {/* Estrellas flotantes */}
                    <motion.div
                        className="absolute -top-8 -left-8 text-3xl"
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        ⭐
                    </motion.div>

                    {/* Sombra */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-black/30 rounded-full blur-md" />
                </motion.div>
            </motion.div>

            {/* Huellas decorativas ocasionales */}
            <motion.div
                className="fixed bottom-32 left-20 text-2xl opacity-40 pointer-events-none"
                animate={{
                    opacity: [0.2, 0.6, 0.2],
                    scale: [0.9, 1.1, 0.9]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.5
                }}
            >
                🐾
            </motion.div>
            <motion.div
                className="fixed bottom-28 right-24 text-2xl opacity-40 pointer-events-none"
                animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scale: [0.9, 1.1, 0.9]
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: 1
                }}
            >
                🐾
            </motion.div>
        </>
    );
}
