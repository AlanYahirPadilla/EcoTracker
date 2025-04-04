"use client"

import { Head } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"
import { Clock, Search, Check, X } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"

export default function PendingValidations({ auth, pendingRecords = [] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [records, setRecords] = useState([])

  // Usar los datos reales directamente
  useEffect(() => {
    console.log("Datos recibidos del servidor:", pendingRecords)
    setRecords(pendingRecords)
  }, [pendingRecords])

  // Filtrar registros según el término de búsqueda
  const filteredRecords = records.filter(
    (record) =>
      (record.user_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.user_email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.material || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.ticket_number || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleApprove = async (id) => {
    try {
      await axios.post(`/admin/validations/${id}/approve`)

      // Actualizar el estado local
      setRecords((prevRecords) => prevRecords.filter((record) => record.id !== id))
    } catch (error) {
      console.error("Error al aprobar:", error)
      alert("Error al aprobar la validación")
    }
  }

  const handleReject = async (id) => {
    try {
      await axios.post(`/admin/validations/${id}/reject`)

      // Actualizar el estado local
      setRecords((prevRecords) => prevRecords.filter((record) => record.id !== id))
    } catch (error) {
      console.error("Error al rechazar:", error)
      alert("Error al rechazar la validación")
    }
  }

  return (
    <AdminLayout user={auth.user}>
      <Head title="Validaciones Pendientes" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-900">Validaciones Pendientes</h1>

        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-medium">Validaciones Pendientes</h2>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                placeholder="Buscar por usuario, material, ticket..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredRecords.length > 0 ? (
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
                      Material
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Cantidad
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
                      Fecha
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ticket
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{record.user_name}</div>
                        <div className="text-sm text-gray-500">{record.user_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.material}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {record.points_earned}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.created_at}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                        {record.ticket_number || `ECO-${record.id.toString().padStart(4, "0")}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(record.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Aprobar"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleReject(record.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Rechazar"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay validaciones pendientes</h3>
              <p className="mt-1 text-sm text-gray-500">Todas las solicitudes de reciclaje han sido procesadas.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

