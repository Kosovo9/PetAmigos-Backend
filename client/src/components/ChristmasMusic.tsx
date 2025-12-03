'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChristmasMusic() {
    const [isPlaying, setIsPlaying] = useState(false); // EMPIEZA PAUSADO
    const [currentSong, setCurrentSong] = useState(0);
    const [showPanel, setShowPanel] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // VILLANCICOS JAZZ / MICHAEL BUBLÉ STYLE (Royalty Free by Kevin MacLeod)
    const playlist = [
        {
            name: "Jingle Bells (Jazz)",
            url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Jingle%20Bells.mp3"
        },
        {
            name: "Deck the Halls (Jazz)",
            url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Deck%20the%20Halls%20B.mp3"
        },
        {
            name: "We Wish You a Merry Christmas",
            url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/We%20Wish%20you%20a%20Merry%20Christmas.mp3"
        }
    ];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.2;
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log('Autoplay prevented:', error);
                        setIsPlaying(false);
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSong]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const nextSong = () => {
        setCurrentSong((prev) => (prev + 1) % playlist.length);
        setIsPlaying(true);
    };

    const handleSongEnd = () => {
        nextSong();
    };

    return (
        <>
            <audio
                ref={audioRef}
                src={playlist[currentSong].url}
                onEnded={handleSongEnd}
                loop={false}
            />

            {/* Botón flotante */}
            <motion.div
                className="fixed bottom-6 right-6 z-50"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
            >
                <motion.button
                    onClick={() => setShowPanel(!showPanel)}
                    className="relative group"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/40 via-green-500/40 to-red-500/40 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />

                    <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-green-700 p-3 rounded-full shadow-2xl border-2 border-white/30 backdrop-blur-sm">
                        {isPlaying ? (
                            <Volume2 className="w-5 h-5 text-white drop-shadow-lg" />
                        ) : (
                            <VolumeX className="w-5 h-5 text-white/80 drop-shadow-lg" />
                        )}
                    </div>

                    {isPlaying && (
                        <motion.div
                            className="absolute -top-1 -right-1"
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 15, -15, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <div className="w-3 h-3 bg-yellow-400 rounded-full border border-yellow-600 flex items-center justify-center text-[8px]">
                                ♪
                            </div>
                        </motion.div>
                    )}
                </motion.button>
            </motion.div>

            {/* Panel de control */}
            <AnimatePresence>
                {showPanel && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="fixed bottom-20 right-6 z-40 bg-gradient-to-br from-red-950/98 via-green-950/98 to-red-950/98 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white/20 w-80"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-3xl">🎄</div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-sm tracking-wide">Villancicos Navideños</h3>
                                <p className="text-white/50 text-xs">{playlist.length} canciones</p>
                            </div>
                        </div>

                        {/* Now playing */}
                        <div className="bg-white/10 rounded-xl p-3 mb-4 backdrop-blur-sm border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <motion.div
                                    animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                    className="text-lg"
                                >
                                    {isPlaying ? '🎵' : '⏸️'}
                                </motion.div>
                                <div className="flex-1">
                                    <p className="text-white/60 text-[10px] uppercase tracking-wider mb-0.5">
                                        {isPlaying ? 'REPRODUCIENDO' : 'PAUSADO'}
                                    </p>
                                    <p className="text-white font-semibold text-xs truncate">
                                        {playlist[currentSong].name}
                                    </p>
                                </div>
                            </div>

                            {isPlaying && (
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-green-400 to-red-400"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 180, ease: "linear", repeat: Infinity }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Controles */}
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={togglePlay}
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                {isPlaying ? (
                                    <>
                                        <Pause className="w-4 h-4" />
                                        Pausar
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4" />
                                        Reproducir
                                    </>
                                )}
                            </button>
                            <button
                                onClick={nextSong}
                                className="bg-white/15 hover:bg-white/25 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg backdrop-blur-sm border border-white/10"
                                title="Siguiente"
                            >
                                <SkipForward className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Lista de reproducción */}
                        <div className="space-y-1.5">
                            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2 px-1">
                                Lista de reproducción
                            </p>
                            {playlist.map((song, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setCurrentSong(idx);
                                        setIsPlaying(true);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${idx === currentSong
                                        ? 'bg-gradient-to-r from-green-600/40 to-red-600/40 text-white font-bold border border-white/20 shadow-lg'
                                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">
                                            {idx === currentSong && isPlaying ? '🔊' : '🎵'}
                                        </span>
                                        <span className="flex-1">{song.name}</span>
                                        {idx === currentSong && isPlaying && (
                                            <motion.span
                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className="text-green-400 text-xs"
                                            >
                                                ♪
                                            </motion.span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
