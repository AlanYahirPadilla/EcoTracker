"use client"

import { Dialog } from "@headlessui/react"
import { AlertTriangle } from "lucide-react"
import { useForm } from "@inertiajs/react"

export default function DeleteConfirmation({ isOpen, onClose, user, deleteUrl }) {
  const { delete: destroy, processing } = useForm()

  const handleDelete = () => {
    destroy(deleteUrl, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <Dialog.Title className="text-lg font-medium text-gray-900">Eliminar Usuario</Dialog.Title>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">
              ¿Estás seguro de que deseas eliminar al usuario <span className="font-medium">{user?.name}</span>? Esta
              acción no se puede deshacer.
            </p>
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
              type="button"
              onClick={handleDelete}
              disabled={processing}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {processing ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

