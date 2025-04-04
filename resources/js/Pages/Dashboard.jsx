"use client"

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link } from "@inertiajs/react"
import { BarChart3, Recycle, Gift, Clock, MapPin, Calendar, Award, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Dashboard({ auth, stats, recentRecords, availableRewards, nextActivity }) {
  const [upcomingActivities, setUpcomingActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastActivityEnded, setLastActivityEnded] = useState(false)
  const [noActivitiesScheduled, setNoActivitiesScheduled] = useState(false)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        const response = await axios.get("/api/activities/upcoming")

        if (response.data && response.data.activities) {
          setUpcomingActivities(response.data.activities)

          // Verificar si no hay actividades programadas
          if (response.data.activities.length === 0) {
            setNoActivitiesScheduled(true)
          }
        } else {
          console.error("Formato de respuesta inesperado:", response.data)
          setNoActivitiesScheduled(true)
        }
      } catch (error) {
        console.error("Error fetching activities:", error)
        setNoActivitiesScheduled(true)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()

    // Verificar si la última actividad ha terminado
    const checkLastActivity = () => {
      if (nextActivity && nextActivity.id) {
        const now = new Date()
        const activityDate = nextActivity.date === "Hoy" ? new Date() : new Date(nextActivity.date)

        // Convertir hora de fin a objeto Date
        const [hours, minutes] = nextActivity.timeEnd.split(":")
        const endTime = new Date(activityDate)
        endTime.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10), 0)

        // Si la hora actual es posterior a la hora de fin, la actividad ha terminado
        if (now > endTime) {
          setLastActivityEnded(true)
        }
      }
    }

    checkLastActivity()

    // Verificar cada minuto si la actividad ha terminado
    const interval = setInterval(checkLastActivity, 60000)

    return () => clearInterval(interval)
  }, [nextActivity])

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
    >
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Reciclado</p>
                  <p className="text-2xl font-bold">{stats.totalRecycled || 0} unidades</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Recycle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Tickets Pendientes</p>
                  <p className="text-2xl font-bold">{stats.pendingTickets || 0}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Puntos Disponibles</p>
                  <p className="text-2xl font-bold">{stats.totalPoints || 0}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Recompensas Canjeadas</p>
                  <p className="text-2xl font-bold">{stats.redeemedRewards || 0}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Gift className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Registros recientes */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Registros Recientes</h3>

              <div className="h-80 overflow-y-auto pr-2">
                {recentRecords && recentRecords.length > 0 ? (
                  <div className="space-y-4">
                    {recentRecords.map((record) => (
                      <div key={record.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <Recycle className="h-5 w-5 text-green-600" />
                            <span className="font-medium">{record.material}</span>
                          </div>
                          <span className="text-sm text-gray-500">{record.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{record.quantity} unidades</span>
                          <span className="font-medium text-green-600">{record.points} pts</span>
                        </div>
                        <div className="mt-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              record.status === "Aprobado"
                                ? "bg-green-100 text-green-800"
                                : record.status === "Rechazado"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {record.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">No hay registros recientes</div>
                )}
              </div>
            </div>

            {/* Próxima actividad */}
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Próxima Actividad</h3>

              {lastActivityEnded ? (
                <div className="bg-yellow-50 p-6 rounded-lg text-center">
                  <div className="inline-block bg-yellow-100 p-4 rounded-full mb-4">
                    <AlertTriangle className="h-10 w-10 text-yellow-600" />
                  </div>

                  <h4 className="text-xl font-bold text-yellow-800 mb-2">La actividad ha finalizado</h4>

                  <p className="text-sm text-yellow-600 mb-4">
                    La última actividad programada ha terminado. Por favor, espera a que se anuncie la próxima
                    recolecta.
                  </p>

                  <Link
                    href="/activities"
                    className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
                  >
                    Ver todas las actividades
                  </Link>
                </div>
              ) : noActivitiesScheduled ? (
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <div className="inline-block bg-blue-100 p-4 rounded-full mb-4">
                    <Calendar className="h-10 w-10 text-blue-600" />
                  </div>

                  <h4 className="text-xl font-bold text-blue-800 mb-2">No hay actividades programadas</h4>

                  <p className="text-sm text-blue-600 mb-4">
                    Actualmente no hay actividades de reciclaje programadas. Por favor, revisa más tarde para ver las
                    próximas recolectas.
                  </p>

                  <Link
                    href="/recycle"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Registrar reciclaje
                  </Link>
                </div>
              ) : nextActivity && nextActivity.id ? (
                <div className="bg-green-50 p-6 rounded-lg text-center">
                  <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
                    <Clock className="h-10 w-10 text-green-600" />
                  </div>

                  <h4 className="text-xl font-bold text-green-800 mb-2">
                    {nextActivity.timeStart} - {nextActivity.timeEnd}
                  </h4>

                  <p className="text-lg font-medium text-green-700 mb-1">
                    {nextActivity.title || "Recolección"} en {nextActivity.location}
                  </p>

                  <div className="flex items-center justify-center gap-1 text-green-600 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{nextActivity.building}</span>
                  </div>

                  <p className="text-sm text-green-600">{nextActivity.description}</p>

                  {nextActivity.points_reward > 0 && (
                    <div className="mt-2 mb-4 flex items-center justify-center gap-1 text-green-600">
                      <Award className="h-4 w-4" />
                      <span>{nextActivity.points_reward} puntos de recompensa</span>
                    </div>
                  )}

                  <div className="mt-4">
                    {nextActivity.is_registered ? (
                      <span className="inline-block bg-green-200 text-green-800 px-4 py-2 rounded-md">
                        Ya estás registrado
                      </span>
                    ) : (
                      <Link
                        href={`/activities/${nextActivity.id}/register`}
                        method="post"
                        as="button"
                        className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        Registrarme
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <div className="inline-block bg-gray-100 p-4 rounded-full mb-4">
                    <Clock className="h-10 w-10 text-gray-600" />
                  </div>

                  <h4 className="text-xl font-bold text-gray-800 mb-2">Cargando actividades...</h4>

                  <p className="text-sm text-gray-600">
                    Estamos obteniendo la información de las próximas actividades.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Próximas Actividades */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Próximas Actividades</h3>
              <Link href="/activities" className="text-sm text-green-600 hover:text-green-800">
                Ver todas
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando actividades...</p>
              </div>
            ) : upcomingActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingActivities.map((activity) => (
                  <div key={activity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-lg">{activity.title || "Actividad de reciclaje"}</h4>

                    <div className="mt-3 space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {activity.date}, {activity.time_start} - {activity.time_end}
                      </div>

                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {activity.location}, {activity.building}
                      </div>

                      {activity.points_reward > 0 && (
                        <div className="flex items-center">
                          <Gift className="h-4 w-4 mr-1" />
                          {activity.points_reward} puntos
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <Link href={`/activities/${activity.id}`} className="text-green-600 hover:text-green-800 text-sm">
                        Ver detalles
                      </Link>

                      {activity.is_registered ? (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Registrado</span>
                      ) : (
                        <Link
                          href={`/activities/${activity.id}/register`}
                          method="post"
                          as="button"
                          className="text-xs px-2 py-1 bg-green-600 text-white rounded-full hover:bg-green-700"
                        >
                          Registrarme
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay actividades próximas programadas</p>
                <p className="text-sm text-gray-400 mt-2">Revisa más tarde para nuevas actividades</p>
              </div>
            )}
          </div>

          {/* Recompensas disponibles */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Recompensas Disponibles</h3>

            {availableRewards && availableRewards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableRewards.map((reward) => (
                  <div key={reward.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{reward.name}</h4>
                        <p className="text-sm text-gray-500">{reward.description}</p>
                      </div>
                      <div className="bg-green-100 px-2 py-1 rounded-full text-green-800 font-medium">
                        {reward.points_cost} pts
                      </div>
                    </div>
                    <div className="mt-4 text-right">
                      <Link href="/rewards" className="text-sm text-green-600 hover:text-green-800">
                        Ver más
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">No hay recompensas disponibles</div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}


