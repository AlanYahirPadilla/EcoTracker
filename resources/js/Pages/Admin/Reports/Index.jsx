"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/Layouts/AdminLayout"
import { Head } from "@inertiajs/react"
import { BarChart3, PieChartIcon, LineChartIcon, Download, AlertTriangle } from "lucide-react"
import axios from "axios"

// Importar componentes de gráficos
import BarChart from "@/Components/Charts/BarChart"
import PieChart from "@/Components/Charts/PieChart"
import LineChart from "@/Components/Charts/LineChart"

export default function ReportsIndex({
  auth,
  recyclingByMaterial,
  pointsDistribution,
  recyclingTrend,
  activitySummary,
}) {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Verificar que los datos están en el formato correcto
  useEffect(() => {
    try {
      // Validar que los datos existen y tienen el formato correcto
      if (!recyclingByMaterial || !recyclingByMaterial.labels || !recyclingByMaterial.datasets) {
        throw new Error("Datos de reciclaje por material inválidos")
      }
      if (!pointsDistribution || !pointsDistribution.labels || !pointsDistribution.datasets) {
        throw new Error("Datos de distribución de puntos inválidos")
      }
      if (!recyclingTrend || !recyclingTrend.labels || !recyclingTrend.datasets) {
        throw new Error("Datos de tendencia de reciclaje inválidos")
      }
      if (!activitySummary) {
        throw new Error("Datos de resumen de actividad inválidos")
      }

      setError(null)
    } catch (err) {
      console.error("Error en los datos:", err)
      setError("Los datos proporcionados no tienen el formato correcto. Por favor, contacta al administrador.")
    }
  }, [recyclingByMaterial, pointsDistribution, recyclingTrend, activitySummary])

  const handleExportData = async () => {
    try {
      const response = await axios.post("/admin/reports/export")
      alert(response.data.message)
    } catch (err) {
      console.error("Error al exportar datos:", err)
      alert("Error al exportar datos. Por favor, intenta de nuevo.")
    }
  }

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
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Datos</span>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                <p className="mt-2 text-gray-500">Cargando gráficos...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium">Reciclaje por Material</h4>
                    </div>
                    <div className="h-64 relative">
                      {recyclingByMaterial && <BarChart data={recyclingByMaterial} />}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <PieChartIcon className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium">Distribución de Puntos</h4>
                    </div>
                    <div className="h-64 relative">{pointsDistribution && <PieChart data={pointsDistribution} />}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <LineChartIcon className="h-5 w-5 text-amber-600" />
                      <h4 className="font-medium">Tendencia de Reciclaje</h4>
                    </div>
                    <div className="h-64 relative">{recyclingTrend && <LineChart data={recyclingTrend} />}</div>
                  </div>
                </div>

                {activitySummary && (
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
                          {activitySummary.materialsRecycled && (
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                Materiales Reciclados
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {activitySummary.materialsRecycled.lastMonth} unidades
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {activitySummary.materialsRecycled.total} unidades
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span
                                  className={
                                    activitySummary.materialsRecycled.trend >= 0 ? "text-green-600" : "text-red-600"
                                  }
                                >
                                  {activitySummary.materialsRecycled.trend >= 0 ? "+" : ""}
                                  {activitySummary.materialsRecycled.trend}%
                                </span>
                              </td>
                            </tr>
                          )}

                          {activitySummary.pointsGenerated && (
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                Puntos Generados
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {activitySummary.pointsGenerated.lastMonth} pts
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {activitySummary.pointsGenerated.total} pts
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span
                                  className={
                                    activitySummary.pointsGenerated.trend >= 0 ? "text-green-600" : "text-red-600"
                                  }
                                >
                                  {activitySummary.pointsGenerated.trend >= 0 ? "+" : ""}
                                  {activitySummary.pointsGenerated.trend}%
                                </span>
                              </td>
                            </tr>
                          )}

                          {activitySummary.redemptions && (
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                Recompensas Canjeadas
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {activitySummary.redemptions.lastMonth}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {activitySummary.redemptions.total}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span
                                  className={activitySummary.redemptions.trend >= 0 ? "text-green-600" : "text-red-600"}
                                >
                                  {activitySummary.redemptions.trend >= 0 ? "+" : ""}
                                  {activitySummary.redemptions.trend}%
                                </span>
                              </td>
                            </tr>
                          )}

                          {activitySummary.newUsers && (
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                Nuevos Usuarios
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {activitySummary.newUsers.lastMonth}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {activitySummary.newUsers.total}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span
                                  className={activitySummary.newUsers.trend >= 0 ? "text-green-600" : "text-red-600"}
                                >
                                  {activitySummary.newUsers.trend >= 0 ? "+" : ""}
                                  {activitySummary.newUsers.trend}%
                                </span>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

