import { Head } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"
import { Link } from "@inertiajs/react"
import { Users, Recycle, Gift, Clock, BarChart3, ChevronRight } from "lucide-react"

export default function AdminDashboard({
  auth,
  stats = {},
  recentUsers = [],
  recentRecords = [],
  topMaterials = [],
  weeklyStats = {},
}) {
  return (
    <AdminLayout user={auth.user}>
      <Head title="Panel de Administración" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard de Administración</h1>
          <p className="mt-1 text-sm text-gray-600">Gestiona todos los aspectos del sistema EcoTracker</p>

          {/* Estadísticas principales */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total Usuarios */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Usuarios</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stats.totalUsers || 5}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm text-green-600">{weeklyStats.users || "+1 esta semana"}</div>
              </div>
            </div>

            {/* Material Reciclado */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <Recycle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Material Reciclado</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stats.totalRecycled || 21.8} unidades</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm text-green-600">{weeklyStats.recycled || "+5.5 esta semana"}</div>
              </div>
            </div>

            {/* Puntos Canjeados */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                    <Gift className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Puntos Canjeados</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stats.totalPoints || 600}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm text-green-600">{weeklyStats.points || "+200 esta semana"}</div>
              </div>
            </div>
          </div>

          {/* Secciones secundarias */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Validaciones Pendientes */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Validaciones Pendientes</h3>
                </div>
                <Link href="/admin/validations" className="text-sm text-blue-600 hover:text-blue-800">
                  Ver todas
                </Link>
              </div>
              <div className="p-5">
                {stats.pendingValidations > 0 ? (
                  <div className="space-y-4">
                    {recentRecords
                      .filter((record) => record.status === "Pendiente")
                      .map((record) => (
                        <div key={record.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">{record.user_name}</div>
                            <span className="text-sm text-gray-500">{record.created_at}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>
                              {record.quantity} unidades de {record.material}
                            </span>
                            <span className="font-medium text-green-600">{record.points_earned} pts</span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No hay validaciones pendientes</div>
                )}
              </div>
            </div>

            {/* Distribución de Materiales */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center">
                <BarChart3 className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-medium leading-6 text-gray-900">Distribución de Materiales</h3>
              </div>
              <div className="p-5">
                {topMaterials.length > 0 ? (
                  <div className="space-y-4">
                    {topMaterials.map((material) => (
                      <div key={material.name} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span>{material.name}</span>
                          <span>{material.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${material.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span>Papel</span>
                        <span>10.1%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "10.1%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span>Cartón</span>
                        <span>0.5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "0.5%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span>Plástico</span>
                        <span>5.5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "5.5%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span>Aluminio</span>
                        <span>5.5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "5.5%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span>Vidrio</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span>Residuo Electrónico</span>
                        <span>33.5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "33.5%" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Accesos rápidos */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Validaciones Pendientes */}
            <Link
              href="/admin/validations"
              className="bg-white shadow rounded-lg p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Validaciones Pendientes</h3>
                  <p className="text-sm text-gray-500">Gestionar solicitudes</p>
                </div>
                <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
              </div>
            </Link>

            {/* Actividad Reciente */}
            <Link href="/admin/activity" className="bg-white shadow rounded-lg p-5 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
                  <p className="text-sm text-gray-500">Ver últimas acciones</p>
                </div>
                <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
              </div>
            </Link>

            {/* Historial de Canjes */}
            <Link
              href="/admin/redemptions"
              className="bg-white shadow rounded-lg p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <Gift className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Historial de Canjes</h3>
                  <p className="text-sm text-gray-500">Ver todos los canjes</p>
                </div>
                <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
              </div>
            </Link>

            {/* Tickets de Reciclaje */}
            <Link href="/admin/tickets" className="bg-white shadow rounded-lg p-5 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <Recycle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Tickets de Reciclaje</h3>
                  <p className="text-sm text-gray-500">Revisar los tickets</p>
                </div>
                <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

