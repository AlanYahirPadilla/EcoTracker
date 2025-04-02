"use client"
import { useState, useEffect } from "react"
import AdminLayout from "@/Layouts/AdminLayout"
import { Head, usePage } from "@inertiajs/react"
import { Users, Search, UserPlus, Edit, Trash, Shield, UserX } from "lucide-react"
import axios from "axios"
import UserForm from "./UserForm"
import DeleteConfirmation from "./DeleteConfirmation"
import RoleChangeDialog from "./RoleChangeDialog"

export default function UsersIndex({ auth, users: initialUsers }) {
  const { flash = {} } = usePage().props
  const [users, setUsers] = useState(initialUsers || [])
  const [loading, setLoading] = useState(!initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  // Estados para modales
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isRoleChangeOpen, setIsRoleChangeOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    if (!initialUsers) {
      fetchUsers()
    }
  }, [initialUsers])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      // Intentar obtener usuarios reales primero
      const response = await axios.get("/api/users")
      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data)
        setError(null)
      } else {
        throw new Error("Formato de respuesta inválido")
      }
    } catch (err) {
      console.error("Error al cargar usuarios:", err)
      setError("No se pudieron cargar los usuarios. Usando datos de ejemplo.")

      // Datos de ejemplo para mostrar cuando la API falla
      setUsers([
        {
          id: 1,
          name: "Administrador",
          email: "admin@example.com",
          points: 500,
          role: "admin",
          created_at: "01/01/2023",
        },
        {
          id: 2,
          name: "Encargado de Reciclaje",
          email: "recycler@example.com",
          points: 350,
          role: "recycler",
          created_at: "15/01/2023",
        },
        {
          id: 3,
          name: "Usuario Regular",
          email: "user@example.com",
          points: 120,
          role: "user",
          created_at: "01/02/2023",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Filtrar usuarios según el término de búsqueda
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleOpenForm = (user = null) => {
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  const handleOpenDelete = (user) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  const handleOpenRoleChange = (user) => {
    setSelectedUser(user)
    setIsRoleChangeOpen(true)
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Shield className="h-3 w-3 mr-1" />
            Administrador
          </span>
        )
      case "recycling_manager":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Encargado de Reciclaje
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Usuario
          </span>
        )
    }
  }

  return (
    <AdminLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Usuarios</h2>}
    >
      <Head title="Gestión de Usuarios" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {flash && flash.success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{flash.success}</p>
                </div>
              </div>
            </div>
          )}

          {flash && flash.error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{flash.error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-medium">Usuarios del Sistema</h3>
              </div>
              <button
                onClick={() => handleOpenForm()}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                <UserPlus className="h-4 w-4" />
                <span>Nuevo Usuario</span>
              </button>
            </div>

            {/* Barra de búsqueda */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                  placeholder="Buscar por nombre, email o rol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="bg-yellow-50 text-yellow-600 p-4 rounded-md mb-6">{error}</div>}

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-2 text-gray-500">Cargando usuarios...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No se encontraron usuarios</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Usuario
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Rol
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Puntos
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Fecha de Registro
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {user.points || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {typeof user.created_at === "string" && user.created_at.includes("T")
                            ? new Date(user.created_at).toLocaleDateString()
                            : user.created_at}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleOpenForm(user)}
                              className="p-1 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200"
                              title="Editar"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleOpenDelete(user)}
                              className="p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                              title="Eliminar"
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleOpenRoleChange(user)}
                              className="p-1 bg-yellow-100 rounded-full text-yellow-600 hover:bg-yellow-200"
                              title="Cambiar Rol"
                            >
                              <UserX className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <UserForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        user={selectedUser}
        submitUrl={selectedUser ? `/admin/users/${selectedUser.id}` : "/admin/users"}
        method={selectedUser ? "put" : "post"}
      />

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        user={selectedUser}
        deleteUrl={selectedUser ? `/admin/users/${selectedUser.id}` : ""}
      />

      <RoleChangeDialog
        isOpen={isRoleChangeOpen}
        onClose={() => setIsRoleChangeOpen(false)}
        user={selectedUser}
        changeRoleUrl={selectedUser ? `/admin/users/${selectedUser.id}/change-role` : ""}
      />
    </AdminLayout>
  )
}




