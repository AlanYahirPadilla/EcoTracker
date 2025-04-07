import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Gift, Coffee, Award, BookOpen, Percent, FileText, Calendar, Info, Check, Copy, X } from 'lucide-react';
import Modal from '@/Components/Modal';

export default function RewardsHistory({ auth, redeemHistory = [] }) {
  const [selectedRedemption, setSelectedRedemption] = useState(null);
  
  // Función para copiar el código al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Opcional: mostrar algún tipo de feedback
  };

  // Función para obtener el icono adecuado según el tipo de recompensa
  const getRewardIcon = (rewardName) => {
    if (rewardName.toLowerCase().includes('café')) 
      return <Coffee className="h-5 w-5 text-amber-600" />;
    if (rewardName.toLowerCase().includes('punto')) 
      return <Award className="h-5 w-5 text-purple-600" />;
    if (rewardName.toLowerCase().includes('libreta')) 
      return <BookOpen className="h-5 w-5 text-emerald-600" />;
    if (rewardName.toLowerCase().includes('botella')) 
      return <FileText className="h-5 w-5 text-blue-600" />;
    if (rewardName.toLowerCase().includes('descuento')) 
      return <Percent className="h-5 w-5 text-blue-600" />;
    return <Gift className="h-5 w-5 text-green-600" />;
  };

  // Función para obtener instrucciones según el tipo de recompensa
  const getRedeemInstructions = (rewardName) => {
    if (rewardName.toLowerCase().includes('café')) {
      return ["Para cafetería: Muestra el código en la caja"];
    } else if (rewardName.toLowerCase().includes('punto')) {
      return ["Para puntos extra: Comunícate con tu profesor"];
    } else if (rewardName.toLowerCase().includes('libreta') || rewardName.toLowerCase().includes('botella')) {
      return ["Para productos: Acude al centro de reciclaje"];
    }
    return [
      "Para cafetería: Muestra el código en la caja",
      "Para puntos extra: Comunícate con tu profesor",
      "Para productos: Acude al centro de reciclaje"
    ];
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Historial de Canjes</h2>}
    >
      <Head title="Historial de Canjes" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Cabecera principal con gradiente */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-500 rounded-lg shadow-md mb-6 p-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Gift className="mr-3 h-6 w-6" />
              Historial de Recompensas Canjeadas
            </h2>
          </div>

          {/* Tabla de recompensas canjeadas */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {redeemHistory && redeemHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                      <th className="py-3 px-4 text-left font-medium text-gray-600">Fecha</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">Recompensa</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">Puntos</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">Código</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {redeemHistory.map((redemption) => (
                      <tr key={redemption.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedRedemption(redemption)}>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">{redemption.date}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {getRewardIcon(redemption.reward)}
                            <span className="ml-2 font-medium">{redemption.reward}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {redemption.points} pts
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-gray-100 px-2.5 py-1 rounded text-xs font-mono hover:bg-gray-200">
                            {redemption.code}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            redemption.status === 'Canjeado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {redemption.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Gift className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aún no has canjeado ninguna recompensa</p>
              </div>
            )}
          </div>

          {/* Información sobre recompensas */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-1">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Información sobre los canjes</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Haz clic en cualquier fila para ver los detalles del código de canje. Estos códigos son únicos y solo pueden ser utilizados una vez.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para mostrar el código en grande */}
      <Modal show={selectedRedemption !== null} onClose={() => setSelectedRedemption(null)} maxWidth="md">
        {selectedRedemption && (
          <div className="p-6">
            <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-green-600">¡Canje Exitoso!</h2>
              <p className="mt-1 text-gray-600">Has canjeado tu recompensa correctamente.</p>
            </div>
            
            <div className="bg-green-50 border border-green-100 rounded-md p-4 text-center mb-4">
              <div className="text-sm text-gray-600 mb-2">Tu código de canje:</div>
              <div className="font-mono bg-white border border-gray-200 rounded-md p-3 text-lg text-center relative">
                {selectedRedemption.code}
                <button 
                  onClick={() => copyToClipboard(selectedRedemption.code)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Copiar al portapapeles"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-sm font-medium text-gray-700">Estado:</div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                selectedRedemption.status === 'Canjeado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedRedemption.status}
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">Presenta este código en el lugar correspondiente para reclamar tu recompensa:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {getRedeemInstructions(selectedRedemption.reward).map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-green-700 focus:bg-green-700 focus:outline-none"
                onClick={() => setSelectedRedemption(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AuthenticatedLayout>
  );
}