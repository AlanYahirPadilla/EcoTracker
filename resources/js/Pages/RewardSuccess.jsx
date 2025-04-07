import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Gift, Check, Copy } from 'lucide-react';

export default function RewardSuccess({ auth, redemption_code, remaining_points }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Recompensa Canjeada</h2>}
    >
      <Head title="Recompensa Canjeada" />

      <div className="py-12">
        <div className="max-w-md mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
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
                  {redemption_code}
                  <button 
                    onClick={() => copyToClipboard(redemption_code)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Copiar al portapapeles"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="text-center mb-4">
                <div className="text-sm font-medium text-gray-700">Puntos restantes:</div>
                <div className="text-2xl font-bold text-emerald-600">{remaining_points}</div>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
                <p className="text-sm text-gray-700 mb-2">Presenta este código en el lugar correspondiente para reclamar tu recompensa:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Para cafetería: Muestra el código en la caja</li>
                  <li>Para puntos extra: Comunícate con tu profesor</li>
                  <li>Para productos: Acude al centro de reciclaje</li>
                </ul>
              </div>
              
              <div className="mt-6 flex justify-center">
                <Link
                  href={route('rewards')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-green-700 focus:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <Gift className="mr-2 h-4 w-4" />
                  Volver a Recompensas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}