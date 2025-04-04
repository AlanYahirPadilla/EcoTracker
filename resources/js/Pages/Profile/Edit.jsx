import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { User, ArrowLeft } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'password', 'account'

    return (
        <AuthenticatedLayout user={user}>
            <Head title="Editar Perfil" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 mb-6">
                    <Link href={route('profile')} className="text-green-600 hover:text-green-800 flex items-center">
                        <ArrowLeft size={20} />
                        <span className="ml-1">Volver al perfil</span>
                    </Link>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Perfil</h2>

                {/* Pestañas de navegación */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                            activeTab === 'profile'
                                ? 'border-b-2 border-green-500 text-green-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Información Personal
                    </button>
                    <button
                        className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                            activeTab === 'password'
                                ? 'border-b-2 border-green-500 text-green-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('password')}
                    >
                        Contraseña
                    </button>
                    <button
                        className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                            activeTab === 'account'
                                ? 'border-b-2 border-green-500 text-green-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('account')}
                    >
                        Eliminar Cuenta
                    </button>
                </div>

                <div className="mx-auto max-w-4xl space-y-6">
                    {activeTab === 'profile' && (
                        <div className="bg-white p-6 shadow rounded-lg">
                            <div className="flex items-start">
                                <div className="mr-8">
                                    <div className="h-32 w-32 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                                        <User size={64} />
                                    </div>
                                    <div className="text-center">
                                        <label className="block w-full bg-green-50 hover:bg-green-100 text-green-600 font-medium py-2 px-4 rounded cursor-pointer transition duration-150 ease-in-out">
                                            Cambiar foto
                                            <input type="file" className="hidden" />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2">Imagen de máximo 1MB</p>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="max-w-xl"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <div className="bg-white p-6 shadow rounded-lg">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <div className="bg-white p-6 shadow rounded-lg">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
