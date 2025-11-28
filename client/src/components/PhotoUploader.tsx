'use client';

import React, { useState } from 'react';
import { Upload, X, RefreshCw, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoUploaderProps {
    onPhotosChange: (photos: File[]) => void;
    maxPhotos?: number;
    language?: 'es' | 'en' | 'fr';
}

const QUALITY_MESSAGES = {
    es: {
        title: '📸 Consejos para Mejores Resultados',
        tips: [
            '✨ Usa buena iluminación natural o artificial',
            '🎯 Asegúrate de que la foto no esté borrosa',
            '🚫 Evita obstáculos que cubran a tu mascota',
            '📐 Toma la foto de frente o de perfil',
            '🌟 Fondos simples funcionan mejor'
        ],
        upload: 'Subir Fotos',
        replace: 'Reemplazar',
        remove: 'Eliminar',
        analyzing: 'Analizando foto...',
        detected: 'Mascota detectada',
        warning: 'Calidad baja detectada',
        maxReached: 'Máximo de fotos alcanzado'
    },
    en: {
        title: '📸 Tips for Best Results',
        tips: [
            '✨ Use good natural or artificial lighting',
            '🎯 Make sure the photo is not blurry',
            '🚫 Avoid obstacles covering your pet',
            '📐 Take the photo from front or side',
            '🌟 Simple backgrounds work better'
        ],
        upload: 'Upload Photos',
        replace: 'Replace',
        remove: 'Remove',
        analyzing: 'Analyzing photo...',
        detected: 'Pet detected',
        warning: 'Low quality detected',
        maxReached: 'Maximum photos reached'
    },
    fr: {
        title: '📸 Conseils pour de Meilleurs Résultats',
        tips: [
            '✨ Utilisez un bon éclairage naturel ou artificiel',
            '🎯 Assurez-vous que la photo n\'est pas floue',
            '🚫 Évitez les obstacles couvrant votre animal',
            '📐 Prenez la photo de face ou de profil',
            '🌟 Les arrière-plans simples fonctionnent mieux'
        ],
        upload: 'Télécharger des Photos',
        replace: 'Remplacer',
        remove: 'Supprimer',
        analyzing: 'Analyse de la photo...',
        detected: 'Animal détecté',
        warning: 'Faible qualité détectée',
        maxReached: 'Maximum de photos atteint'
    }
};

export default function PhotoUploader({ onPhotosChange, maxPhotos = 5, language = 'es' }: PhotoUploaderProps) {
    const [photos, setPhotos] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [analyzing, setAnalyzing] = useState<number[]>([]);
    const [photoQuality, setPhotoQuality] = useState<{ [key: number]: 'good' | 'warning' | 'analyzing' }>({});

    const t = QUALITY_MESSAGES[language];

    const analyzePhoto = async (file: File, index: number) => {
        setAnalyzing(prev => [...prev, index]);
        setPhotoQuality(prev => ({ ...prev, [index]: 'analyzing' }));

        // Simular análisis de IA (en producción, llamar a API de visión)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Análisis básico de calidad
        const quality = file.size > 100000 && file.size < 10000000 ? 'good' : 'warning';

        setPhotoQuality(prev => ({ ...prev, [index]: quality }));
        setAnalyzing(prev => prev.filter(i => i !== index));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const remainingSlots = maxPhotos - photos.length;
        const newFiles = files.slice(0, remainingSlots);

        if (newFiles.length > 0) {
            const newPreviews = await Promise.all(
                newFiles.map(file => {
                    return new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                    });
                })
            );

            const updatedPhotos = [...photos, ...newFiles];
            const updatedPreviews = [...previews, ...newPreviews];

            setPhotos(updatedPhotos);
            setPreviews(updatedPreviews);
            onPhotosChange(updatedPhotos);

            // Analizar cada nueva foto
            newFiles.forEach((file, i) => {
                analyzePhoto(file, photos.length + i);
            });
        }
    };

    const removePhoto = (index: number) => {
        const updatedPhotos = photos.filter((_, i) => i !== index);
        const updatedPreviews = previews.filter((_, i) => i !== index);

        setPhotos(updatedPhotos);
        setPreviews(updatedPreviews);
        onPhotosChange(updatedPhotos);

        // Limpiar estado de calidad
        const newQuality = { ...photoQuality };
        delete newQuality[index];
        setPhotoQuality(newQuality);
    };

    const replacePhoto = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const updatedPhotos = [...photos];
            const updatedPreviews = [...previews];

            updatedPhotos[index] = file;
            updatedPreviews[index] = reader.result as string;

            setPhotos(updatedPhotos);
            setPreviews(updatedPreviews);
            onPhotosChange(updatedPhotos);

            analyzePhoto(file, index);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-6">
            {/* Quality Tips */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-6"
            >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="text-blue-400" size={20} />
                    {t.title}
                </h3>
                <ul className="space-y-2">
                    {t.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-gray-300">{tip}</li>
                    ))}
                </ul>
            </motion.div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <AnimatePresence>
                    {previews.map((preview, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white/10 group"
                        >
                            <img
                                src={preview}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-full object-cover"
                            />

                            {/* Quality Indicator */}
                            <div className="absolute top-2 left-2">
                                {analyzing.includes(index) ? (
                                    <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span className="text-xs text-white">{t.analyzing}</span>
                                    </div>
                                ) : photoQuality[index] === 'good' ? (
                                    <div className="bg-green-500/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                                        <CheckCircle size={12} className="text-white" />
                                        <span className="text-xs text-white">{t.detected}</span>
                                    </div>
                                ) : photoQuality[index] === 'warning' ? (
                                    <div className="bg-orange-500/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                                        <AlertCircle size={12} className="text-white" />
                                        <span className="text-xs text-white">{t.warning}</span>
                                    </div>
                                ) : null}
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all">
                                    <RefreshCw size={16} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => replacePhoto(index, e)}
                                    />
                                </label>
                                <button
                                    onClick={() => removePhoto(index)}
                                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Upload Button */}
                {photos.length < maxPhotos && (
                    <motion.label
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aspect-square rounded-2xl border-2 border-dashed border-white/20 hover:border-purple-500/50 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/5 hover:bg-white/10 group"
                    >
                        <Upload className="text-gray-400 group-hover:text-purple-400 transition-colors mb-2" size={32} />
                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors text-center px-2">
                            {t.upload}
                        </span>
                        <span className="text-xs text-gray-600 mt-1">
                            {photos.length}/{maxPhotos}
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </motion.label>
                )}
            </div>

            {photos.length >= maxPhotos && (
                <p className="text-center text-sm text-orange-400 bg-orange-500/10 py-2 rounded-lg border border-orange-500/20">
                    {t.maxReached} ({maxPhotos})
                </p>
            )}
        </div>
    );
}
