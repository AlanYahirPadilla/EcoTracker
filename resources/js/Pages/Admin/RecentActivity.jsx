"use client"

import AdminLayout from "@/Layouts/AdminLayout"
import { Head } from "@inertiajs/react"
import { Activity, Search, Filter, Recycle, Gift, CheckCircle, XCircle, Clock } from "lucide-react"
import { useState } from "react"

export default function RecentActivity({ auth, recentActivity = [] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all") // 'all', 'recycling', 'redemption'

  // Aseguramos que recentActivity sea siempre un array
  const safeActivity = recentActivity || []

  // Filtrar actividad según el término de búsqueda y el filtro
  const filteredActivity = safeActivity.filter((activity) => {
    if (!activity) return false

    const matchesSearch =
      (activity.user || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.description || "").toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filter === "all" ||
      (filter === "recycling" && activity.type === "recycling") ||
      (filter === "redemption" && activity.type === "redemption")

    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status, type) => {
    if (type === "recycling") {
      switch (status) {
        case "approved":
          return <CheckCircle className="h-5 w-5 text-green-600" />
        case "rejected":
          return <XCircle className="h-5 w-5 text-red-600" />
        default:
          return <Clock className="h-5 w-5 text-yellow-600" />
      }
    } else {
      switch (status) {
        case "completed":
          return <CheckCircle className="h-5 w-5 text-green-600" />
        default:
          return <Clock className="h-5 w-5 text-yellow-600" />
      }
    }
  }

  const getStatusText = (status, type) => {
    if (type === "recycling") {
      switch (status) {
        case "approved":
          return "Aprobado"
        case "rejected":
          return "Rechazado"
        default:
          return "Pendiente"
      }
    } else {
      switch (status) {
        case "completed":
          return "Completado"
        default:
          return "Pendiente"
      }
    }
  }

  return (
    <AdminLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Actividad Reciente</h2>}
    >
      <Head title="Actividad Reciente" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-medium">Actividad Reciente</h3>
            </div>

            {/* Filtros y búsqueda */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2.5"
                  placeholder="Buscar por usuario o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="recycling">Reciclaje</option>
                  <option value="redemption">Canjes</option>
                </select>
              </div>
            </div>

            {filteredActivity.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay actividad reciente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivity.map((activity) => (
                  <div
                    key={`${activity.type}-${activity.id}`}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              activity.type === "recycling" ? "bg-green-100" : "bg-amber-100"
                            }`}
                          >
                            {activity.type === "recycling" ? (
                              <Recycle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Gift className="h-5 w-5 text-amber-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{activity.user}</p>
                              <span className="text-xs text-gray-500">{activity.date_formatted}</span>
                            </div>
                            <p className="text-gray-600 mt-1">{activity.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  activity.status === "approved" || activity.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : activity.status === "rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {getStatusIcon(activity.status, activity.type)}
                                <span className="ml-1">{getStatusText(activity.status, activity.type)}</span>
                              </span>
                              <span className="text-sm font-medium text-green-600">{activity.points} pts</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                            {activity.type === "recycling" ? activity.ticket_number : activity.redemption_code}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

