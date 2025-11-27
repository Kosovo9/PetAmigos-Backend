import React, { useState } from 'react';

import { DollarSign, Stethoscope, Lock, CheckCircle } from 'lucide-react';

import * as api from '../api';



export default function FinTechModal({ petId, vetCost, onClose }) {

    const [formData, setFormData] = useState({

        vetCost: vetCost || 0,

        durationMonths: 6,

        vetClinic: ''

    });

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);



    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await api.applyForBNPLLoan({

                petId,

                ...formData

            });

            setResult(response.data);

        } catch (error) {

            console.error("Error solicitando préstamo:", error);

            alert(error.response?.data?.error || "Error al procesar solicitud.");

        } finally {

            setLoading(false);

        }

    };



    if (result) {

        return (

            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

                <div className="bg-white rounded-2xl p-6 max-w-md w-full">

                    <div className="flex items-center gap-2 mb-4">

                        <CheckCircle className="text-green-500" size={24} />

                        <h3 className="text-xl font-black text-gray-900">Solicitud Aprobada</h3>

                    </div>

                    <div className="space-y-3 mb-6">

                        <div className="p-3 bg-gray-50 rounded-xl">

                            <p className="text-xs text-gray-500 mb-1">Monto Principal</p>

                            <p className="text-lg font-bold">${result.loan.principal.toFixed(2)}</p>

                        </div>

                        <div className="p-3 bg-gray-50 rounded-xl">

                            <p className="text-xs text-gray-500 mb-1">Pago Mensual</p>

                            <p className="text-lg font-bold">${result.loan.monthlyPayment}</p>

                        </div>

                        <div className="p-3 bg-gray-50 rounded-xl">

                            <p className="text-xs text-gray-500 mb-1">Duración</p>

                            <p className="text-lg font-bold">{result.loan.durationMonths} meses</p>

                        </div>

                    </div>

                    <button

                        onClick={onClose}

                        className="w-full bg-purple-500 text-white py-3 rounded-xl font-bold"

                    >

                        Cerrar

                    </button>

                </div>

            </div>

        );

    }



    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between mb-4">

                    <div className="flex items-center gap-2">

                        <Stethoscope className="text-purple-500" size={24} />

                        <h3 className="text-xl font-black text-gray-900">Micro-Financiamiento</h3>

                    </div>

                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>

                </div>



                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">

                    <div className="flex items-center gap-2 mb-1">

                        <Lock className="text-blue-500" size={16} />

                        <span className="text-xs font-bold text-blue-700">REQUISITOS</span>

                    </div>

                    <p className="text-xs text-blue-600">

                        Tu mascota debe tener Verificación Biométrica C.I.A. y PIT Token activo.

                    </p>

                </div>



                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>

                        <label className="block text-sm font-bold text-gray-700 mb-2">

                            Costo Veterinario (USD)

                        </label>

                        <input

                            type="number"

                            value={formData.vetCost}

                            onChange={(e) => setFormData({...formData, vetCost: parseFloat(e.target.value)})}

                            placeholder="0.00"

                            step="0.01"

                            min="0"

                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"

                            required

                        />

                    </div>



                    <div>

                        <label className="block text-sm font-bold text-gray-700 mb-2">

                            Duración (Meses)

                        </label>

                        <select

                            value={formData.durationMonths}

                            onChange={(e) => setFormData({...formData, durationMonths: parseInt(e.target.value)})}

                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"

                        >

                            <option value={3}>3 meses</option>

                            <option value={6}>6 meses</option>

                            <option value={12}>12 meses</option>

                        </select>

                    </div>



                    <div>

                        <label className="block text-sm font-bold text-gray-700 mb-2">

                            Clínica Veterinaria (Opcional)

                        </label>

                        <input

                            type="text"

                            value={formData.vetClinic}

                            onChange={(e) => setFormData({...formData, vetClinic: e.target.value})}

                            placeholder="Nombre de la clínica"

                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"

                        />

                    </div>



                    <button

                        type="submit"

                        disabled={loading}

                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-black text-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"

                    >

                        <DollarSign size={20} />

                        {loading ? 'Procesando...' : 'Solicitar Préstamo'}

                    </button>

                </form>

            </div>

        </div>

    );

}


