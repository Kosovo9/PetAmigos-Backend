'use client';

import React from 'react';
import Link from 'next/link';
import { Plane, CheckCircle, XCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface FlightPolicyCardProps {
    policy: {
        _id: string;
        airline: string;
        country: string;
        logoUrl?: string;
        cabinAllowed: boolean;
        cargoAllowed: boolean;
        weightLimitCabin: string;
        fees: string;
        rating: number;
    };
}

export default function FlightPolicyCard({ policy }: FlightPolicyCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="group relative"
        >
            <Link href={`/fly/${policy._id}`}>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-blue-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transform hover:-translate-y-2 h-full flex flex-col">

                    {/* Header */}
                    <div className="p-6 pb-4 flex items-center justify-between border-b border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden p-1">
                                {policy.logoUrl ? (
                                    <img src={policy.logoUrl} alt={policy.airline} className="w-full h-full object-contain" />
                                ) : (
                                    <Plane className="text-blue-600 w-6 h-6" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                    {policy.airline}
                                </h3>
                                <p className="text-gray-400 text-xs uppercase tracking-wider">{policy.country}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-yellow-400 font-bold text-lg">
                                {'★'.repeat(Math.round(policy.rating))}
                                <span className="text-gray-600">{'★'.repeat(5 - Math.round(policy.rating))}</span>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex-grow">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                <p className="text-gray-400 text-xs mb-1">Cabina</p>
                                {policy.cabinAllowed ? (
                                    <div className="flex items-center justify-center gap-1 text-green-400 font-bold">
                                        <CheckCircle className="w-4 h-4" /> Allowed
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-1 text-red-400 font-bold">
                                        <XCircle className="w-4 h-4" /> No
                                    </div>
                                )}
                            </div>
                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                <p className="text-gray-400 text-xs mb-1">Bodega</p>
                                {policy.cargoAllowed ? (
                                    <div className="flex items-center justify-center gap-1 text-green-400 font-bold">
                                        <CheckCircle className="w-4 h-4" /> Allowed
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-1 text-red-400 font-bold">
                                        <XCircle className="w-4 h-4" /> No
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                                <div>
                                    <p className="text-gray-400 text-xs">Peso Máximo (Cabina)</p>
                                    <p className="text-white font-medium">{policy.weightLimitCabin}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-green-400 font-bold text-lg">$</span>
                                <div>
                                    <p className="text-gray-400 text-xs">Tarifas Estimadas</p>
                                    <p className="text-white font-medium">{policy.fees}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-white/5 text-center text-blue-300 text-sm font-semibold group-hover:bg-blue-500/20 transition-colors">
                        Ver Política Completa →
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
