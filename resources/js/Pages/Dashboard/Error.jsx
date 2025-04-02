"use client"

import { useEffect } from "react"
import { Head, Link } from "@inertiajs/react"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function DashboardError({ status, message }) {
  useEffect(() => {
    console.error(`Error del dashboard ${status}: ${message}`)
  }, [status, message])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Head title={`Error del dashboard ${status}`} />

      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Error del dashboard</h1>
          <p className="text-gray-600 mb-6">{message || "Ha ocurrido un error al cargar el dashboard."}</p>

          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <RefreshCw className="h-4 w-4" />
              Intentar de nuevo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

