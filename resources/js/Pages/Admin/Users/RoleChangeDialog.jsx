"use client"

import { Dialog } from "@headlessui/react"
import { UserCog } from "lucide-react"
import { useForm } from "@inertiajs/react"
import { useEffect, useState } from "react"

export default function RoleChangeDialog({ isOpen, onClose, user, changeRoleUrl }) {
  const { data, setData, put, processing, errors, reset } = useForm({
    role: "",
  })
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (isOpen && user) {
      setData("role", user.role || "user")
      setErrorMessage(null)
    }
  }, [isOpen, user])

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage(null)

    // Asegúrate de que la URL comience con /admin/
    const url = changeRoleUrl.startsWith("/admin/")
      ? changeRoleUrl
      : `/admin${changeRoleUrl.startsWith("/") ? "" : "/"}${changeRoleUrl}`

    console.log("Enviando solicitud a:", url) // Para depuración

    put(url, {
      onSuccess: () => {
        onClose()
      },
      onError: (errors) => {
        console.error("Errores:", errors)
        if (errors.message) {
          setErrorMessage(errors.message)
        } else {
          setErrorMessage("Ha ocurrido un error al cambiar el rol. Por favor, inténtalo de nuevo.")
        }
      },
    })
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2">
              <UserCog className="h-6 w-6 text-yellow-600" />
            </div>
            <Dialog.Title className="text-lg font-medium text-gray-900">Cambiar Rol de Usuario</Dialog.Title>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-4">
              Cambiar el rol de <span className="font-medium">{user?.name}</span>
            </p>

            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Nuevo Rol
                </label>
                <select
                  id="role"
                  value={data.role}
                  onChange={(e) => setData("role", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                >
                  <option value="user">Usuario</option>
                  <option value="recycling_manager">Encargado de Reciclaje</option>
                  <option value="admin">Administrador</option>
                </select>
                {errors.role && <div className="text-red-500 text-sm mt-1">{errors.role}</div>}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
                >
                  {processing ? "Cambiando..." : "Cambiar Rol"}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

