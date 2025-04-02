"use client"

import { useEffect } from "react"
import { Head, Link } from "@inertiajs/react"
import { AlertTriangle, LogIn } from "lucide-react"

export default function AuthError({ status, message }) {
  useEffect(() => {
    console.error(`Error de autenticación ${status}: ${message}`)
  }, [status, message])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Head title={`Error de autenticación ${status}`} />

      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Error de autenticación</h1>
          <p className="text-gray-600 mb-6">{message || "Ha ocurrido un error durante el proceso de autenticación."}</p>

          <div className="flex gap-4">
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <LogIn className="h-4 w-4" />
              Volver a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

