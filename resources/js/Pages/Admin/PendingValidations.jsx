"use client"

import { Head } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"
import { Clock, Check, X } from 'lucide-react'
import { useState } from "react"
import axios from "axios"

export default function PendingValidations({ auth, pendingRecords = [] }) {
  // Aseguramos que pendingRecords sea siempre un array
  const [records, setRecords] = useState(pendingRecords || [])

  const handleApprove = async (id) => {
    try {
      await axios.post(`/admin/validations/${id}/approve`)
      // Aseguramos que records existe antes de filtrar
      setRecords((prevRecords) => prevRecords.filter((record) => record.id !== id))
    } catch (error) {
      console.error("Error al aprobar:", error)
      alert("Error al aprobar la validación")
    }
  }

  const handleReject = async (id) => {
    try {
      await axios.post(`/admin/validations/${id}/reject`)
      // Aseguramos que records existe antes de filtrar
      setRecords((prevRecords) => prevRecords.filter((record) => record.id !== id))
    } catch (error) {
      console.error("Error al rechazar:", error)
      alert("Error al rechazar la validación")
    }
  }

  return (
    <AdminLayout user={auth.user}>
      <Head title="Validaciones Pendientes" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Validaciones Pendientes</h1>
        <p className="mt-1 text-sm text-gray-600">Revisa y aprueba las solicitudes de reciclaje</p>

        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
          {records.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {records.map((record) => (
                <li key={record.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {record.user_name} - {record.material}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pendiente
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {record.quantity} unidades - {record.points_earned} puntos
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>{record.created_at}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end space-x-3">
                      <button
                        onClick={() => handleReject(record.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Rechazar
                      </button>
                      <button
                        onClick={() => handleApprove(record.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Aprobar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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

