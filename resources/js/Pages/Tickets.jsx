import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Ticket, Calendar, Package, Box, Circle, Archive, Tag, Copy, CheckCircle, XCircle, Info } from 'lucide-react';
import Modal from '@/Components/Modal';

export default function Tickets({ auth, tickets = [] }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Función para copiar el código al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Función para mostrar el estado con el color adecuado
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'aprobado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3.5 w-3.5" />
            {status}
          </span>
        );
      case 'pendiente':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Circle className="h-3.5 w-3.5" />
            {status}
          </span>
        );
      case 'rechazado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3.5 w-3.5" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mis Tickets</h2>}
    >
      <Head title="Mis Tickets" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Cabecera principal con gradiente */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-lg shadow-md mb-6 p-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Ticket className="mr-3 h-6 w-6" />
              Tickets de Reciclaje
            </h2>
          </div>

          {/* Lista de tickets */}
          <div className="space-y-4">
            {tickets && tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex flex-wrap md:flex-nowrap items-center justify-between">
                    <div className="flex items-center gap-2 mb-2 md:mb-0">
                      {getStatusBadge(ticket.status)}
                      <div className="flex items-center ml-2">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{ticket.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-2 md:mb-0">
                      <Archive className="h-5 w-5 text-red-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium">Material</div>
                        <div>{ticket.material}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-2 md:mb-0">
                      <Box className="h-5 w-5 text-blue-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium">Cantidad</div>
                        <div>{ticket.quantity} unidades</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-2 md:mb-0">
                      <Tag className="h-5 w-5 text-purple-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium">Puntos</div>
                        <div className="text-purple-600 font-medium">{ticket.points} puntos</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                      {ticket.ticket_number}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Ticket className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No tienes tickets de reciclaje</p>
                <p className="text-sm text-gray-400">
                  Registra tus materiales reciclados para obtener tickets y puntos
                </p>
              </div>
            )}
          </div>

          {/* Información sobre tickets */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-1">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Información sobre tus tickets</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Haz clic en cualquier ticket para ver los detalles completos. Los puntos se acreditan a tu cuenta una vez que el ticket es aprobado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para mostrar el detalle del ticket */}
      <Modal show={selectedTicket !== null} onClose={() => setSelectedTicket(null)} maxWidth="md">
        {selectedTicket && (
          <div className="p-6">
            <div className="text-center mb-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-50 mb-4">
                <Ticket className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-green-600">Detalle del Ticket</h2>
              <p className="mt-1 text-gray-600">Información completa de tu registro de reciclaje</p>
            </div>
            
            <div className="bg-green-50 border border-green-100 rounded-md p-4 text-center mb-4">
              <div className="text-sm text-gray-600 mb-2">Número de ticket:</div>
              <div className="font-mono bg-white border border-gray-200 rounded-md p-3 text-lg text-center relative">
                {selectedTicket.ticket_number || `ECO-${selectedTicket.id}`}
                <button 
                  onClick={() => copyToClipboard(selectedTicket.ticket_number || `ECO-${selectedTicket.id}`)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Copiar al portapapeles"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white border border-gray-100 rounded-md p-3">
                <div className="text-sm font-medium text-gray-500">Estado</div>
                <div className="mt-1 flex items-center">
                  {selectedTicket.status === 'Aprobado' && <CheckCircle className="h-4 w-4 text-green-500 mr-2" />}
                  <span>{selectedTicket.status}</span>
                </div>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-md p-3">
                <div className="text-sm font-medium text-gray-500">Fecha de registro</div>
                <div className="mt-1 flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  {selectedTicket.date}
                </div>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-md p-3">
                <div className="text-sm font-medium text-gray-500">Material</div>
                <div className="mt-1 flex items-center">
                  <Archive className="h-4 w-4 text-red-500 mr-2" />
                  {selectedTicket.material}
                </div>
              </div>
              
              <div className="bg-white border border-gray-100 rounded-md p-3">
                <div className="text-sm font-medium text-gray-500">Cantidad</div>
                <div className="mt-1 flex items-center">
                  <Box className="h-4 w-4 text-blue-500 mr-2" />
                  {selectedTicket.quantity} unidades
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-100 rounded-md p-4 mb-4">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-700">Puntos obtenidos:</div>
                <div className="text-2xl font-bold text-purple-600 mt-1">{selectedTicket.points}</div>
              </div>
            </div>
            
            {selectedTicket.comments && (
              <div className="bg-gray-50 border border-gray-100 rounded-md p-4 mb-4">
                <div className="text-sm font-medium text-gray-700 mb-1">Comentarios:</div>
                <p className="text-gray-600">{selectedTicket.comments}</p>
              </div>
            )}
            
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white tracking-widest hover:bg-green-700 focus:bg-green-700 focus:outline-none"
                onClick={() => setSelectedTicket(null)}
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