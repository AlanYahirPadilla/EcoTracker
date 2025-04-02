import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link } from "@inertiajs/react"
import { BarChart3, Recycle, Gift, Clock, MapPin } from "lucide-react"

export default function Dashboard({ auth, stats, recentRecords, availableRewards, nextActivity }) {
  // Si nextActivity no está definido, usar datos de ejemplo
  nextActivity = nextActivity || {
    date: "Hoy",
    timeStart: "15:00",
    timeEnd: "16:55",
    location: "CUCEI",
    building: "Edificio A",
    description: "Recolección de materiales reciclables",
  }

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

              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
                  <Clock className="h-10 w-10 text-green-600" />
                </div>

                <h4 className="text-xl font-bold text-green-800 mb-2">
                  {nextActivity.timeStart} - {nextActivity.timeEnd}
                </h4>

                <p className="text-lg font-medium text-green-700 mb-1">Recolección en {nextActivity.location}</p>

                <div className="flex items-center justify-center gap-1 text-green-600 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{nextActivity.building}</span>
                </div>

                <p className="text-sm text-green-600">{nextActivity.description}</p>

                <div className="mt-4">
                  <Link
                    href="/recycle"
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Registrar reciclaje
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recompensas disponibles (ahora a lo largo) */}
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

