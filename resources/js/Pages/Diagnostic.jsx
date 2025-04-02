import { Head } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"

export default function Diagnostic({ auth, tables, routes, middleware, views, controllers, currentUser }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Diagnóstico del Sistema</h2>}
    >
      <Head title="Diagnóstico del Sistema" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Usuario actual */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Usuario Actual</h3>

            {currentUser.authenticated ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <span className="font-medium">ID:</span> {currentUser.id}
                    </p>
                    <p>
                      <span className="font-medium">Nombre:</span> {currentUser.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {currentUser.email}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">Rol:</span> {currentUser.role}
                    </p>
                    <p>
                      <span className="font-medium">Es Admin (hasRole):</span>{" "}
                      {currentUser.has_admin_role ? "Sí" : "No"}
                    </p>
                    <p>
                      <span className="font-medium">Es Admin (role === 'admin'):</span>{" "}
                      {currentUser.role_check_admin ? "Sí" : "No"}
                    </p>
                    <p>
                      <span className="font-medium">Es Admin (lowercase):</span>{" "}
                      {currentUser.role_check_admin_lowercase ? "Sí" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-yellow-700">{currentUser.message}</p>
              </div>
            )}
          </div>

          {/* Tablas */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Tablas de la Base de Datos</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tabla
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Existe
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Registros
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Columnas
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(tables).map(([tableName, tableInfo]) => (
                    <tr key={tableName}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tableName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={tableInfo.exists ? "text-green-600" : "text-red-600"}>
                          {tableInfo.exists ? "Sí" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tableInfo.count}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {tableInfo.columns.length > 0 ? (
                          <details>
                            <summary className="cursor-pointer text-blue-600">
                              Ver columnas ({tableInfo.columns.length})
                            </summary>
                            <ul className="mt-2 list-disc list-inside">
                              {tableInfo.columns.map((column) => (
                                <li key={column}>{column}</li>
                              ))}
                            </ul>
                          </details>
                        ) : (
                          <span className="text-gray-400">No disponible</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rutas */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Rutas</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Nombre
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Existe
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      URI
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(routes).map(([routeName, routeInfo]) => (
                    <tr key={routeName}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{routeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={routeInfo.exists ? "text-green-600" : "text-red-600"}>
                          {routeInfo.exists ? "Sí" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{routeInfo.uri}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Controladores */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Controladores</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Controlador
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Existe
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Clase
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(controllers).map(([controllerName, controllerInfo]) => (
                    <tr key={controllerName}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {controllerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={controllerInfo.exists ? "text-green-600" : "text-red-600"}>
                          {controllerInfo.exists ? "Sí" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{controllerInfo.class}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vistas */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Vistas</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Vista
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Existe
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ruta
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(views).map(([viewName, viewInfo]) => (
                    <tr key={viewName}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{viewName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={viewInfo.exists ? "text-green-600" : "text-red-600"}>
                          {viewInfo.exists ? "Sí" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{viewInfo.path}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Herramientas adicionales */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Herramientas Adicionales</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/check-dependencies"
                target="_blank"
                className="block p-4 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-center"
                rel="noreferrer"
              >
                Verificar Dependencias
              </a>
              <a
                href="/check-roles"
                target="_blank"
                className="block p-4 bg-green-50 text-green-700 rounded hover:bg-green-100 text-center"
                rel="noreferrer"
              >
                Verificar Roles
              </a>
              <a
                href="/check-js-conflicts"
                target="_blank"
                className="block p-4 bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 text-center"
                rel="noreferrer"
              >
                Verificar Conflictos JavaScript
              </a>
              <a
                href="/debug/auth"
                target="_blank"
                className="block p-4 bg-purple-50 text-purple-700 rounded hover:bg-purple-100 text-center"
                rel="noreferrer"
              >
                Verificar Autenticación
              </a>
              <a
                href="/debug/dashboard"
                target="_blank"
                className="block p-4 bg-red-50 text-red-700 rounded hover:bg-red-100 text-center"
                rel="noreferrer"
              >
                Verificar Dashboard
              </a>
              <a
                href="/debug/admin-dashboard-view"
                target="_blank"
                className="block p-4 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 text-center"
                rel="noreferrer"
              >
                Verificar Vista Admin Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

