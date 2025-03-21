import React from 'react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Ticket, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function Tickets({ auth, tickets = [] }) {
    // Datos de ejemplo para la vista
    const ticketsList = tickets.length > 0 ? tickets : [
        { id: 1, code: 'ECO-7890', date: '2025-03-14', material: 'Cartón', quantity: 5, points: 10, status: 'Pendiente' },
        { id: 2, code: 'ECO-4567', date: '2025-03-10', material: 'Papel', quantity: 15, points: 30, status: 'Aprobado' },
        { id: 3, code: 'ECO-1234', date: '2025-03-05', material: 'Plástico', quantity: 20, points: 40, status: 'Aprobado' },
        { id: 4, code: 'ECO-9876', date: '2025-02-28', material: 'Aluminio', quantity: 10, points: 50, status: 'Aprobado' },
        { id: 5, code: 'ECO-5432', date: '2025-02-20', material: 'Vidrio', quantity: 8, points: 24, status: 'Rechazado' },
    ];

    return (
        <Authenticated
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mis Tickets</h2>}
        >
            <Head title="Mis Tickets" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Ticket className="h-6 w-6 text-green-600" />
                            <h3 className="text-lg font-medium">Tickets de Reciclaje</h3>
                        </div>

                        {ticketsList.length === 0 ? (
                            <div className="text-center py-8">
                                <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No tienes tickets de reciclaje</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {ticketsList.map((ticket) => (
                                    <div key={ticket.id} className="border rounded-lg overflow-hidden">
                                        <div className={`px-4 py-3 flex justify-between items-center ${
                                            ticket.status === 'Aprobado' 
                                                ? 'bg-green-50 border-b border-green-100' 
                                                : ticket.status === 'Rechazado'
                                                    ? 'bg-red-50 border-b border-red-100'
                                                    : 'bg-yellow-50 border-b border-yellow-100'
                                        }`}>
                                            <div className="flex items-center gap-2">
                                                {ticket.status === 'Aprobado' ? (
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                ) : ticket.status === 'Rechazado' ? (
                                                    <XCircle className="h-5 w-5 text-red-600" />
                                                ) : (
                                                    <Clock className="h-5 w-5 text-yellow-600" />
                                                )}
                                                <span className={`font-medium ${
                                                    ticket.status === 'Aprobado' 
                                                        ? 'text-green-800' 
                                                        : ticket.status === 'Rechazado'
                                                            ? 'text-red-800'
                                                            : 'text-yellow-800'
                                                }`}>
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-600">{ticket.date}</span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Número de Ticket</p>
                                                    <p className="text-lg font-mono font-bold">{ticket.code}</p>
                                                </div>
                                                <div className="bg-green-50 px-4 py-2 rounded-lg">
                                                    <p className="text-sm text-gray-500">Puntos</p>
                                                    <p className="text-xl font-bold text-green-600">
                                                        {ticket.status === 'Aprobado' ? ticket.points : ticket.status === 'Pendiente' ? `${ticket.points} (estimados)` : '0'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Material</p>
                                                    <p className="font-medium">{ticket.material}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Cantidad</p>
                                                    <p className="font-medium">{ticket.quantity} unidades</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}