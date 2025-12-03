'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function CosmicChristmasBackground() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-b from-black via-[#0a0e27] to-black">
            {/* Estrellas brillantes */}
            <div className="absolute inset-0">
                {[...Array(100)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: Math.random() * 3 + 1 + 'px',
                            height: Math.random() * 3 + 1 + 'px',
                            left: Math.random() * 100 + '%',
                            top: Math.random() * 100 + '%',
                        }}
                        animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </div>

            {/* PLANETA TIERRA ULTRA REALISTA - PREMIUM */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 80,
                    repeat: Infinity,
                    ease: "linear"
                }}
                style={{
                    filter: 'drop-shadow(0 0 80px rgba(66, 153, 225, 0.6))'
                }}
            >
                {/* Esfera base - Océanos brillantes */}
                <div className="w-full h-full rounded-full relative overflow-hidden"
                    style={{
                        background: `
                            radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.4) 0%, transparent 8%),
                            radial-gradient(circle at 50% 50%, 
                                #5dade2 0%,
                                #3498db 15%,
                                #2980b9 35%,
                                #1a5276 60%,
                                #154360 80%,
                                #0b1c2e 100%
                            )
                        `,
                        boxShadow: `
                            0 0 150px rgba(52, 152, 219, 0.8),
                            inset -60px -60px 150px rgba(0, 0, 0, 0.8),
                            inset 40px 40px 120px rgba(255, 255, 255, 0.2)
                        `
                    }}
                >
                    {/* CONTINENTES - SUPER VISIBLES Y VERDES */}
                    <div className="absolute inset-0 rounded-full"
                        style={{
                            backgroundImage: `
                                radial-gradient(ellipse 240px 180px at 18% 38%, #27ae60 0%, #229954 25%, #1e8449 45%, transparent 68%),
                                radial-gradient(ellipse 200px 160px at 22% 48%, #229954 0%, #27ae60 20%, #1e8449 40%, transparent 70%),
                                radial-gradient(ellipse 110px 140px at 16% 32%, #27ae60 0%, #239b56 30%, transparent 75%),
                                
                                radial-gradient(ellipse 260px 190px at 68% 42%, #27ae60 0%, #229954 20%, #1e8449 40%, transparent 62%),
                                radial-gradient(ellipse 180px 140px at 72% 48%, #229954 0%, #27ae60 25%, transparent 68%),
                                radial-gradient(ellipse 130px 110px at 77% 35%, #239b56 0%, #1e8449 35%, transparent 72%),
                                
                                radial-gradient(ellipse 220px 170px at 38% 72%, #229954 0%, #27ae60 22%, #1e8449 42%, transparent 66%),
                                radial-gradient(ellipse 150px 120px at 32% 78%, #27ae60 0%, #229954 30%, transparent 70%),
                                
                                radial-gradient(ellipse 110px 95px at 82% 26%, #27ae60 0%, #229954 28%, transparent 68%),
                                radial-gradient(ellipse 95px 115px at 13% 56%, #229954 0%, #1e8449 32%, transparent 72%)
                            `,
                            opacity: 0.95,
                            mixBlendMode: 'normal'
                        }}
                    />

                    {/* Detalles de montañas y áreas áridas */}
                    <div className="absolute inset-0 rounded-full"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle 55px at 25% 40%, #8b6914 0%, #a0792c 28%, transparent 62%),
                                radial-gradient(circle 45px at 70% 45%, #8b6914 0%, transparent 65%),
                                radial-gradient(circle 38px at 40% 74%, #a0792c 0%, transparent 68%),
                                radial-gradient(circle 32px at 18% 50%, #8b6914 0%, transparent 70%)
                            `,
                            opacity: 0.4
                        }}
                    />

                    {/* Casquetes polares - Hielo blanco brillante */}
                    <div className="absolute inset-0 rounded-full"
                        style={{
                            backgroundImage: `
                                radial-gradient(ellipse 280px 120px at 50% 2%, rgba(255, 255, 255, 0.95) 0%, rgba(240, 248, 255, 0.85) 35%, transparent 62%),
                                radial-gradient(ellipse 260px 110px at 50% 98%, rgba(255, 255, 255, 0.92) 0%, rgba(240, 248, 255, 0.8) 38%, transparent 64%)
                            `,
                            opacity: 0.85
                        }}
                    />

                    {/* Nubes realistas */}
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                            opacity: [0.35, 0.65, 0.35]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            backgroundImage: `
                                radial-gradient(ellipse 220px 120px at 46% 18%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.5) 42%, transparent 62%),
                                radial-gradient(ellipse 160px 100px at 26% 34%, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.4) 45%, transparent 68%),
                                radial-gradient(ellipse 190px 110px at 74% 30%, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0.45) 44%, transparent 65%),
                                radial-gradient(ellipse 140px 85px at 41% 54%, rgba(255, 255, 255, 0.68) 0%, rgba(255, 255, 255, 0.35) 48%, transparent 72%),
                                radial-gradient(ellipse 130px 95px at 69% 61%, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.32) 50%, transparent 75%)
                            `,
                            filter: 'blur(4px)'
                        }}
                    />

                    {/* Atmósfera azul brillante */}
                    <div className="absolute inset-0 rounded-full"
                        style={{
                            background: `radial-gradient(circle at 50% 50%, 
                                transparent 42%, 
                                rgba(93, 173, 226, 0.3) 65%, 
                                rgba(52, 152, 219, 0.5) 75%, 
                                rgba(41, 128, 185, 0.3) 85%, 
                                transparent 95%
                            )`
                        }}
                    />

                    {/* Reflejo del sol - SÚPER BRILLANTE */}
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            background: `radial-gradient(ellipse 220px 280px at 28% 24%, 
                                rgba(255, 255, 255, 0.65) 0%, 
                                rgba(255, 255, 255, 0.35) 28%, 
                                rgba(255, 255, 255, 0.1) 52%, 
                                transparent 68%
                            )`,
                            filter: 'blur(15px)'
                        }}
                    />
                </div>
            </motion.div>

            {/* Nieve cayendo - MÁS INTENSA */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(150)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        initial={{
                            x: Math.random() * 100 + "vw",
                            y: -10,
                            scale: Math.random() * 0.6 + 0.3
                        }}
                        animate={{
                            y: "100vh",
                            x: `calc(${Math.random() * 100}vw + ${Math.random() * 30 - 15}px)`
                        }}
                        transition={{
                            duration: Math.random() * 12 + 8,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 10
                        }}
                        style={{
                            width: Math.random() * 5 + 2 + "px",
                            height: Math.random() * 5 + 2 + "px",
                            filter: "blur(1.5px)",
                            opacity: Math.random() * 0.5 + 0.5
                        }}
                    />
                ))}
            </div>

            {/* Gradiente overlay suave */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none"></div>
        </div>
    );
}
