import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Gift, Calendar, Coffee, Book, Award, Percent, Clock, Info } from 'lucide-react';

export default function RewardHistory({ auth, redeemedRewards = [] }) {
  // Función para obtener el icono según el tipo de recompensa
  const getRewardIcon = (rewardName) => {
    if (!rewardName) return <Gift className="h-5 w-5 text-green-600" />;
    
    const name = rewardName.toLowerCase();
    if (name.includes('café')) return <Coffee className="h-5 w-5 text-amber-600" />;
    if (name.includes('punt')) return <Award className="h-5 w-5 text-purple-600" />;
    if (name.includes('libreta')) return <Book className="h-5 w-5 text-emerald-600" />;
    if (name.includes('descuento')) return <Percent className="h-5 w-5 text-blue-600" />;
    return <Gift className="h-5 w-5 text-green-600" />;
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Historial de Canjes</h2>}
    >
      <Head title="Historial de Canjes" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Encabezado con estilo similar al dashboard */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-500 rounded-lg shadow-md mb-6 p-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Gift className="mr-3 h-6 w-6" />
              Tus Canjes de Recompensas
            </h2>
          </div>
          
          {/* Tabla de canjes con estilo similar al dashboard */}
          <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
            <div className="p-4 bg-purple-100 border-b border-purple-200">
              <h3 className="font-medium text-purple-800 flex items-center">
                <Gift className="mr-2 h-5 w-5" />
                Historial Completo
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              {redeemedRewards && redeemedRewards.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {redeemedRewards.map((reward, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors flex flex-wrap md:flex-nowrap items-center justify-between">
                      <div className="flex items-center w-full md:w-auto mb-2 md:mb-0">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{reward.fecha_canje}</span>
                      </div>
                      
                      <div className="flex items-center w-full md:w-auto mb-2 md:mb-0">
                        {getRewardIcon(reward.recompensa)}
                        <span className="ml-2 font-medium">{reward.recompensa}</span>
                      </div>
                      
                      <div className="w-full md:w-auto mb-2 md:mb-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {reward.puntos} pts
                        </span>
                      </div>
                      
                      <div className="w-full md:w-auto mb-2 md:mb-0">
                        <span className="bg-gray-100 px-2.5 py-1 rounded text-xs font-mono">
                          {reward.codigo}
                        </span>
                      </div>
                      
                      <div className="w-full md:w-auto mb-2 md:mb-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          {reward.estado}
                        </span>
                      </div>
                      
                      <div className="w-full md:w-auto text-sm text-gray-500">
                        {reward.fecha_uso || "-"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="mb-4 flex justify-center">
                    <div className="bg-purple-100 rounded-full p-4">
                      <Gift className="h-10 w-10 text-purple-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-600">No tienes canjes de recompensas</h3>
                  <p className="mt-1 text-gray-500">
                    Cuando canjees tus puntos por recompensas, aparecerán aquí.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Tarjeta informativa similar al dashboard */}
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-1">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">¿Cómo usar mis recompensas?</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Para canjear tus recompensas, muestra el código al personal encargado en el punto de canje correspondiente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 