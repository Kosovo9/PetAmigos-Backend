'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { MetricCard, Tabs, Card, LoadingSpinner } from '@/components/shared/UIComponents';
import {
    Target, Eye, MousePointer, DollarSign, TrendingUp, BarChart, Plus,
    Download, Filter, Calendar, CreditCard
} from 'lucide-react';

export default function AdvertiserDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setMetrics({
                totalSpent: 1249.50,
                impressions: 45230,
                clicks: 1156,
                ctr: 2.56,
                activeCampaigns: 3,
                budget: 2000,
                conversions: 45
            });
            setLoading(false);
        }, 800);
    }, []);

    if (loading) return <LoadingSpinner size="lg" />;

    const tabs = [
        { id: 'overview', label: 'Resumen', icon: <BarChart className="h-4 w-4" /> },
        { id: 'campaigns', label: 'Campañas', icon: <Target className="h-4 w-4" /> },
        { id: 'analytics', label: 'Analíticas', icon: <TrendingUp className="h-4 w-4" /> },
        { id: 'billing', label: 'Facturación', icon: <CreditCard className="h-4 w-4" /> },
    ];

    return (
        <ProtectedRoute allowedRoles={['advertiser']}>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="bg-white border-b shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Target className="h-8 w-8 text-blue-600" />
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Dashboard de Anunciante</h1>
                                    <p className="text-gray-600">Veterinaria Central</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
                                    <Plus className="h-4 w-4" />
                                    <span>Nueva Campaña</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <MetricCard
                                    title="Total Gastado"
                                    value={`$${metrics.totalSpent.toLocaleString()}`}
                                    icon={<DollarSign className="h-6 w-6 text-green-600" />}
                                    change="+12.5%"
                                    trend="up"
                                />
                                <MetricCard
                                    title="Impresiones"
                                    value={metrics.impressions.toLocaleString()}
                                    icon={<Eye className="h-6 w-6 text-blue-600" />}
                                    change="+8.1%"
                                    trend="up"
                                />
                                <MetricCard
                                    title="Clics"
                                    value={metrics.clicks.toLocaleString()}
                                    icon={<MousePointer className="h-6 w-6 text-purple-600" />}
                                    change="+15.3%"
                                    trend="up"
                                />
                                <MetricCard
                                    title="CTR"
                                    value={`${metrics.ctr}%`}
                                    icon={<TrendingUp className="h-6 w-6 text-orange-600" />}
                                    change="+0.5%"
                                    trend="up"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <Card className="lg:col-span-2">
                                    <h3 className="text-lg font-bold mb-4">Rendimiento de Campañas</h3>
                                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Gráfico de rendimiento (integrar Recharts)</p>
                                    </div>
                                </Card>

                                <Card>
                                    <h3 className="text-lg font-bold mb-4">Recomendaciones AI</h3>
                                    <div className="space-y-3">
                                        {[
                                            { type: 'Optimización', text: 'CTR bajo detectado en campaña "Vacunas 2024"', priority: 'high' },
                                            { type: 'Presupuesto', text: 'Aumenta presupuesto en horario 2-6 PM', priority: 'medium' },
                                            { type: 'Audiencia', text: 'Prueba targeting por raza de mascota', priority: 'low' },
                                        ].map((rec, i) => (
                                            <div key={i} className={`p-3 rounded-lg border-l-4 ${rec.priority === 'high' ? 'border-red-500 bg-red-50' :
                                                    rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                                                        'border-blue-500 bg-blue-50'
                                                }`}>
                                                <p className="font-semibold text-sm">{rec.type}</p>
                                                <p className="text-xs text-gray-700 mt-1">{rec.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold">Campañas Activas</h3>
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                            {metrics.activeCampaigns} activas
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Vacunas 2024', budget: '$500', spent: '$345', status: 'Activa' },
                                            { name: 'Consultas Gratis', budget: '$300', spent: '$178', status: 'Activa' },
                                            { name: 'Productos Premium', budget: '$700', spent: '$726', status: 'Pausada' },
                                        ].map((campaign, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium">{campaign.name}</p>
                                                    <p className="text-sm text-gray-500">Presupuesto: {campaign.budget}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">{campaign.spent}</p>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${campaign.status === 'Activa' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {campaign.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card>
                                    <h3 className="text-lg font-bold mb-4">Insights de Audiencia</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm text-gray-600">Dueños de perros</span>
                                                <span className="text-sm font-semibold">65%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm text-gray-600">Dueños de gatos</span>
                                                <span className="text-sm font-semibold">35%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                                            </div>
                                        </div>
                                        <div className="pt-3 border-t">
                                            <p className="text-sm text-gray-600 mb-2">Horarios de mayor engagement:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {['9-11 AM', '2-4 PM', '8-10 PM'].map((time, i) => (
                                                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                        {time}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === 'campaigns' && (
                        <Card>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold">Todas las Campañas</h3>
                                <div className="flex items-center space-x-3">
                                    <select className="border rounded-lg px-3 py-2">
                                        <option>Todas</option>
                                        <option>Activas</option>
                                        <option>Pausadas</option>
                                        <option>Finalizadas</option>
                                    </select>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3">Campaña</th>
                                            <th className="text-left py-3">Estado</th>
                                            <th className="text-left py-3">Impresiones</th>
                                            <th className="text-left py-3">CTR</th>
                                            <th className="text-left py-3">Gasto</th>
                                            <th className="text-left py-3">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { name: 'Vacunas 2024', status: 'Activa', impressions: 12450, ctr: '3.2%', spent: '$345' },
                                            { name: 'Consultas Gratis', status: 'Activa', impressions: 8920, ctr: '2.1%', spent: '$178' },
                                            { name: 'Productos Premium', status: 'Pausada', impressions: 23860, ctr: '1.9%', spent: '$726' },
                                        ].map((camp, i) => (
                                            <tr key={i} className="border-b hover:bg-gray-50">
                                                <td className="py-3 font-medium">{camp.name}</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${camp.status === 'Activa' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {camp.status}
                                                    </span>
                                                </td>
                                                <td className="py-3">{camp.impressions.toLocaleString()}</td>
                                                <td className="py-3 font-semibold text-blue-600">{camp.ctr}</td>
                                                <td className="py-3 font-bold">{camp.spent}</td>
                                                <td className="py-3">
                                                    <button className="text-blue-600 hover:text-blue-800 text-sm">Editar</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'billing' && (
                        <Card>
                            <h3 className="text-xl font-bold mb-6">Historial de Facturación</h3>
                            <div className="space-y-3">
                                {[
                                    { date: '2024-12-01', amount: '$49.00', status: 'Pagado', plan: 'Professional' },
                                    { date: '2024-11-01', amount: '$49.00', status: 'Pagado', plan: 'Professional' },
                                    { date: '2024-10-01', amount: '$49.00', status: 'Pagado', plan: 'Professional' },
                                ].map((invoice, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-semibold">{invoice.date}</p>
                                            <p className="text-sm text-gray-600">Plan: {invoice.plan}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="font-bold">{invoice.amount}</p>
                                                <span className="text-xs text-green-600">{invoice.status}</span>
                                            </div>
                                            <button className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100">
                                                Descargar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
