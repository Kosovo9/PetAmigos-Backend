'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Globe, Shield } from 'lucide-react';

export default function AffiliateLandingPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />

                <div className="container mx-auto px-6 py-32 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-mono text-sm mb-6">
                            PROGRAMA DE PARTNERS OFICIAL
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                            Monetiza tu Pasión por las Mascotas
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                            Únete a la plataforma #1 de IA para mascotas. Gana hasta un 30% de comisión recurrente por cada venta. Pagos automáticos y herramientas de marketing incluidas.
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <Link href="/login?redirect=/affiliates/dashboard">
                                <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_30px_rgba(22,163,74,0.3)] hover:scale-105 flex items-center gap-2">
                                    Convertirme en Partner <ArrowRight size={20} />
                                </button>
                            </Link>
                            <Link href="/affiliates/about">
                                <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-bold text-lg transition-all">
                                    Más Información
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-[#111] border border-white/10 p-8 rounded-3xl hover:border-green-500/30 transition-all group">
                        <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
                            <Globe size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Pagos Globales</h3>
                        <p className="text-gray-400">
                            Recibe tus ganancias en cualquier parte del mundo vía PayPal, Stripe o Transferencia Bancaria. Sin costos ocultos.
                        </p>
                    </div>
                    <div className="bg-[#111] border border-white/10 p-8 rounded-3xl hover:border-green-500/30 transition-all group">
                        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                            <Shield size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Seguridad Blindada</h3>
                        <p className="text-gray-400">
                            Tu dinero está seguro. Autenticación de 2 factores (2FA) y monitoreo de fraude en tiempo real para proteger tus ingresos.
                        </p>
                    </div>
                    <div className="bg-[#111] border border-white/10 p-8 rounded-3xl hover:border-green-500/30 transition-all group">
                        <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Conversión Alta</h3>
                        <p className="text-gray-400">
                            Nuestras landing pages están optimizadas para convertir. Cookies de 90 días aseguran que no pierdas ninguna comisión.
                        </p>
                    </div>
                </div>
            </div>

            {/* Disclaimer Footer */}
            <div className="border-t border-white/10 bg-[#050505] py-12">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-gray-500 text-sm max-w-4xl mx-auto mb-8">
                        DISCLAIMER: PetMatch Affiliate Program is an independent partnership program. Earnings are dependent on your marketing efforts and sales generated.
                        PetMatch is not responsible for tax reporting in your jurisdiction. You are solely responsible for declaring your income and paying applicable taxes.
                        <br /><br />
                        DESCARGO DE RESPONSABILIDAD: El Programa de Afiliados de PetMatch es una asociación independiente. Las ganancias dependen de sus esfuerzos de marketing.
                        PetMatch no es responsable de la declaración de impuestos en su jurisdicción. Usted es el único responsable de declarar sus ingresos.
                    </p>
                    <div className="flex justify-center gap-6 text-sm text-gray-400">
                        <Link href="/terms" className="hover:text-white">Términos y Condiciones</Link>
                        <Link href="/privacy" className="hover:text-white">Política de Privacidad</Link>
                        <Link href="/affiliates/support" className="hover:text-white">Soporte para Partners</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
