"use client"

import { Head, Link } from "@inertiajs/react"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

export default function Error500() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Head title="Error del servidor" />

      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Error del servidor</h1>
          <p className="text-gray-600 mb-6">
            Ha ocurrido un error interno en el servidor. Por favor, inténtalo de nuevo más tarde.
          </p>

          <div className="flex gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
            >
              <Home className="h-4 w-4" />
              Inicio
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <RefreshCw className="h-4 w-4" />
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

