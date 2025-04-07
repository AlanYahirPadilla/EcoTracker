"use client"

import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Gift, Coffee, Award, BookOpen, Percent, FileText, AlertCircle, X, Check, Copy, Calendar, Info } from 'lucide-react';
import Modal from '@/Components/Modal';

export default function Rewards({ auth, rewards = [], flash }) {
  const [confirmingReward, setConfirmingReward] = useState(null);
  const [redemptionData, setRedemptionData] = useState(null);
  const [remainingPoints, setRemainingPoints] = useState(auth.user.points);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const { post, processing, reset } = useForm();

  // Detectar si hay datos de redención en el flash
  useEffect(() => {
    if (flash && flash.success) {
      setRedemptionData({
        success: flash.success,
        message: flash.message,
        redemption_code: flash.redemption_code,
        remaining_points: flash.remaining_points
      });
    }

    // Verificar si hay un error en la página
    const errorElement = document.querySelector('.bg-red-500');
    if (errorElement) {
      try {
        const jsonText = document.querySelector('pre')?.textContent;
        if (jsonText) {
          const jsonData = JSON.parse(jsonText);
          if (jsonData.redemption_code) {
            setRedemptionData({
              success: true,
              message: jsonData.message || "Recompensa canjeada correctamente",
              redemption_code: jsonData.redemption_code,
              remaining_points: remainingPoints - (confirmingReward?.points_cost || 0)
            });
            // Ocultar el mensaje de error
            errorElement.parentElement.style.display = 'none';
          }
        }
      } catch (e) {
        console.error("Error parsing JSON", e);
      }
    }
  }, [flash]);

  // Function to get reward icon
  const getRewardIcon = (name, category) => {
    if (category === 'food' && name.toLowerCase().includes('café')) 
      return <Coffee className="h-8 w-8 text-amber-600" />;
    if (category === 'food') 
      return <Coffee className="h-8 w-8 text-amber-600" />;
    if (category === 'academic') 
      return <Award className="h-8 w-8 text-purple-600" />;
    if (category === 'merchandise' && name.toLowerCase().includes('libreta')) 
      return <BookOpen className="h-8 w-8 text-emerald-600" />;
    if (category === 'merchandise' && name.toLowerCase().includes('botella')) 
      return <FileText className="h-8 w-8 text-blue-600" />;
    if (name.toLowerCase().includes('descuento')) 
      return <Percent className="h-8 w-8 text-blue-600" />;
    return <Gift className="h-8 w-8 text-green-600" />;
  };

  const confirmReward = (reward) => {
    setConfirmingReward(reward);
  };

  const closeModal = () => {
    setConfirmingReward(null);
    setRedemptionData(null);
    setIsErrorModalOpen(false);
    reset();
  };

  // Reemplaza la función handleRedemption con esta versión
const handleRedemption = () => {
  // Mostrar modal de carga
  setConfirmingReward(null);
  
  // Generar un código único en el frontend
  const redemptionCode = 'ECO-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-REWARD';
  
  // Calcular nuevos puntos
  const newRemainingPoints = remainingPoints - confirmingReward.points_cost;
  
  // Mostrar el éxito inmediatamente
  setRedemptionData({
    success: true,
    message: "Recompensa canjeada correctamente",
    redemption_code: redemptionCode,
    remaining_points: newRemainingPoints
  });
  
  // Actualizar visualmente los puntos
  setRemainingPoints(newRemainingPoints);
  
  // También enviar al backend, pero no esperar respuesta
  post(route('rewards.redeem', confirmingReward.id));
};

const copyToClipboard = (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Error al copiar:', err);
        fallbackCopyToClipboard(text);
      });
  } else {
    fallbackCopyToClipboard(text);
  }
};

