
// client/src/pages/EventsMap.jsx
import { useEffect, useRef, useState } from 'react';
import SeoHead from '../components/SeoHead';

// NOTA: En producción, usar una librería como React-Leaflet o MapboxGL
// Esta es una implementación conceptual para el "mapa integrado" placeholder
// que luego cargará el mapa real.

const EventsMap = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data loading
        // In real app: getUserLocation -> fetch /api/events?lng=...&lat=...
        setTimeout(() => {
            setEvents([
                { _id: '1', title: 'Paseo en el Parque', lat: 19.4326, lng: -99.1332 },
                { _id: '2', title: 'Feria de Adopción', lat: 19.4350, lng: -99.1350 }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="h-screen w-full flex flex-col">
            <SeoHead title="Mapa de Eventos | PetAmigos" />

            <div className="bg-white p-4 shadow z-10">
                <h1 className="text-xl font-bold">🗺️ Eventos Locales</h1>
            </div>

            <div className="flex-1 bg-gray-100 relative">
                {/* Placeholder del mapa */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    {loading ? 'Cargando mapa...' : (
                        <div className="text-center">
                            <p className="text-2xl mb-4">📍 Mapa Interactivo</p>
                            <p className="text-sm">Aquí se mostrarán {events.length} eventos cercanos.</p>
                            <div className="mt-8 space-y-2">
                                {events.map(ev => (
                                    <div key={ev._id} className="bg-white p-3 rounded shadow-sm w-64 mx-auto text-left">
                                        <div className="font-bold text-indigo-600">{ev.title}</div>
                                        <div className="text-xs text-gray-500">A 2.5 km de ti</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <button className="absolute bottom-6 right-6 bg-indigo-600 text-white rounded-full w-14 h-14 shadow-lg text-2xl flex items-center justify-center hover:bg-indigo-700 transition">
                +
            </button>
        </div>
    );
};

export default EventsMap;
