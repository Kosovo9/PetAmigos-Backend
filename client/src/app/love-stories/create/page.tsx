'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Heart, Calendar, MapPin, Dog, Type, FileText, Send, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateLoveStoryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        petName: '',
        petSpecies: 'dog',
        petBreed: '',
        adoptionDate: '',
        city: '',
        country: '',
        story: ''
    });

    const [files, setFiles] = useState<FileList | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(e.target.files);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Debes iniciar sesión para publicar una historia.');
                setLoading(false);
                return;
            }

            // 1. Crear la historia
            const storyPayload = {
                ...formData,
                location: {
                    city: formData.city,
                    country: formData.country
                }
            };

            const createRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/love-stories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(storyPayload)
            });

            const createData = await createRes.json();

            if (!createRes.ok) {
                throw new Error(createData.error || 'Error al crear la historia');
            }

            const storyId = createData.story._id;

            // 2. Subir fotos (si hay)
            if (files && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    const formDataPhoto = new FormData();
                    formDataPhoto.append('photo', files[i]);

                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/love-stories/${storyId}/photos`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: formDataPhoto
                    });
                }
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/love-stories');
            }, 2000);

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Ocurrió un error inesperado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-20 px-4 bg-black/90 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
                >
                    <div className="text-center mb-10">
                        <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-pulse" />
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                            Comparte tu Historia
                        </h1>
                        <p className="text-gray-300 text-lg">
                            Inspira al mundo con tu historia de adopción.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 text-center">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-10 h-10 text-white fill-current" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">¡Historia Enviada!</h2>
                            <p className="text-gray-300 text-xl">
                                Tu historia ha sido recibida y está pendiente de aprobación.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Título */}
                            <div className="space-y-2">
                                <label className="text-gray-300 font-semibold flex items-center gap-2">
                                    <Type className="w-4 h-4 text-pink-500" /> Título de la Historia
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Ej: El día que Luna llegó a casa..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nombre Mascota */}
                                <div className="space-y-2">
                                    <label className="text-gray-300 font-semibold flex items-center gap-2">
                                        <Dog className="w-4 h-4 text-pink-500" /> Nombre de la Mascota
                                    </label>
                                    <input
                                        type="text"
                                        name="petName"
                                        required
                                        value={formData.petName}
                                        onChange={handleChange}
                                        placeholder="Ej: Luna"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                    />
                                </div>

                                {/* Especie */}
                                <div className="space-y-2">
                                    <label className="text-gray-300 font-semibold flex items-center gap-2">
                                        <Dog className="w-4 h-4 text-pink-500" /> Especie
                                    </label>
                                    <select
                                        name="petSpecies"
                                        value={formData.petSpecies}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all [&>option]:bg-gray-900"
                                    >
                                        <option value="dog">Perro 🐕</option>
                                        <option value="cat">Gato 🐈</option>
                                        <option value="bird">Ave 🦜</option>
                                        <option value="rabbit">Conejo 🐰</option>
                                        <option value="other">Otro 🐾</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Raza */}
                                <div className="space-y-2">
                                    <label className="text-gray-300 font-semibold flex items-center gap-2">
                                        <Dog className="w-4 h-4 text-pink-500" /> Raza (Opcional)
                                    </label>
                                    <input
                                        type="text"
                                        name="petBreed"
                                        value={formData.petBreed}
                                        onChange={handleChange}
                                        placeholder="Ej: Mestizo"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                    />
                                </div>

                                {/* Fecha Adopción */}
                                <div className="space-y-2">
                                    <label className="text-gray-300 font-semibold flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-pink-500" /> Fecha de Adopción
                                    </label>
                                    <input
                                        type="date"
                                        name="adoptionDate"
                                        required
                                        value={formData.adoptionDate}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Ciudad */}
                                <div className="space-y-2">
                                    <label className="text-gray-300 font-semibold flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-pink-500" /> Ciudad
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Ej: Ciudad de México"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                    />
                                </div>

                                {/* País */}
                                <div className="space-y-2">
                                    <label className="text-gray-300 font-semibold flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-pink-500" /> País
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="Ej: México"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Historia */}
                            <div className="space-y-2">
                                <label className="text-gray-300 font-semibold flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-pink-500" /> Tu Historia
                                </label>
                                <textarea
                                    name="story"
                                    required
                                    value={formData.story}
                                    onChange={handleChange}
                                    rows={6}
                                    placeholder="Cuéntanos cómo se conocieron, los retos que superaron y cómo cambió tu vida..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all resize-none"
                                />
                            </div>

                            {/* Fotos */}
                            <div className="space-y-2">
                                <label className="text-gray-300 font-semibold flex items-center gap-2">
                                    <Upload className="w-4 h-4 text-pink-500" /> Fotos (Máx 3)
                                </label>
                                <div className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-pink-500/50 transition-all group cursor-pointer">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-pink-400 transition-colors">
                                        <Upload className="w-8 h-8" />
                                        <span className="text-sm">
                                            {files && files.length > 0
                                                ? `${files.length} archivos seleccionados`
                                                : 'Arrastra fotos aquí o haz clic para seleccionar'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-4 pt-4">
                                <Link href="/love-stories" className="flex-1">
                                    <button
                                        type="button"
                                        className="w-full bg-white/5 text-white py-4 rounded-xl font-bold hover:bg-white/10 transition-all border border-white/10"
                                    >
                                        Cancelar
                                    </button>
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition-all shadow-lg shadow-pink-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Publicando...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Publicar Historia
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
