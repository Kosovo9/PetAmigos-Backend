'use client';

import React, { useState } from 'react';
import { Sparkles, Wand2, Download, Share2 } from 'lucide-react';
import PhotoUploader from '@/components/PhotoUploader';
import { motion } from 'framer-motion';

export default function AIPhotoGeneratorDemo() {
    const [photos, setPhotos] = useState<File[]>([]);
    const [generating, setGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [scenario, setScenario] = useState('christmas-forest');

    const scenarios = [
        { id: 'christmas-forest', name: 'Bosque Navideño', emoji: '🌲' },
        { id: 'santa-studio', name: 'Estudio con Santa', emoji: '🎅' },
        { id: 'winter-wonderland', name: 'País de las Maravillas', emoji: '❄️' },
        { id: 'cozy-fireplace', name: 'Chimenea Acogedora', emoji: '🔥' },
        { id: 'snow-adventure', name: 'Aventura en la Nieve', emoji: '⛄' }
    ];

    const generatePhoto = async () => {
        if (photos.length === 0) {
            alert('Por favor sube al menos una foto');
            return;
        }

        setGenerating(true);

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
                setGeneratedImage(data.imageUrl);

                // Mostrar info del engine usado
                console.log(`✅ Generado con: ${data.engine}`);
                console.log(`📊 Calidad: ${data.quality}`);
                console.log(`💰 Costo: $${data.cost || 0}`);
            } else {
                alert(data.error || 'Error al generar imagen');
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Error al generar la imagen. Intenta de nuevo.');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white py-20 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
                        ✨ Generador de Fotos Navideñas IA
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Transforma las fotos de tu mascota en arte navideño profesional
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Upload & Settings */}
                    <div className="space-y-6">
                        <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold mb-6">1. Sube tus Fotos</h2>
                            <PhotoUploader
                                onPhotosChange={setPhotos}
                                maxPhotos={5}
                                language="es"
                            />
                        </div>

                        <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold mb-6">2. Elige un Escenario</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {scenarios.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => setScenario(s.id)}
                                        className={`p-4 rounded-xl border-2 transition-all ${scenario === s.id
                                                ? 'bg-purple-600/20 border-purple-500 text-white'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">{s.emoji}</div>
                                        <div className="text-sm font-medium">{s.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={generatePhoto}
                            disabled={generating || photos.length === 0}
                            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-3"
                        >
                            {generating ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Generando Magia...
                                </>
                            ) : (
                                <>
                                    <Wand2 size={24} />
                                    Generar Foto Navideña
                                </>
                            )}
                        </button>

                        {/* Engine Info */}
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
                            <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
                                <Sparkles size={18} />
                                Tecnología IA Multi-Engine
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>🤖 <strong>Google AI</strong> (Gemini 2.0 Flash) - Gratis</li>
                                <li>🎥 <strong>Higgsfield</strong> (Nano Banana) - Premium</li>
                                <li>🤗 <strong>Hugging Face</strong> (SDXL) - Fallback</li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-3">
                                El sistema elige automáticamente el mejor engine disponible
                            </p>
                        </div>
                    </div>

                    {/* Right: Result */}
                    <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
                        <h2 className="text-2xl font-bold mb-6">3. Resultado</h2>

                        {!generatedImage ? (
                            <div className="aspect-square bg-white/5 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500">
                                <Sparkles size={64} className="mb-4 opacity-20" />
                                <p className="text-lg">Tu foto mágica aparecerá aquí</p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-4"
                            >
                                <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-purple-500/30">
                                    <img
                                        src={generatedImage}
                                        alt="Generated"
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Watermark indicator */}
                                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
                                        🎨 PetMatch AI
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                                        <Download size={18} />
                                        Descargar
                                    </button>
                                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                                        <Share2 size={18} />
                                        Compartir
                                    </button>
                                </div>

                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
                                    <p className="text-yellow-400 text-sm">
                                        💎 <strong>Actualiza a Premium</strong> para remover la marca de agua
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
