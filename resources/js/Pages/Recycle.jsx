"use client"

import { useState } from "react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link, usePage } from "@inertiajs/react"
import { Recycle } from "lucide-react"
import axios from "axios"

export default function RecyclePage({ auth, materials = [] }) {
  const { url } = usePage()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [ticketNumber, setTicketNumber] = useState("")
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    material_id: "",
    quantity: "",
    location: "",
    comments: "",
  })
  const [estimatedPoints, setEstimatedPoints] = useState(0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Calculate estimated points when material or quantity changes
    if (name === "material_id" || name === "quantity") {
      calculateEstimatedPoints({
        ...formData,
        [name]: value,
      })
    }
  }

  const calculateEstimatedPoints = (data) => {
    const { material_id, quantity } = data
    if (material_id && quantity) {
      const material = materials.find((m) => m.id.toString() === material_id.toString())
      if (material) {
        const points = material.points_per_unit * Number.parseInt(quantity)
        setEstimatedPoints(points)
        return points
      }
    }
    setEstimatedPoints(0)
    return 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      // Usar una URL directa en lugar de route()
      const response = await axios.post("/recycling-records", formData)
      setSuccess(true)
      setTicketNumber(response.data.ticket_number)
    } catch (err) {
      setError(err.response?.data?.message || "Error al enviar el registro")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Registrar Reciclaje</h2>}
    >
      <Head title="Registrar Reciclaje" />

      <div className="py-12">
        <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
          {!success ? (
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Recycle className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold">Registrar Reciclaje</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Registra los materiales que has reciclado para obtener puntos. Un encargado validará tu registro.
              </p>

              {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

              {loading ? (
                <p className="text-center py-4">Cargando...</p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="material_id" className="block text-sm font-medium text-gray-700 mb-1">
                      Material Reciclado
                    </label>
                    <select
                      id="material_id"
                      name="material_id"
                      value={formData.material_id}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    >
                      <option value="">Selecciona un material</option>
                      {materials.map((material) => (
                        <option key={material.id} value={material.id}>
                          {material.name} ({material.points_per_unit} pts por unidad)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      max="50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Cantidad (máximo 50 por registro)"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Ej: Módulo A, Contenedor Principal"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                      Comentarios (Opcional)
                    </label>
                    <textarea
                      id="comments"
                      name="comments"
                      value={formData.comments}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Comentarios adicionales"
                      rows="3"
                    />
                  </div>

                  {estimatedPoints > 0 && (
                    <div className="p-4 bg-green-50 rounded-md">
                      <p className="font-medium">
                        Puntos estimados: <span className="text-green-600 font-bold">{estimatedPoints}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Estos puntos se acreditarán a tu cuenta después de la validación.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {submitting ? "Enviando..." : "Registrar Reciclaje"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Recycle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">¡Registro Exitoso!</h2>
                <p className="mb-4">Tu registro de reciclaje ha sido enviado correctamente.</p>

                <div className="p-4 bg-gray-50 rounded-md mb-4">
                  <p className="font-medium mb-1">
                    Número de ticket: <span className="font-bold">{ticketNumber}</span>
                  </p>
                  <p className="text-sm text-gray-500">Guarda este número para futuras referencias.</p>
                </div>

                <p className="text-green-600 font-medium">
                  Puntos estimados: {estimatedPoints}
                  <span className="text-gray-500 text-sm ml-2">(pendiente de validación)</span>
                </p>

                <div className="mt-6 flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setSuccess(false)
                      setFormData({
                        material_id: "",
                        quantity: "",
                        location: "",
                        comments: "",
                      })
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  >
                    Nuevo Registro
                  </button>
                  <Link href="/dashboard" className="px-4 py-2 bg-green-600 text-white rounded-md">
                    Volver al Dashboard
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}




