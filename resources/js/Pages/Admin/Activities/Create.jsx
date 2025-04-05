"use client"

import AdminLayout from "@/Layouts/AdminLayout"
import { Head, useForm } from "@inertiajs/react"
import { Calendar, MapPin, Award, Clock, ArrowLeft } from "lucide-react"

export default function CreateActivity({ auth }) {
  const { data, setData, post, processing, errors } = useForm({
    title: "",
    description: "",
    date: "",
    time_start: "",
    time_end: "",
    location: "CUCEI",
    building: "",
    points_reward: 0,
    is_active: true,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post(route("admin.activities.store"), {
      onSuccess: () => {
        // Manejar éxito
      },
      onError: (errors) => {
        // Manejar errores
        console.error("Errores de validación:", errors)
      },
    })
  }

  return (
    <AdminLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Crear Nueva Actividad</h2>}
    >
      <Head title="Crear Actividad" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-4">
            <a href="/admin/activities" className="flex items-center text-green-600 hover:text-green-800">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver a actividades
            </a>
          </div>

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <form onSubmit={handleSubmit} method="POST">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Título */}
                <div className="col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Título
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                    required
                  />
                  {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                </div>

                {/* Fecha */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Fecha
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="date"
                      className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={data.date}
                      onChange={(e) => setData("date", e.target.value)}
                      required
                    />
                  </div>
                  {errors.date && <div className="text-red-500 text-sm mt-1">{errors.date}</div>}
                </div>

                {/* Hora de inicio y fin */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="time_start" className="block text-sm font-medium text-gray-700">
                      Hora de inicio
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        id="time_start"
                        className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        value={data.time_start}
                        onChange={(e) => setData("time_start", e.target.value)}
                        required
                      />
                    </div>
                    {errors.time_start && <div className="text-red-500 text-sm mt-1">{errors.time_start}</div>}
                  </div>

                  <div>
                    <label htmlFor="time_end" className="block text-sm font-medium text-gray-700">
                      Hora de fin
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        id="time_end"
                        className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        value={data.time_end}
                        onChange={(e) => setData("time_end", e.target.value)}
                        required
                      />
                    </div>
                    {errors.time_end && <div className="text-red-500 text-sm mt-1">{errors.time_end}</div>}
                  </div>
                </div>

                {/* Ubicación */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Ubicación
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={data.location}
                      onChange={(e) => setData("location", e.target.value)}
                      required
                    />
                  </div>
                  {errors.location && <div className="text-red-500 text-sm mt-1">{errors.location}</div>}
                </div>

                {/* Edificio */}
                <div>
                  <label htmlFor="building" className="block text-sm font-medium text-gray-700">
                    Edificio
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="building"
                      className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={data.building}
                      onChange={(e) => setData("building", e.target.value)}
                    />
                  </div>
                  {errors.building && <div className="text-red-500 text-sm mt-1">{errors.building}</div>}
                </div>

                {/* Puntos de recompensa */}
                <div>
                  <label htmlFor="points_reward" className="block text-sm font-medium text-gray-700">
                    Puntos de recompensa
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Award className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="points_reward"
                      min="0"
                      className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={data.points_reward}
                      onChange={(e) => setData("points_reward", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                  {errors.points_reward && <div className="text-red-500 text-sm mt-1">{errors.points_reward}</div>}
                </div>

                {/* Estado */}
                <div>
                  <div className="flex items-center">
                    <input
                      id="is_active"
                      type="checkbox"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      checked={data.is_active}
                      onChange={(e) => setData("is_active", e.target.checked)}
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                      Actividad activa
                    </label>
                  </div>
                  {errors.is_active && <div className="text-red-500 text-sm mt-1">{errors.is_active}</div>}
                </div>

                {/* Descripción */}
                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    required
                  ></textarea>
                  {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 focus:outline-none focus:border-green-900 focus:ring focus:ring-green-300 disabled:opacity-25 transition"
                  disabled={processing}
                >
                  {processing ? "Guardando..." : "Guardar Actividad"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

