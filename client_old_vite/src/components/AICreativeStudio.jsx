import React, { useState } from 'react';

import { Sparkles, Zap, Lock, Image, Video, CheckCircle } from 'lucide-react';

import * as api from '../api';

import { useAuth } from '../context/AuthContext';



export default function AICreativeStudio({ petId }) {

    const { user } = useAuth();

    const [formData, setFormData] = useState({

        subject: '',

        action: '',

        scenario: '',

        styleKeys: [],

        contentType: 'image'

    });

    const [template, setTemplate] = useState(null);

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

    const [isPremium, setIsPremium] = useState(false);



    // Cargar plantilla al montar

    React.useEffect(() => {

        fetchTemplate();

        checkPremiumStatus();

    }, [petId]);



    const fetchTemplate = async () => {

        try {

            const response = await fetch('/api/ai-creative/template');

            const data = await response.json();

            setTemplate(data);

        } catch (error) {

            console.error("Error cargando plantilla:", error);

        }

    };



    const checkPremiumStatus = async () => {

        // Verificar si la mascota tiene membresía Lifetime

        // Esto debería venir del contexto o API

        setIsPremium(false); // Temporal, implementar lógica real

    };



    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await api.generateCreativeContent({

                petId,

                ...formData

            });

            setResult(response.data);

        } catch (error) {

            console.error("Error generando contenido:", error);

            alert("Error al generar contenido. Verifica tu conexión.");

        } finally {

            setLoading(false);

        }

    };



    const addStyleKey = (key) => {

        if (!isPremium && formData.styleKeys.length >= 2) {

            alert("Solo 2 palabras clave disponibles en Tier Base. ¡Actualiza a Premium para acceso ilimitado!");

            return;

        }

        if (!formData.styleKeys.includes(key)) {

            setFormData({

                ...formData,

                styleKeys: [...formData.styleKeys, key]

            });

        }

    };



    return (

        <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">

            {/* Header con Tier Info */}

            <div className="mb-6 flex justify-between items-center">

                <div className="flex items-center gap-3">

                    <Sparkles className="text-purple-500" size={32} />

                    <div>

                        <h2 className="text-2xl font-black text-gray-900">AI Creative Studio</h2>

                        <div className="flex items-center gap-2 mt-1">

                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${

                                isPremium 

                                    ? 'bg-yellow-100 text-yellow-700' 

                                    : 'bg-gray-100 text-gray-600'

                            }`}>

                                {isPremium ? '⭐ Premium (4K/8K)' : '🔓 Base (1K)'}

                            </span>

                        </div>

                    </div>

                </div>

                {!isPremium && (

                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition">

                        <Lock size={14} className="inline mr-1" />

                        Upgrade a Premium

                    </button>

                )}

            </div>



            {/* Formulario de Prompts Guiados */}

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Sujeto Principal */}

                <div>

                    <label className="block text-sm font-bold text-gray-700 mb-2">

                        Sujeto Principal *

                    </label>

                    <input

                        type="text"

                        value={formData.subject}

                        onChange={(e) => setFormData({...formData, subject: e.target.value})}

                        placeholder="Mi golden retriever, Leo, con ojos miel"

                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"

                        required

                    />

                    <p className="text-xs text-gray-500 mt-1">Ej: Leo, golden retriever, ojos miel</p>

                </div>



                {/* Acción / Emoción */}

                <div>

                    <label className="block text-sm font-bold text-gray-700 mb-2">

                        Acción / Emoción *

                    </label>

                    <input

                        type="text"

                        value={formData.action}

                        onChange={(e) => setFormData({...formData, action: e.target.value})}

                        placeholder="Saltando en un lago, feliz, jugando"

                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"

                        required

                    />

                    <p className="text-xs text-gray-500 mt-1">Ej: saltando, acción, feliz</p>

                </div>



                {/* Escenario / Fondo */}

                <div>

                    <label className="block text-sm font-bold text-gray-700 mb-2">

                        Escenario / Fondo *

                    </label>

                    <input

                        type="text"

                        value={formData.scenario}

                        onChange={(e) => setFormData({...formData, scenario: e.target.value})}

                        placeholder="Montañas nevadas al atardecer, cabaña de madera"

                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"

                        required

                    />

                    <p className="text-xs text-gray-500 mt-1">Ej: montañas nevadas, cabaña, atardecer</p>

                </div>



                {/* Estilo de Render (CRÍTICO) */}

                <div>

                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">

                        Estilo de Render (CRÍTICO) {!isPremium && <Lock size={14} className="text-gray-400" />}

                        {isPremium && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Nivel Dios</span>}

                    </label>

                    <div className="flex flex-wrap gap-2 mb-2">

                        {template?.fields[3]?.hints.map((hint, i) => (

                            <button

                                key={i}

                                type="button"

                                onClick={() => addStyleKey(hint)}

                                disabled={!isPremium && formData.styleKeys.length >= 2}

                                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${

                                    formData.styleKeys.includes(hint)

                                        ? 'bg-purple-500 text-white'

                                        : !isPremium && formData.styleKeys.length >= 2

                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'

                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'

                                }`}

                            >

                                {hint}

                            </button>

                        ))}

                    </div>

                    <p className="text-xs text-gray-500">

                        {isPremium 

                            ? '⭐ Premium: Acceso ilimitado a todas las claves de estilo'

                            : `🔓 Base: Máximo 2 palabras clave (${formData.styleKeys.length}/2 usadas)`

                        }

                    </p>

                </div>



                {/* Tipo de Contenido */}

                <div>

                    <label className="block text-sm font-bold text-gray-700 mb-2">

                        Tipo de Contenido

                    </label>

                    <div className="flex gap-3">

                        <button

                            type="button"

                            onClick={() => setFormData({...formData, contentType: 'image'})}

                            className={`flex-1 p-3 rounded-xl border-2 transition ${

                                formData.contentType === 'image'

                                    ? 'border-purple-500 bg-purple-50'

                                    : 'border-gray-200'

                            }`}

                        >

                            <Image size={20} className="mx-auto mb-1" />

                            <span className="text-xs font-bold">Imagen</span>

                        </button>

                        <button

                            type="button"

                            onClick={() => setFormData({...formData, contentType: 'video'})}

                            disabled={!isPremium}

                            className={`flex-1 p-3 rounded-xl border-2 transition ${

                                formData.contentType === 'video'

                                    ? 'border-purple-500 bg-purple-50'

                                    : 'border-gray-200'

                            } ${!isPremium ? 'opacity-50 cursor-not-allowed' : ''}`}

                        >

                            <Video size={20} className="mx-auto mb-1" />

                            <span className="text-xs font-bold">

                                Video {!isPremium && <Lock size={10} className="inline" />}

                            </span>

                        </button>

                    </div>

                </div>



                {/* Disclaimer Legal */}

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-800">

                <strong>⚠️ Disclaimer Legal:</strong> El contenido generado por IA es para uso personal. 

                PetAmigos World no se hace responsable del uso indebido del contenido generado. 

                Al generar contenido, aceptas nuestros términos de servicio.

            </div>



            {/* Botón Generar */}

                <button

                    type="submit"

                    disabled={loading}

                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-black text-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"

                >

                    {loading ? (

                        <>⏳ Generando...</>

                    ) : (

                        <>

                            <Zap size={20} />

                            Generar Contenido {isPremium ? 'Nivel Dios' : 'Estándar'}

                        </>

                    )}

                </button>

            </form>



            {/* Resultado */}

            {result && (

                <div className="mt-6 p-4 bg-gray-50 rounded-xl">

                    <div className="flex items-center gap-2 mb-2">

                        <CheckCircle className="text-green-500" size={20} />

                        <span className="font-bold text-gray-900">Contenido Generado</span>

                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">

                            {result.tier === 'premium' ? '4K/8K' : '1K'}

                        </span>

                    </div>

                    {result.content.url && (

                        <img 

                            src={result.content.url} 

                            alt="Generated content" 

                            className="w-full rounded-lg mt-2"

                        />

                    )}

                    {result.content.description && (

                        <p className="text-sm text-gray-700 mt-2">{result.content.description}</p>

                    )}

                </div>

            )}

        </div>

    );

}

