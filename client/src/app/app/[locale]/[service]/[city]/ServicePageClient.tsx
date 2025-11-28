'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Phone, Globe } from 'lucide-react';

interface Provider {
    id: string;
    name: string;
    description: string;
    rating: number;
    review_count: number;
    address: string;
    phone: string;
    website: string;
    image_url: string;
    is_verified: boolean;
}

interface ServicePageClientProps {
    providers: Provider[];
    service: string;
    city: string;
    locale: string;
    t: any;
}

export default function ServicePageClient({ providers, service, city, locale, t }: ServicePageClientProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 capitalize">
                {service} en {city}
            </h1>

            {providers.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-xl text-gray-600">No se encontraron proveedores en esta zona aún.</p>
                    <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700">
                        Ser el primero en registrarse
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {providers.map((provider) => (
                        <motion.div
                            key={provider.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
                        >
                            <div className="h-48 bg-gray-200 relative">
                                {provider.image_url ? (
                                    <img src={provider.image_url} alt={provider.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        Sin imagen
                                    </div>
                                )}
                                {provider.is_verified && (
                                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <Star size={12} fill="currentColor" /> Verificado
                                    </div>
                                )}
                            </div>

                            <div className="p-5">
                                <h3 className="text-xl font-bold mb-2">{provider.name}</h3>
                                <div className="flex items-center gap-1 text-yellow-500 mb-3">
                                    <Star size={16} fill="currentColor" />
                                    <span className="font-semibold">{provider.rating}</span>
                                    <span className="text-gray-400 text-sm">({provider.review_count} reseñas)</span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{provider.description}</p>

                                <div className="space-y-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        <span>{provider.address}</span>
                                    </div>
                                    {provider.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} />
                                            <span>{provider.phone}</span>
                                        </div>
                                    )}
                                </div>

                                <button className="w-full mt-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                                    Ver Detalles
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
