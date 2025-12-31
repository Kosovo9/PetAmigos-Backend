"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import {
  MetricCard,
  Tabs,
  Card,
  LoadingSpinner,
} from "@/components/shared/UIComponents";
import {
  DollarSign,
  Users,
  Heart,
  TrendingUp,
  Shield,
  Package,
  Eye,
  MousePointer,
  Download,
  Filter,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setMetrics({
        totalRevenue: 45230,
        advertisers: 127,
        shelters: 43,
        donations: 1356.9,
        dailyActive: 8432,
        conversion: 3.2,
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;

  const tabs = [
    { id: "overview", label: "Resumen", icon: <Package className="h-4 w-4" /> },
    {
      id: "advertisers",
      label: "Anunciantes",
      icon: <Users className="h-4 w-4" />,
    },
    { id: "shelters", label: "Refugios", icon: <Heart className="h-4 w-4" /> },
    {
      id: "donations",
      label: "Donaciones",
      icon: <DollarSign className="h-4 w-4" />,
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard de Administrador
                  </h1>
                  <p className="text-gray-600">Panel de control completo</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <select className="border rounded-lg px-3 py-2">
                  <option>Últimos 30 días</option>
                  <option>Últimos 90 días</option>
                  <option>Este año</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Exportar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Ingresos Totales"
                  value={`$${metrics.totalRevenue.toLocaleString()}`}
                  icon={<DollarSign className="h-6 w-6 text-green-600" />}
                  change="+12.5%"
                  trend="up"
                />
                <MetricCard
                  title="Anunciantes Activos"
                  value={metrics.advertisers}
                  icon={<Users className="h-6 w-6 text-blue-600" />}
                  change="+8.3%"
                  trend="up"
                />
                <MetricCard
                  title="Refugios Verificados"
                  value={metrics.shelters}
                  icon={<Heart className="h-6 w-6 text-red-600" />}
                  change="+5.2%"
                  trend="up"
                />
                <MetricCard
                  title="Donaciones Este Mes"
                  value={`$${metrics.donations.toLocaleString()}`}
                  icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
                  change="+15.7%"
                  trend="up"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <h3 className="text-lg font-bold mb-4">Actividad Reciente</h3>
                  <div className="space-y-3">
                    {[
                      {
                        action: "Nuevo anunciante registrado",
                        user: "Veterinaria Central",
                        time: "Hace 5 min",
                      },
                      {
                        action: "Donación procesada",
                        user: "Refugio Los Amigos",
                        time: "Hace 12 min",
                      },
                      {
                        action: "Campaña aprobada",
                        user: "Pet Store Max",
                        time: "Hace 23 min",
                      },
                    ].map((activity, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.user}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-bold mb-4">
                    Métricas de Sistema
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">
                        Usuarios activos hoy
                      </span>
                      <span className="font-bold">
                        {metrics.dailyActive.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tasa de conversión</span>
                      <span className="font-bold text-green-600">
                        {metrics.conversion}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Uptime</span>
                      <span className="font-bold text-green-600">99.9%</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "advertisers" && (
            <Card>
              <h3 className="text-xl font-bold mb-4">Gestión de Anunciantes</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Empresa</th>
                      <th className="text-left py-3">Estado</th>
                      <th className="text-left py-3">Plan</th>
                      <th className="text-left py-3">Gasto Mensual</th>
                      <th className="text-left py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "Veterinaria Central",
                        status: "Activo",
                        plan: "Professional",
                        spent: "$499",
                      },
                      {
                        name: "Pet Store Max",
                        status: "Activo",
                        plan: "Basic",
                        spent: "$49",
                      },
                      {
                        name: "Clínica Veterinaria Norte",
                        status: "Pendiente",
                        plan: "Enterprise",
                        spent: "$999",
                      },
                    ].map((adv, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-3">{adv.name}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              adv.status === "Activo"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {adv.status}
                          </span>
                        </td>
                        <td className="py-3">{adv.plan}</td>
                        <td className="py-3 font-semibold">{adv.spent}</td>
                        <td className="py-3">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            Ver detalles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === "shelters" && (
            <Card>
              <h3 className="text-xl font-bold mb-4">Refugios Verificados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "Refugio Los Amigos",
                    animals: 245,
                    received: "$3,450",
                  },
                  {
                    name: "Casa de Esperanza",
                    animals: 189,
                    received: "$2,890",
                  },
                  { name: "Patitas Felices", animals: 156, received: "$2,340" },
                ].map((shelter, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 hover:shadow-lg transition"
                  >
                    <div className="flex items-center space-x-2 mb-3">
                      <Heart className="h-5 w-5 text-red-500" />
                      <h4 className="font-semibold">{shelter.name}</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Animales ayudados:
                        </span>
                        <span className="font-semibold">{shelter.animals}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total recibido:</span>
                        <span className="font-semibold text-green-600">
                          {shelter.received}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === "donations" && (
            <Card>
              <h3 className="text-xl font-bold mb-4">
                Historial de Donaciones
              </h3>
              <div className="space-y-3">
                {[
                  {
                    date: "2024-12-01",
                    amount: "$456.90",
                    refugios: 15,
                    status: "Distribuido",
                  },
                  {
                    date: "2024-11-01",
                    amount: "$423.50",
                    refugios: 14,
                    status: "Distribuido",
                  },
                  {
                    date: "2024-10-01",
                    amount: "$476.50",
                    refugios: 15,
                    status: "Distribuido",
                  },
                ].map((donation, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{donation.date}</p>
                      <p className="text-sm text-gray-600">
                        {donation.refugios} refugios beneficiados
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {donation.amount}
                      </p>
                      <p className="text-xs text-gray-500">{donation.status}</p>
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
