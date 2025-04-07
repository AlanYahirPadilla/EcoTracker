// resources/js/Pages/RecyclingManager/Dashboard.jsx
import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { QrCode, Coffee, Clock, History, CheckCheck, AlertCircle } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react'; 

export default function Dashboard({ auth, pendingRedemptions, recentRedemptions, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const [activeTab, setActiveTab] = useState('pendientes');

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/recycling-manager/verify-ticket');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Panel de Canjes</h2>}
        >
            <Head title="Panel de Canjes" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash && flash.success && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <CheckCheck className="h-5 w-5 text-green-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">{flash.success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sección de Verificar Ticket */}
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden mb-6">
                        <div className="bg-green-600 p-4 flex items-center">
                            <QrCode className="h-5 w-5 text-white mr-2" />
                            <h2 className="text-lg font-semibold text-white">Verificar Ticket de Canje</h2>
                        </div>
                        
                        <div className="p-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">Código del Ticket</label>
                                    <div className="mt-1 flex items-center">
                                        <input
                                            type="text"
                                            name="code"
                                            id="code"
                                            value={data.code}
                                            onChange={e => setData('code', e.target.value)}
                                            className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                            placeholder="Ingresa el código del ticket"
                                        />
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Verificar
                                        </button>
                                    </div>
                                    {errors.code && <p className="mt-2 text-sm text-red-600">{errors.code}</p>}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Tabs de Canjes */}
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="flex" aria-label="Tabs">
                                <button 
                                    onClick={() => setActiveTab('pendientes')}
                                    className={`py-4 px-6 font-medium border-b-2 flex items-center ${
                                        activeTab === 'pendientes' 
                                            ? 'text-green-600 border-green-500' 
                                            : 'text-gray-500 border-transparent hover:text-gray-700'
                                    }`}
                                >
                                    <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                                    Canjes Pendientes
                                </button>
                                
                                <button 
                                    onClick={() => setActiveTab('recientes')}
                                    className={`py-4 px-6 font-medium border-b-2 flex items-center ${
                                        activeTab === 'recientes' 
                                            ? 'text-green-600 border-green-500' 
                                            : 'text-gray-500 border-transparent hover:text-gray-700'
                                    }`}
                                >
                                    <CheckCheck className="h-5 w-5 mr-2 text-green-500" />
                                    Canjes Recientes
                                </button>
                            </nav>
                        </div>

                        {/* Contenido según la pestaña activa */}
                        <div className="p-4">
                            {activeTab === 'pendientes' ? (
                                // Contenido de canjes pendientes (ya existente)
                                pendingRedemptions.length === 0 ? (
                                    <div className="py-8 text-center">
                                        <Clock className="mx-auto h-12 w-12 text-gray-300" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay canjes pendientes</h3>
                                        <p className="mt-1 text-sm text-gray-500">Los nuevos canjes pendientes aparecerán aquí.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {pendingRedemptions.map((redemption) => (
                                            <div key={redemption.id} className="p-4 border border-yellow-100 rounded-md bg-yellow-50 flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">{redemption.reward}</div>
                                                    <div className="text-sm text-gray-500">Usuario: {redemption.user} | Código: {redemption.code}</div>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-yellow-600 font-medium mr-4">{redemption.points} pts</span>
                                                    <button 
                                                        type="button"
                                                        className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                                                        onClick={() => {
                                                            router.post('/recycling-manager/verify-ticket', {
                                                                code: redemption.code
                                                            });
                                                        }}
                                                    >
                                                        Verificar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : (
                                // Contenido de canjes recientes (nuevo)
                                recentRedemptions.length === 0 ? (
                                    <div className="py-8 text-center">
                                        <CheckCheck className="mx-auto h-12 w-12 text-gray-300" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay canjes recientes</h3>
                                        <p className="mt-1 text-sm text-gray-500">Los canjes que completes aparecerán aquí.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {recentRedemptions.map((redemption) => (
                                            <div key={redemption.id} className="p-4 border border-green-100 rounded-md bg-green-50 flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">{redemption.reward}</div>
                                                    <div className="text-sm text-gray-500">Usuario: {redemption.user} | Código: {redemption.code}</div>
                                                    <div className="text-xs text-gray-400">Completado: {redemption.completed_at}</div>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-green-600 font-medium">{redemption.points} pts</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}

                            <div className="mt-4 text-center">
                                <a href="/recycling-manager/history" className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900">
                                    <History className="h-4 w-4 mr-1" />
                                    Ver historial completo
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}