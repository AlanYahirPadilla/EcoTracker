"use client"

import { useEffect } from "react"
import { Dialog } from "@headlessui/react"
import { X } from "lucide-react"
import { useForm } from "@inertiajs/react"

export default function UserForm({ isOpen, onClose, user = null, submitUrl, method = "post" }) {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    password_confirmation: "",
    role: user?.role || "user",
    points: user?.points || 0,
  })

  useEffect(() => {
    if (isOpen) {
      reset()
      if (user) {
        setData({
          name: user.name || "",
          email: user.email || "",
          password: "",
          password_confirmation: "",
          role: user.role || "user",
          points: user.points || 0,
        })
      }
    }
  }, [isOpen, user])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (method === "put") {
      put(submitUrl, {
        onSuccess: () => {
          onClose()
        },
      })
    } else {
      post(submitUrl, {
        onSuccess: () => {
          onClose()
        },
      })
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-medium">{user ? "Editar Usuario" : "Nuevo Usuario"}</Dialog.Title>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña {user && "(dejar en blanco para mantener la actual)"}
                </label>
                <input
                  type="password"
                  id="password"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  {...(user ? {} : { required: true })}
                />
                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  id="password_confirmation"
                  value={data.password_confirmation}
                  onChange={(e) => setData("password_confirmation", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  {...(user ? {} : { required: true })}
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Rol
                </label>
                <select
                  id="role"
                  value={data.role}
                  onChange={(e) => setData("role", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="user">Usuario</option>
                  <option value="recycling_manager">Encargado de Reciclaje</option>
                  <option value="admin">Administrador</option>
                </select>
                {errors.role && <div className="text-red-500 text-sm mt-1">{errors.role}</div>}
              </div>

              <div>
                <label htmlFor="points" className="block text-sm font-medium text-gray-700">
                  Puntos
                </label>
                <input
                  type="number"
                  id="points"
                  value={data.points}
                  onChange={(e) => setData("points", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  required
                />
                {errors.points && <div className="text-red-500 text-sm mt-1">{errors.points}</div>}
              </div>
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
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {processing ? "Procesando..." : user ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

