'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function CosmicChristmasBackground() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-black">
            {/* Estrellas de fondo */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2072&auto=format&fit=crop')] bg-cover opacity-60"></div>

            {/* Planeta Tierra Girando */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-80 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full rounded-full shadow-[0_0_100px_rgba(59,130,246,0.5)]"
                    style={{
                        background: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Earth_Western_Hemisphere_transparent_background.png/1200px-Earth_Western_Hemisphere_transparent_background.png')",
                        backgroundSize: 'cover',
                        filter: 'brightness(0.8) contrast(1.2)'
                    }}
                />
            </div>

            {/* Santa Espacial Orbitando */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] pointer-events-none"
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{ x: '-50%', y: '-50%' }}
            >
                <motion.div
                    className="absolute top-0 left-1/2 w-24 h-12"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/744/744546.png"
                        alt="Santa Sleigh"
                        className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                        style={{ filter: 'invert(1)' }}
                    />
                    <div className="absolute top-1/2 right-full w-32 h-1 bg-gradient-to-l from-white to-transparent opacity-50 blur-sm"></div>
                </motion.div>
            </motion.div>

            {/* Capa de nieve cósmica */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 pointer-events-none"></div>

            {/* NIEVE CAYENDO (CSS Animation) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full opacity-70"
                        initial={{
                            x: Math.random() * 100 + "vw",
                            y: -10,
                            scale: Math.random() * 0.5 + 0.2
                        }}
                        animate={{
                            y: "100vh",
                            x: `calc(${Math.random() * 100}vw + ${Math.random() * 20 - 10}px)`
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 10
                        }}
                        style={{
                            width: Math.random() * 4 + 2 + "px",
                            height: Math.random() * 4 + 2 + "px",
                            filter: "blur(1px)"
                        }}
                    />
                ))}
            </div>

            {/* RAMILLETES DE NOCHEBUENAS (Esquinas) - Tonos Ajustados */}
            {/* Usamos mix-blend-mode: screen para que se fusionen con el fondo negro */}
            {/* Esquina Superior Izquierda */}
            <img
                src="https://png.pngtree.com/png-clipart/20220117/original/pngtree-christmas-flower-decoration-png-image_7115856.png"
                className="absolute top-0 left-0 w-64 md:w-96 opacity-50 pointer-events-none transform -translate-x-10 -translate-y-10 rotate-12"
                style={{ mixBlendMode: 'screen', filter: 'sepia(0.2) hue-rotate(-10deg)' }}
                alt="Christmas Flowers"
            />
            {/* Esquina Inferior Derecha */}
            <img
                src="https://png.pngtree.com/png-clipart/20220117/original/pngtree-christmas-flower-decoration-png-image_7115856.png"
                className="absolute bottom-0 right-0 w-64 md:w-96 opacity-50 pointer-events-none transform translate-x-10 translate-y-10 rotate-180"
                style={{ mixBlendMode: 'screen', filter: 'sepia(0.2) hue-rotate(-10deg)' }}
                alt="Christmas Flowers"
            />
        </div>
    );
}
