
// client/src/pages/SecurityDashboard.jsx
import { useState, useEffect } from 'react';
import SeoHead from '../components/SeoHead';

const SecurityDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('/api/metrics/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading) return <div className="p-8">Cargando métricas de seguridad...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <SeoHead title="Security Command Center | PetAmigos" />
            <h1 className="text-2xl font-bold mb-6 text-slate-800">🔐 Security Command Center</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                    <h3 className="text-red-800 font-bold uppercase text-xs">Contenidos Bloqueados</h3>
                    <p className="text-4xl font-black text-red-600 mt-2">{data?.metrics?.blockedContent || 0}</p>
                </div>
                <div className="bg-amber-50 p-6 rounded-lg border border-amber-100">
                    <h3 className="text-amber-800 font-bold uppercase text-xs">Alertas Amber Activas</h3>
                    <p className="text-4xl font-black text-amber-600 mt-2">{data?.metrics?.alerts || 0}</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="text-blue-800 font-bold uppercase text-xs">Mascotas Perdidas (Global)</h3>
                    <p className="text-4xl font-black text-blue-600 mt-2">{data?.metrics?.activeLostPets || 0}</p>
                </div>
            </div>

            <h2 className="text-lg font-bold mb-4">Logs Recientes</h2>
            <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="p-3 text-left">Hora</th>
                            <th className="p-3 text-left">Acción</th>
                            <th className="p-3 text-left">IP</th>
                            <th className="p-3 text-left">Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.recentLogs?.map(log => (
                            <tr key={log._id} className="border-t">
                                <td className="p-3">{new Date(log.createdAt).toLocaleTimeString()}</td>
                                <td className="p-3 font-medium">{log.action}</td>
                                <td className="p-3 text-gray-500 font-mono text-xs">{log.ip}</td>
                                <td className="p-3 text-gray-500">{JSON.stringify(log.details)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SecurityDashboard;
