"use client"

import AdminLayout from "@/Layouts/AdminLayout"
import { Head } from "@inertiajs/react"
import { Gift, Search, Filter, CheckCircle, Clock } from "lucide-react"
import { useState, useEffect } from "react"

export default function AllRedemptions({ auth, redemptions = [] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // 'all', 'pending', 'completed'
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [records, setRecords] = useState([])

  // Usar los datos reales directamente
  useEffect(() => {
    console.log("Datos de canjes recibidos:", redemptions)
    setRecords(redemptions)
  }, [redemptions])

  // Obtener categorías únicas para el filtro
  const categories = [
    ...new Set(records.filter((r) => r && r.reward && r.reward.category).map((r) => r.reward.category)),
  ]

  // Filtrar canjes según los términos de búsqueda y filtros
  const filteredRedemptions = records.filter((redemption) => {
    if (!redemption || !redemption.user || !redemption.reward) return false

    const matchesSearch =
      (redemption.user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (redemption.user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (redemption.reward.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (redemption.redemption_code || "").toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && redemption.status === "pending") ||
      (statusFilter === "completed" && redemption.status === "completed")

    const matchesCategory = categoryFilter === "all" || redemption.reward.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <AdminLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Historial de Canjes</h2>}
    >
      <Head title="Historial de Canjes" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Gift className="h-6 w-6 text-amber-600" />
              <h3 className="text-lg font-medium">Historial de Canjes</h3>
            </div>

            {/* Filtros y búsqueda */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 p-2.5"
                  placeholder="Buscar por usuario, recompensa o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendientes</option>
                  <option value="completed">Completados</option>
                </select>

                {categories.length > 0 && (
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {filteredRedemptions.length === 0 ? (
              <div className="text-center py-8">
                <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay canjes que coincidan con los filtros</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Usuario
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Recompensa
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Puntos
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Código
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Estado
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Fecha de Canje
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Fecha de Uso
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRedemptions.map((redemption) => (
                      <tr key={redemption.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{redemption.user.name}</div>
                          <div className="text-sm text-gray-500">{redemption.user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{redemption.reward.name}</div>
                          <div className="text-xs text-gray-500 capitalize">{redemption.reward.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-600">
                          {redemption.points_spent}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{redemption.redemption_code}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              redemption.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {redemption.status === "completed" ? (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            ) : (
                              <Clock className="h-4 w-4 mr-1" />
                            )}
                            {redemption.status === "completed" ? "Completado" : "Pendiente"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {redemption.date_formatted}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {redemption.completed_at || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}


