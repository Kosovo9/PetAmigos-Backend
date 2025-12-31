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
  Heart,
  DollarSign,
  Users,
  Home,
  FileText,
  Image,
  TrendingUp,
  Plus,
  Download,
  CheckCircle,
  Award,
  Calendar,
} from "lucide-react";

export default function ShelterDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMetrics({
        totalReceived: 8450.5,
        animalsHelped: 245,
        activeProjects: 3,
        completedProjects: 12,
        transparencyScore: 98,
        supporters: 156,
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;

  const tabs = [
    { id: "overview", label: "Resumen", icon: <Heart className="h-4 w-4" /> },
    {
      id: "donations",
      label: "Donaciones",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      id: "projects",
      label: "Proyectos",
      icon: <FileText className="h-4 w-4" />,
    },
    { id: "impact", label: "Impacto", icon: <Image className="h-4 w-4" /> },
  ];

  return (
    <ProtectedRoute allowedRoles={["shelter"]}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Heart className="h-8 w-8 text-red-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard del Refugio
                  </h1>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-600">Refugio Los Amigos</p>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Verificado</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center space-x-2 hover:bg-red-700">
                  <Plus className="h-4 w-4" />
                  <span>Nuevo Proyecto</span>
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
                  title="Total Recibido"
                  value={`$${metrics.totalReceived.toLocaleString()}`}
                  icon={<DollarSign className="h-6 w-6 text-green-600" />}
                  change="+15%"
                  trend="up"
                />
                <MetricCard
                  title="Animales Ayudados"
                  value={metrics.animalsHelped}
                  icon={<Users className="h-6 w-6 text-blue-600" />}
                  change="+20"
                  trend="up"
                />
                <MetricCard
                  title="Proyectos Activos"
                  value={metrics.activeProjects}
                  icon={<FileText className="h-6 w-6 text-purple-600" />}
                  change={`${metrics.completedProjects} completados`}
                />
                <MetricCard
                  title="Transparencia"
                  value={`${metrics.transparencyScore}/100`}
                  icon={<Award className="h-6 w-6 text-orange-600" />}
                  change="Excelente"
                  trend="up"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <h3 className="text-lg font-bold mb-4">
                    Donaciones Recientes
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        date: "2024-12-15",
                        amount: "$567.50",
                        source: "Distribución Mensual",
                        status: "Recibido",
                      },
                      {
                        date: "2024-11-15",
                        amount: "$524.30",
                        source: "Distribución Mensual",
                        status: "Recibido",
                      },
                      {
                        date: "2024-10-15",
                        amount: "$489.70",
                        source: "Distribución Mensual",
                        status: "Recibido",
                      },
                    ].map((donation, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold">{donation.date}</p>
                          <p className="text-sm text-gray-600">
                            {donation.source}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {donation.amount}
                          </p>
                          <span className="text-xs text-green-600">
                            {donation.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <h3 className="font-bold mb-4">Próxima Distribución</h3>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">
                        $612.50
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Estimado para Jan 15, 2025
                      </p>
                      <div className="mt-4 pt-4 border-t">
                        <Calendar className="h-8 w-8 mx-auto text-gray-400" />
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <h3 className="font-bold mb-4">Comunidad</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seguidores</span>
                        <span className="font-bold">{metrics.supporters}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Impactos verificados
                        </span>
                        <span className="font-bold">24</span>
                      </div>
                      <button className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Compartir Impacto
                      </button>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <h3 className="text-lg font-bold mb-4">Proyectos Activos</h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Campaña de Vacunación",
                        budget: "$1,500",
                        raised: "$890",
                        progress: 59,
                      },
                      {
                        title: "Renovación de Instalaciones",
                        budget: "$3,000",
                        raised: "$1,245",
                        progress: 42,
                      },
                      {
                        title: "Programa de Esterilización",
                        budget: "$800",
                        raised: "$650",
                        progress: 81,
                      },
                    ].map((project, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold">{project.title}</span>
                          <span className="text-sm text-gray-600">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Recaudado: {project.raised}
                          </span>
                          <span className="text-gray-600">
                            Meta: {project.budget}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-bold mb-4">Galería de Impacto</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative group cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition flex items-center justify-center">
                          <Plus className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition" />
                        </div>
                        <img
                          src={`https://i.pravatar.cc/200?img=${i}`}
                          alt={`Impacto ${i}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Subir Foto/Video</span>
                  </button>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "donations" && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  Historial Completo de Donaciones
                </h3>
                <button className="px-4 py-2 bg-gray-100 rounded-lg flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Exportar</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Fecha</th>
                      <th className="text-left py-3">Monto</th>
                      <th className="text-left py-3">Fuente</th>
                      <th className="text-left py-3">Estado</th>
                      <th className="text-left py-3">Comprobante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        date: "2024-12-15",
                        amount: "$567.50",
                        source: "Plataforma PetMatch",
                        status: "Recibido",
                      },
                      {
                        date: "2024-11-15",
                        amount: "$524.30",
                        source: "Plataforma PetMatch",
                        status: "Recibido",
                      },
                      {
                        date: "2024-10-15",
                        amount: "$489.70",
                        source: "Plataforma PetMatch",
                        status: "Recibido",
                      },
                      {
                        date: "2024-09-15",
                        amount: "$512.00",
                        source: "Plataforma PetMatch",
                        status: "Recibido",
                      },
                    ].map((don, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-3">{don.date}</td>
                        <td className="py-3 font-bold text-green-600">
                          {don.amount}
                        </td>
                        <td className="py-3">{don.source}</td>
                        <td className="py-3">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {don.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Gestión de Proyectos</h3>
                <select className="border rounded-lg px-3 py-2">
                  <option>Todos</option>
                  <option>Activos</option>
                  <option>Completados</option>
                  <option>Pendientes</option>
                </select>
              </div>
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold mb-2">
                        Proyecto de Ejemplo {i + 1}
                      </h4>
                      <p className="text-gray-600 mb-4">
                        Descripción detallada del proyecto y su impacto esperado
                        en la comunidad de animales.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Meta</p>
                          <p className="font-semibold">$1,500</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Recaudado</p>
                          <p className="font-semibold text-green-600">$890</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Animales</p>
                          <p className="font-semibold">45</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Estado</p>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            En progreso
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="ml-4 px-4 py-2 border rounded-lg hover:bg-gray-50">
                      Editar
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "impact" && (
            <div className="space-y-6">
              <Card>
                <h3 className="text-xl font-bold mb-4">
                  Galería de Impacto Verificado
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="border rounded-lg overflow-hidden">
                      <img
                        src={`https://i.pravatar.cc/400?img=${i + 10}`}
                        alt={`Impacto ${i}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3">
                        <p className="font-semibold mb-1">
                          Campaña de Vacunación
                        </p>
                        <p className="text-sm text-gray-600">
                          15 animales vacunados - Dic 2024
                        </p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                          <span>Verificado</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
