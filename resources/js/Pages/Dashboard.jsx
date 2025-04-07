import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link } from "@inertiajs/react"
import { BarChart3, Recycle, Gift, Clock, MapPin, ClipboardList, Calendar } from "lucide-react"
import React, { useState, useEffect } from 'react';

export default function Dashboard({ auth, stats, recentRecords, availableRewards, nextActivity }) {
  const [showActivity, setShowActivity] = useState(false);

  useEffect(() => {
    // Esta es una solución temporal para forzar la ocultación de actividades inactivas
    if (nextActivity) {
      // Verificar que la actividad realmente deba mostrarse
      const now = new Date();
      const activityDate = nextActivity.date === 'Hoy' 
        ? new Date().toISOString().split('T')[0]
        : nextActivity.date;
      
      const [endHour, endMinute] = nextActivity.timeEnd.split(':');
      const activityEndTime = new Date(
        `${activityDate}T${endHour}:${endMinute}:00`
      );
      
      // Solo mostrar si no ha pasado la hora de finalización
      setShowActivity(now < activityEndTime);
      
      console.log('Verificación de actividad:', {
        mostrar: now < activityEndTime,
        ahora: now.toISOString(),
        finActividad: activityEndTime.toISOString(),
        nombre: nextActivity.location
      });
    } else {
      setShowActivity(false);
    }
  }, [nextActivity]);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
    >
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Estadísticas */}
          <div className="mb-8 overflow-hidden shadow-lg rounded-lg border border-green-200">
            <div className="bg-gradient-to-r from-green-600 to-teal-500 py-4 px-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <BarChart3 className="h-6 w-6 mr-2" />
                Estadísticas de Reciclaje
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gradient-to-b from-green-50 to-white">
              {/* Total Reciclado */}
              <div className="bg-white rounded-lg shadow-sm p-5 border border-green-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Reciclado</p>
                    <p className="text-2xl font-bold text-green-800">{stats.totalRecycled || 0} unidades</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Recycle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Tickets Pendientes */}
              <div className="bg-white rounded-lg shadow-sm p-5 border border-yellow-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Tickets Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-800">{stats.pendingTickets || 0}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Puntos Disponibles */}
              <div className="bg-white rounded-lg shadow-sm p-5 border border-blue-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Puntos Disponibles</p>
                    <p className="text-2xl font-bold text-blue-800">{stats.totalPoints || 0}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Recompensas Canjeadas */}
              <div className="bg-white rounded-lg shadow-sm p-5 border border-purple-100 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Recompensas Canjeadas</p>
                    <p className="text-2xl font-bold text-purple-800">{stats.redeemedRewards || 0}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Gift className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Registros recientes */}
            <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg border border-blue-200">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 py-4 px-6">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2" />
                  Registros Recientes
                </h3>
              </div>

              <div className="p-6 bg-gradient-to-b from-blue-50 to-white">
                <div className="h-80 overflow-y-auto pr-2">
                  {recentRecords && recentRecords.length > 0 ? (
                    <div className="space-y-4">
                      {recentRecords.map((record) => (
                        <div key={record.id} className="border border-blue-100 rounded-lg p-4 hover:shadow-md transition-all">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <div className="bg-green-100 p-2 rounded-full">
                                <Recycle className="h-4 w-4 text-green-600" />
                              </div>
                              <span className="font-medium text-gray-800">{record.material}</span>
                            </div>
                            <span className="text-sm text-gray-500">{record.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">{record.quantity} unidades</span>
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
                    <div className="text-center py-16">
                      <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No hay registros recientes</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Próxima actividad */}
            <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg border border-green-200">
              <div className="bg-gradient-to-r from-green-600 to-green-500 py-4 px-6">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Próxima Actividad
                </h3>
              </div>

              <div className="bg-gradient-to-b from-green-50 to-white p-6">
                {!nextActivity || !showActivity ? (
                  <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-100">
                    <div className="inline-block bg-gray-100 p-4 rounded-full mb-4">
                      <Clock className="h-10 w-10 text-gray-400" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-700 mb-2">
                      No hay actividades programadas
                    </h4>
                    <p className="text-gray-500">Pronto se anunciarán nuevas actividades de reciclaje.</p>
                  </div>
                ) : (
                  <div className="bg-green-50 p-6 rounded-lg text-center border border-green-100">
                    <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
                      <Clock className="h-10 w-10 text-green-600" />
                    </div>

                    <h4 className="text-xl font-bold text-green-800 mb-2">
                      {nextActivity.timeStart} - {nextActivity.timeEnd}
                    </h4>
                    {nextActivity.date !== 'Hoy' && (
                      <div className="text-base font-medium text-green-700 mb-2">
                        {nextActivity.date && new Date(nextActivity.date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    )}

                    <p className="text-lg font-medium text-green-700 mb-1">Recolección en {nextActivity.location}</p>

                    <div className="flex items-center justify-center gap-1 text-green-600 mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{nextActivity.building}</span>
                    </div>

                    <p className="text-sm text-green-600 mb-4">{nextActivity.description}</p>

                    <div>
                      <Link
                        href="/recycle"
                        className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        Registrar reciclaje
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recompensas disponibles */}
          <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg border border-purple-200">
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 py-4 px-6">
              <h3 className="text-lg font-medium text-white flex items-center">
                <Gift className="h-5 w-5 mr-2" />
                Recompensas Disponibles
              </h3>
            </div>

            <div className="bg-gradient-to-b from-purple-50 to-white p-6">
              {availableRewards && availableRewards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {availableRewards.map((reward) => (
                    <Link 
                      key={reward.id} 
                      href="/rewards" 
                      className="block border border-purple-100 rounded-lg p-4 hover:bg-purple-50 hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{reward.name}</h4>
                          <p className="text-sm text-gray-500">{reward.description || 'Sin descripción'}</p>
                        </div>
                        <div className="bg-purple-100 px-2 py-1 rounded-full text-purple-800 font-medium">
                          {reward.points_cost} pts
                        </div>
                      </div>
                      <div className="mt-4 text-right">
                        <span className="text-sm text-purple-600 hover:text-purple-800">
                          Ver más
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Gift className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No hay recompensas disponibles</p>
                  <Link 
                    href="/rewards" 
                    className="inline-block text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Ver todas las recompensas →
                  </Link>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link 
                  href="/rewards" 
                  className="inline-block text-purple-600 hover:text-purple-800 font-medium"
                >
                  Ver todas las recompensas →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

