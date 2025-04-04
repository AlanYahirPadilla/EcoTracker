"use client"

import AdminLayout from "@/Layouts/AdminLayout"
import { Head } from "@inertiajs/react"
import { BarChart3, PieChart, LineChart, Download } from "lucide-react"

export default function ReportsIndex({ auth }) {
  return (
    <AdminLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Reportes</h2>}
    >
      <Head title="Reportes" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-medium">Reportes y Estadísticas</h3>
              </div>
              <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                <Download className="h-4 w-4" />
                <span>Exportar Datos</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium">Reciclaje por Material</h4>
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-gray-500">Gráfico de barras (en desarrollo)</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="h-5 w-5 text-green-600" />
                  <h4 className="font-medium">Distribución de Puntos</h4>
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-gray-500">Gráfico circular (en desarrollo)</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <LineChart className="h-5 w-5 text-amber-600" />
                  <h4 className="font-medium">Tendencia de Reciclaje</h4>
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  <p className="text-gray-500">Gráfico de líneas (en desarrollo)</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-4">Resumen de Actividad</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Métrica
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Último Mes
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tendencia
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Materiales Reciclados
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">250 unidades</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1,250 unidades</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+15%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Puntos Generados
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1,200 pts</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5,800 pts</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+8%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Recompensas Canjeadas
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">45</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">210</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-3%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Nuevos Usuarios</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">120</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+22%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