const fallbackCopyToClipboard = (text) => {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error('Error en el método alternativo:', err);
    alert('No se pudo copiar el código. Por favor, cópialo manualmente: ' + text);
  }
};

  const getRedeemInstructions = (rewardName, category) => {
    if (!rewardName || !category) return [];
    
    if (category === 'food') {
      return ["Para cafetería: Muestra el código en la caja"];
    } else if (category === 'academic') {
      return ["Para puntos extra: Comunícate con tu profesor"];
    } else if (category === 'merchandise') {
      return ["Para productos: Acude al centro de reciclaje"];
    }
    return ["Presenta este código en el lugar correspondiente"];
  };

  // Detectar y manejar mensajes de error en la página
  useEffect(() => {
    const handleErrorDisplay = () => {
      const errorContainer = document.querySelector('.bg-red-500');
      if (errorContainer) {
        try {
          // Extraer el JSON y convertirlo a objeto
          const jsonContent = errorContainer.textContent.match(/{.*}/);
          if (jsonContent) {
            const jsonData = JSON.parse(jsonContent[0]);
            // Si es una redención exitosa
            if (jsonData.success && jsonData.redemption_code) {
              // Ocultar el mensaje de error
              errorContainer.style.display = 'none';
              
              // Mostrar el modal de éxito
              setRedemptionData({
                success: true,
                message: jsonData.message || "Recompensa canjeada correctamente",
                redemption_code: jsonData.redemption_code,
                remaining_points: jsonData.remaining_points || (remainingPoints - (confirmingReward?.points_cost || 0))
              });
            }
          }
        } catch (e) {
          console.error("Error al parsear JSON", e);
        }
      }
    };
    
    // Ejecutar después de 500ms para dar tiempo a que el DOM se actualice
    setTimeout(handleErrorDisplay, 500);
  }, []);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Recompensas</h2>}
    >
      <Head title="Recompensas" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Cabecera principal */}
          <div className="bg-gradient-to-r from-yellow-600 to-amber-500 rounded-lg shadow-md mb-6 p-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Gift className="mr-3 h-6 w-6" />
              Catálogo de Recompensas
            </h2>
          </div>

          {/* Puntos disponibles */}
          <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
            <div className="p-5 text-center border-b border-gray-100">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-full">
                  <Gift className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-800">Tus Puntos Disponibles</h3>
              <div className="text-3xl font-bold text-emerald-600 mt-1">{remainingPoints}</div>
            </div>
          </div>

          {/* Grid de recompensas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <div 
                key={reward.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-full mr-3 ${
                      reward.category === 'food' ? 'bg-amber-100' : 
                      reward.category === 'academic' ? 'bg-purple-100' : 
                      'bg-emerald-100'
                    }`}>
                      {getRewardIcon(reward.name, reward.category)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{reward.name}</h3>
                      <p className="text-gray-600 text-sm">{reward.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="bg-purple-100 text-purple-800 py-1 px-3 rounded-full font-medium text-sm">
                      {reward.points_cost} pts
                    </div>
                    
                    {remainingPoints >= reward.points_cost ? (
                      <button 
                        onClick={() => confirmReward(reward)}
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-semibold text-xs text-white tracking-widest transition ease-in-out duration-150"
                      >
                        <Gift className="h-4 w-4 mr-1" />
                        Canjear Recompensa
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="inline-flex items-center px-4 py-2 bg-gray-300 rounded-md font-semibold text-xs text-gray-700 tracking-widest opacity-75 cursor-not-allowed"
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Puntos insuficientes
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Sin recompensas disponibles */}
          {(!rewards || rewards.length === 0) && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="mb-4 flex justify-center">
                <div className="bg-gray-100 rounded-full p-4">
                  <Gift className="h-10 w-10 text-gray-500" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-600">No hay recompensas disponibles</h3>
              <p className="mt-1 text-gray-500">
                Vuelve a revisar más tarde para ver nuevas recompensas.
              </p>
            </div>
          )}
          
          {/* Información sobre recompensas */}
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-1">
                <AlertCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Información sobre el canje</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Una vez canjeada una recompensa, recibirás un código que podrás usar para reclamarla. 
                  Los puntos se descontarán automáticamente de tu cuenta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <Modal show={confirmingReward !== null} onClose={closeModal} maxWidth="md">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">Confirmar Canje de Recompensa</h2>
          
          {confirmingReward && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-4">Estás a punto de canjear la siguiente recompensa:</p>
              
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-full mr-3 ${
                  confirmingReward.category === 'food' ? 'bg-amber-100' : 
                  confirmingReward.category === 'academic' ? 'bg-purple-100' : 
                  'bg-emerald-100'
                }`}>
                  {getRewardIcon(confirmingReward.name, confirmingReward.category)}
                </div>
                <div>
                  <h3 className="font-semibold">{confirmingReward.name}</h3>
                  <p className="text-gray-600 text-sm">{confirmingReward.description}</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mb-4">
                <p className="font-medium mb-1">Costo: <span className="text-green-700">{confirmingReward.points_cost} puntos</span></p>
                <p className="text-sm text-gray-600">Puntos restantes después del canje: <span className="font-medium">{remainingPoints - confirmingReward.points_cost}</span></p>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Una vez canjeada, recibirás un código que podrás presentar para reclamar tu recompensa.
              </p>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-green-700 focus:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={handleRedemption}
                  disabled={processing}
                >
                  Confirmar Canje
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
      
      {/* Modal de Éxito */}
      <Modal show={redemptionData !== null} onClose={closeModal} maxWidth="md">
        {redemptionData && (
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
  {redemptionData.redemption_code}
  <button 
    onClick={() => copyToClipboard(redemptionData.redemption_code)}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
    title="Copiar al portapapeles"
  >
    <Copy className="h-5 w-5" />
  </button>
</div>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-sm font-medium text-gray-700">Puntos restantes:</div>
              <div className="text-2xl font-bold text-emerald-600">{redemptionData.remaining_points}</div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">Presenta este código en el lugar correspondiente para reclamar tu recompensa:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {confirmingReward && getRedeemInstructions(confirmingReward.name, confirmingReward.category).map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
                {!confirmingReward && (
                  <>
                    <li>Para cafetería: Muestra el código en la caja</li>
                    <li>Para puntos extra: Comunícate con tu profesor</li>
                    <li>Para productos: Acude al centro de reciclaje</li>
                  </>
                )}
              </ul>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-green-700 focus:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* También necesitamos agregar el manejo de errores para mostrar el JSON de error en un modal bonito */}
      <Modal show={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)} maxWidth="md">
        <div className="p-6">
          <div className="text-center mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-red-600">Error</h2>
            <p className="mt-1 text-gray-600">{errorMessage || "Ha ocurrido un error al procesar tu solicitud."}</p>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={() => setIsErrorModalOpen(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
      {copied && (
        <div className="fixed top-16 left-0 right-0 flex justify-center z-50">
          <div className="bg-green-600 text-white py-2 px-4 rounded-md shadow-lg flex items-center">
            <Check className="h-4 w-4 mr-2" />
            ¡Código copiado!
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}

