
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MapPin, Currency, Clock } from 'lucide-react';
import { useCountryExpansion } from '../hooks/useCountryExpansion';

export const CountrySelector: React.FC = () => {
    const { countries, selectedCountry, selectCountry } = useCountryExpansion();
    const [showDetails, setShowDetails] = useState(false);

    const countryFlags: any = {
        'MX': '🇲🇽',
        'US': '🇺🇸',
        'BR': '🇧🇷',
        'ES': '🇪🇸',
        'JP': '🇯🇵',
        'GB': '🇬🇧',
        'DE': '🇩🇪',
        'FR': '🇫🇷',
        'IT': '🇮🇹',
        'CA': '🇨🇦',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 space-y-6"
        >
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Expansión Global</h1>
                <p className="text-gray-600">PetMatch está disponible en {countries.length} países</p>
            </div>

            {/* Country Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {countries.map((country: any, index: number) => (
                    <motion.div
                        key={country.code}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className={`bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all ${selectedCountry?.code === country.code ? 'ring-2 ring-blue-500' : ''
                            }`}
                        onClick={() => {
                            selectCountry(country.code);
                            setShowDetails(true);
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-4xl">{countryFlags[country.code] || '🏳️'}</div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${country.status === 'active' ? 'bg-green-100 text-green-800' :
                                    country.status === 'launching' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {country.status}
                            </div>
                        </div>

                        <h3 className="font-bold text-lg mb-2">{country.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{country.currency} • {country.language}</p>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Currency className="w-4 h-4 text-gray-400" />
                                <span>IVA: {(country.vat * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{country.timezone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{country.payment_methods.length} métodos de pago</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Mercado</span>
                                <span className="text-sm font-medium">${(country.marketSize / 1000000).toFixed(0)}M</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Country Details Modal */}
            <AnimatePresence>
                {showDetails && selectedCountry && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-screen overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">
                                    {countryFlags[selectedCountry.code]} {selectedCountry.name}
                                </h2>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Market Info */}
                                <div>
                                    <h3 className="font-bold mb-3">Información del Mercado</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-600">Tamaño Total</p>
                                            <p className="text-xl font-bold">${(selectedCountry.marketSize / 1000000).toFixed(0)}M</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-600">Crecimiento</p>
                                            <p className="text-xl font-bold">+{(selectedCountry.growthRate * 100).toFixed(0)}%</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Regulatory Requirements */}
                                <div>
                                    <h3 className="font-bold mb-3">Requisitos Regulatorios</h3>
                                    <div className="space-y-2">
                                        {selectedCountry.requirements.map((req: any, index: number) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="font-medium">{req.regulation}</span>
                                                <span className={`text-sm px-2 py-1 rounded ${req.status === 'compliant' ? 'bg-green-100 text-green-800' :
                                                        req.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Activation Button */}
                                {selectedCountry.status !== 'active' && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium"
                                    >
                                        Activar {selectedCountry.name}
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
