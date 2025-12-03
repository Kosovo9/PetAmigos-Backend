'use client';

import React, { useState } from 'react';
import { Sparkles, Wand2, Download, Lock, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AIPhotoGenerator() {
    const [photos, setPhotos] = useState<File[]>([]);
    const [generating, setGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [scenario, setScenario] = useState('christmas-forest');
    const [isPro, setIsPro] = useState(false); // Simular si el usuario es Pro

    const scenarios = [
        { id: 'christmas-forest', name: 'Bosque Navideño', emoji: '🌲' },
        { id: 'santa-studio', name: 'Estudio con Santa', emoji: '🎅' },
        { id: 'winter-wonderland', name: 'País de las Maravillas', emoji: '❄️' },
        { id: 'cozy-fireplace', name: 'Chimenea Acogedora', emoji: '🔥' },
        { id: 'snow-adventure', name: 'Aventura en la Nieve', emoji: '⛄' }
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setPhotos(Array.from(e.target.files));
        }
    };

    const generatePhoto = async () => {
        if (photos.length === 0) {
            alert('Por favor sube al menos una foto');
            return;
        }

        setGenerating(true);
        setGeneratedImage(null);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            photos.forEach((photo, index) => {
                formData.append(`photo${index}`, photo);
            });

            formData.append('scenario', scenario);
            formData.append('style', 'christmas');
            formData.append('quality', '8K');

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/photos/generate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                // IMPORTANTE: El backend debe devolver la imagen CON marca de agua
                setGeneratedImage(data.imageUrl);
                alert('¡Foto generada con éxito! Actualiza a Pro para descargar sin marca de agua.');
            } else {
                alert(data.message || 'Error al generar foto');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        } finally {
            setGenerating(false);
        }
    };

    const downloadPhoto = () => {
        if (!generatedImage) return;

        if (!isPro) {
            // Redirigir a pricing si no es Pro
            window.location.href = '/pricing';
            return;
        }

        // Si es Pro, descargar sin marca de agua
        const link = document.createElement('a');
        link.href = generatedImage.replace('_watermarked', '_clean'); // Backend debe tener versión limpia
        link.download = `petmatch_${Date.now()}.png`;
        link.click();
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-5xl">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-bold mb-4">
                        <Sparkles className="w-4 h-4" />
                        GENERADOR DE FOTOS CON IA
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                        Fotos Navideñas con IA
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Sube fotos de tu mascota y crea escenas navideñas mágicas
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Panel izquierdo: Upload & Generate */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Wand2 className="w-6 h-6 text-purple-400" />
                            Generador
                        </h2>

                        {/* Upload */}
                        <div className="mb-6">
                            <label className="block text-white/80 mb-3 font-semibold">
                                1. Sube fotos de tu mascota:
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition-all"
                            />
                            {photos.length > 0 && (
                                <p className="text-green-400 text-sm mt-2">
                                    ✓ {photos.length} foto(s) seleccionada(s)
                                </p>
                            )}
                        </div>

                        {/* Scenario selector */}
                        <div className="mb-6">
                            <label className="block text-white/80 mb-3 font-semibold">
                                2. Elige un escenario:
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {scenarios.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setScenario(s.id)}
                                        className={`p-4 rounded-xl border-2 transition-all ${scenario === s.id
                                                ? 'border-purple-500 bg-purple-500/30 shadow-lg shadow-purple-500/50'
                                                : 'border-white/10 bg-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">{s.emoji}</div>
                                        <div className="text-white text-sm font-bold">{s.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generate button */}
                        <button
                            onClick={generatePhoto}
                            disabled={generating || photos.length === 0}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {generating ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Sparkles className="w-5 h-5" />
                                    </motion.div>
                                    Generando magia...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-5 h-5" />
                                    Generar Foto con IA
                                </>
                            )}
                        </button>

                        <p className="text-white/40 text-xs mt-3 text-center">
                            Fotos gratis incluyen marca de agua. Actualiza a Pro para descargas sin límites.
                        </p>
                    </motion.div>

                    {/* Panel derecho: Resultado */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Resultado
                        </h2>

                        {!generatedImage && !generating && (
                            <div className="flex items-center justify-center h-96 border-2 border-dashed border-white/20 rounded-2xl">
                                <div className="text-center text-white/40">
                                    <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>Tu foto generada aparecerá aquí</p>
                                </div>
                            </div>
                        )}

                        {generating && (
                            <div className="flex items-center justify-center h-96 border-2 border-dashed border-purple-500/50 rounded-2xl bg-purple-500/10">
                                <div className="text-center">
                                    <motion.div
                                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="text-6xl mb-4"
                                    >
                                        ✨
                                    </motion.div>
                                    <p className="text-white font-bold text-lg">Generando con IA avanzada...</p>
                                    <p className="text-white/60 text-sm mt-2">Esto puede tomar 10-30 segundos</p>
                                </div>
                            </div>
                        )}

                        {generatedImage && !generating && (
                            <div className="space-y-4">
                                <div className="relative rounded-2xl overflow-hidden border-2 border-white/20">
                                    <img
                                        src={generatedImage}
                                        alt="Generated"
                                        className="w-full h-auto"
                                    />

                                    {/* Marca de agua overlay si no es Pro */}
                                    {!isPro && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="bg-black/60 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20 transform rotate-[-15deg]">
                                                <p className="text-white font-black text-2xl">PetMatch.fun</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Download button */}
                                {isPro ? (
                                    <button
                                        onClick={downloadPhoto}
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                                    >
                                        <Download className="w-5 h-5" />
                                        Descargar sin Marca de Agua
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => window.location.href = '/pricing'}
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                                    >
                                        <Lock className="w-5 h-5" />
                                        Actualiza a Pro para Descargar
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        setGeneratedImage(null);
                                        setPhotos([]);
                                    }}
                                    className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-colors border border-white/10"
                                >
                                    Generar Otra Foto
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 text-center">
                        <div className="text-4xl mb-3">🎨</div>
                        <h3 className="text-white font-bold mb-2">IA Avanzada</h3>
                        <p className="text-white/60 text-sm">Resultados ultra-realistas en segundos</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 text-center">
                        <div className="text-4xl mb-3">⚡</div>
                        <h3 className="text-white font-bold mb-2">Super Rápido</h3>
                        <p className="text-white/60 text-sm">Generación en 10-30 segundos</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 text-center">
                        <div className="text-4xl mb-3">📥</div>
                        <h3 className="text-white font-bold mb-2">Alta Calidad</h3>
                        <p className="text-white/60 text-sm">Descargas en 8K Ultra-HD</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
