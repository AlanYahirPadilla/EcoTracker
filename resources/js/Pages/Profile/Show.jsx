import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User, Calendar, Award, Recycle, Gift, ChevronRight } from 'lucide-react';

export default function Show({ recyclingRecords = [], rewardRedemptions = [], stats = {} }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const translateStatus = (status) => {
    switch (status) {
      case 'approved': return 'Aprobado';
      case 'pending': return 'Pendiente';
      case 'rejected': return 'Rechazado';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AuthenticatedLayout user={user}>
      <Head title="Mi Perfil" />

      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Tarjeta de información básica */}
          <div className="bg-white rounded-lg shadow-md p-6 col-span-1">
            <div className="flex items-center justify-center mb-4">
              <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <User size={48} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center">{user.name}</h3>
            <p className="text-gray-500 text-center mb-4">{user.email}</p>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Fecha de registro:</span>
                <span className="font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Rol:</span>
                <span className="font-medium capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Puntos acumulados:</span>
                <span className="font-bold text-green-600">{user.points}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link 
                href={route('profile.edit')} 
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded text-center transition duration-150 ease-in-out"
              >
                Editar Perfil
              </Link>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-white rounded-lg shadow-md p-6 col-span-2">
            <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto mb-3">
                  <Recycle size={24} />
                </div>
                <p className="text-2xl font-bold text-center">{stats.totalRecycled}</p>
                <p className="text-sm text-gray-600 text-center">Materiales Reciclados</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto mb-3">
                  <Award size={24} />
                </div>
                <p className="text-2xl font-bold text-center">{stats.totalPoints}</p>
                <p className="text-sm text-gray-600 text-center">Puntos Actuales</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white mx-auto mb-3">
                  <Gift size={24} />
                </div>
                <p className="text-2xl font-bold text-center">{stats.totalRedemptions}</p>
                <p className="text-sm text-gray-600 text-center">Premios Canjeados</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Registros de reciclaje recientes */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Reciclaje Reciente</h3>
            <a href="/tickets" className="text-green-600 hover:text-green-800 flex items-center text-sm">
              Ver todos <ChevronRight size={16} />
            </a>
          </div>
          
          {recyclingRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recyclingRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{record.material}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.quantity} unidades</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.points}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{record.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {translateStatus(record.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">No has registrado reciclaje todavía.</div>
          )}
        </div>
        
        {/* Canjes de recompensas recientes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Canjes Recientes</h3>
            <a href="/rewards/history" className="text-green-600 hover:text-green-800 flex items-center text-sm">
              Ver todos <ChevronRight size={16} />
            </a>
          </div>
          
          {rewardRedemptions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recompensa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puntos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rewardRedemptions.map((redemption) => (
                    <tr key={redemption.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{redemption.reward}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{redemption.points}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{redemption.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(redemption.status)}`}>
                          {translateStatus(redemption.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">No has canjeado recompensas todavía.</div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}