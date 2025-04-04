import { Head } from "@inertiajs/react"
import { Link } from "@inertiajs/react"

export default function Fallback({ status = 404, message = "Página no encontrada" }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Head title={`Error ${status}`} />

      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Error {status}</h1>
        <p className="text-lg text-gray-600 mb-6">{message}</p>

        <div className="flex flex-col gap-4">
          <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Volver al inicio
          </Link>

          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Ir al dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

