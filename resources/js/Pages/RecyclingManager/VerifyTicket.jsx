// resources/js/Pages/RecyclingManager/VerifyTicket.jsx
import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { QrCode, Coffee, ArrowLeft, CheckCircle } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function VerifyTicket({ auth, redemption }) {
    const { post, processing } = useForm();

    const handleComplete = () => {
        if (confirm('¿Estás seguro de completar este canje? Los puntos se transferirán a tu cuenta.')) {
            post(route('recycling-manager.complete', redemption.id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Verificación de Ticket</h2>}
        >
            <Head title="Verificación de Ticket" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="mb-6">
                            <Link
                                href={route('recycling-manager.dashboard')}
                                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Volver al dashboard
                            </Link>
                        </div>

                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                <QrCode className="h-8 w-8 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Ticket Válido</h1>
                            <p className="text-gray-500">Este ticket puede ser canjeado</p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Código</p>
                                    <p className="text-lg font-mono">{redemption.code}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Fecha de Creación</p>
                                    <p className="text-lg">{redemption.created_at}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Recompensa</p>
                                    <p className="text-lg">{redemption.reward}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Puntos</p>
                                    <p className="text-lg font-semibold text-green-700">{redemption.points} pts</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-sm font-medium text-gray-500">Descripción</p>
                                    <p className="text-lg">{redemption.description}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-sm font-medium text-gray-500">Usuario</p>
                                    <p className="text-lg">{redemption.user.name} (ID: {redemption.user.id})</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-700">
                                        Al completar este canje, los puntos serán transferidos a tu cuenta y no se podrá revertir esta acción.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="button"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                onClick={handleComplete}
                                disabled={processing}
                            >
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Completar Canje y Transferir Puntos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}