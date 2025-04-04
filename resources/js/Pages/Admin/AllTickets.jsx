"use client"

import * as React from "react"
import AdminLayout from "@/Layouts/AdminLayout"
import { Head } from "@inertiajs/react"
import { Ticket, Search, Filter, CheckCircle, XCircle, Clock } from "lucide-react"
import { useState } from "react"

export default function AllTickets({ auth, tickets = [] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // 'all', 'pending', 'approved', 'rejected'
  const [materialFilter, setMaterialFilter] = useState("all")
  const [expandedId, setExpandedId] = useState(null)

  // Aseguramos que tickets sea siempre un array
  const safeTickets = tickets || []

  // Obtener materiales únicos para el filtro
  const materials = [...new Set(safeTickets.filter((t) => t && t.material).map((t) => t.material.name))]

  // Filtrar tickets según los términos de búsqueda y filtros
  const filteredTickets = safeTickets.filter((ticket) => {
    if (!ticket || !ticket.material || !ticket.user) return false

    const matchesSearch =
      (ticket.user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.material.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.ticket_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.location || "").toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter

    const matchesMaterial = materialFilter === "all" || ticket.material.name === materialFilter

    return matchesSearch && matchesStatus && matchesMaterial
  })

  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            Aprobado
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-4 w-4 mr-1" />
            Rechazado
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-4 w-4 mr-1" />
            Pendiente
          </span>
        )
    }
  }

  return (
    <AdminLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tickets de Reciclaje</h2>}
    >
      <Head title="Tickets de Reciclaje" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Ticket className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-medium">Tickets de Reciclaje</h3>
            </div>

            {/* Filtros y búsqueda */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5"
                  placeholder="Buscar por usuario, material, ticket..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendientes</option>
                  <option value="approved">Aprobados</option>
                  <option value="rejected">Rechazados</option>
                </select>

                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5"
                  value={materialFilter}
                  onChange={(e) => setMaterialFilter(e.target.value)}
                >
                  <option value="all">Todos los materiales</option>
                  {materials.map((material) => (
                    <option key={material} value={material}>
                      {material}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredTickets.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay tickets que coincidan con los filtros</p>
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
                        Ticket
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
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTickets.map((ticket) => (
                      <React.Fragment key={ticket.id}>
                        <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleDetails(ticket.id)}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{ticket.user.name}</div>
                            <div className="text-sm text-gray-500">{ticket.user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.material.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            {ticket.points_earned}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{ticket.ticket_number}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(ticket.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.date_formatted}</td>
                        </tr>
                        {expandedId === ticket.id && (
                          <tr className="bg-gray-50">
                            <td colSpan="7" className="px-6 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">Ubicación</h4>
                                  <p className="text-sm text-gray-600">{ticket.location}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 mb-2">Comentarios</h4>
                                  <p className="text-sm text-gray-600">{ticket.comments || "Sin comentarios"}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
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




