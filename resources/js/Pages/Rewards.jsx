"use client"

import { useState } from "react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head } from "@inertiajs/react"
import { Coffee, Gift, ShoppingBag, Leaf } from "lucide-react"
import axios from "axios"

export default function RewardsPage({ auth, rewards = [] }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedReward, setSelectedReward] = useState(null)
  const [redeemSuccess, setRedeemSuccess] = useState(false)
  const [redeemCode, setRedeemCode] = useState("")
  const [redeeming, setRedeeming] = useState(false)

  const handleRedeemClick = (reward) => {
    setSelectedReward(reward)
    setShowConfirmation(true)
  }

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return

    setRedeeming(true)
    setError(null)

    try {
      // Usar una URL directa en lugar de route()
      const response = await axios.post(`/rewards/${selectedReward.id}/redeem`)
      setRedeemSuccess(true)
      setRedeemCode(response.data.redemption_code)

      // Actualizar los puntos del usuario en la sesión
      auth.user.points -= selectedReward.points_cost
    } catch (err) {
      setError(err.response?.data?.message || "Error al canjear la recompensa")
      console.error(err)
    } finally {
      setRedeeming(false)
    }
  }

  const handleCloseDialog = () => {
    setShowConfirmation(false)
    setRedeemSuccess(false)
    setSelectedReward(null)
    setError(null)
  }

  // Función para obtener el icono correspondiente a cada categoría
  const getCategoryIcon = (category) => {
    switch (category) {
      case "food":
        return <Coffee className="h-6 w-6 text-green-600" />
      case "merchandise":
        return <ShoppingBag className="h-6 w-6 text-green-600" />
      case "academic":
        return <Leaf className="h-6 w-6 text-green-600" />
      default:
        return <Gift className="h-6 w-6 text-green-600" />
    }
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Recompensas</h2>}
    >
      <Head title="Recompensas" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Gift className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Tus Puntos Disponibles</h3>
                  <p className="text-3xl font-bold text-green-600">{auth.user.points}</p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Cargando recompensas...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : rewards.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay recompensas disponibles en este momento</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const canRedeem = auth.user.points >= reward.points_cost

                return (
                  <div
                    key={reward.id}
                    className={`bg-white overflow-hidden shadow-sm sm:rounded-lg ${!canRedeem ? "opacity-70" : ""}`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-green-100 p-2 rounded-full">{getCategoryIcon(reward.category)}</div>
                        <div className="bg-green-100 px-3 py-1 rounded-full text-green-800 font-medium">
                          {reward.points_cost} pts
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-1">{reward.name}</h3>
                      <p className="text-gray-600 mb-4">{reward.description}</p>
                      <button
                        onClick={() => handleRedeemClick(reward)}
                        disabled={!canRedeem}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <Gift className="mr-2 h-4 w-4" />
                        Canjear Recompensa
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Modal de confirmación */}
          {showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                {!redeemSuccess ? (
                  <>
                    <h3 className="text-xl font-bold mb-2">Confirmar Canje de Recompensa</h3>
                    <p className="text-gray-600 mb-4">Estás a punto de canjear la siguiente recompensa:</p>

                    {selectedReward && (
                      <div className="py-4">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="bg-green-100 p-3 rounded-full">
                            {getCategoryIcon(selectedReward.category)}
                          </div>
                          <div>
                            <h4 className="font-bold">{selectedReward.name}</h4>
                            <p className="text-sm text-gray-500">{selectedReward.description}</p>
                          </div>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-md mb-4">
                          <p className="font-medium">
                            Costo: <span className="text-green-600">{selectedReward.points_cost} puntos</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Puntos restantes después del canje: {auth.user.points - selectedReward.points_cost}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          Una vez canjeada, recibirás un código que podrás presentar para reclamar tu recompensa.
                        </p>
                      </div>
                    )}

                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">{error}</div>}

                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        onClick={handleCloseDialog}
                        className="px-4 py-2 border border-gray-300 rounded-md"
                        disabled={redeeming}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleConfirmRedeem}
                        className="px-4 py-2 bg-green-600 text-white rounded-md"
                        disabled={redeeming}
                      >
                        {redeeming ? "Procesando..." : "Confirmar Canje"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-green-600 mb-2">¡Canje Exitoso!</h3>
                    <p className="mb-4">Has canjeado tu recompensa correctamente.</p>

                    <div className="bg-green-50 p-4 rounded-md mb-4 text-center">
                      <p className="font-bold mb-2">Tu código de canje:</p>
                      <p className="text-xl font-mono bg-white p-2 rounded border">{redeemCode}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>Presenta este código en el lugar correspondiente para reclamar tu recompensa:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Para cafetería: Muestra el código en la caja</li>
                        <li>Para puntos extra: Comunícate con tu profesor</li>
                        <li>Para productos: Acude al centro de reciclaje</li>
                      </ul>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button onClick={handleCloseDialog} className="px-4 py-2 bg-green-600 text-white rounded-md">
                        Cerrar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

