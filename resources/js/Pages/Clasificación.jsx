import React from 'react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Trophy, Award } from 'lucide-react';

export default function Ranking({ auth, topUsers = [], userRank = {} }) {
    return (
        <Authenticated
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ranking de Reciclaje</h2>}
        >
            <Head title="Ranking" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {/* Tu posición */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                    <div className="p-6">
                        <h3 className="text-lg font-medium mb-4">Tu Posición en el Ranking</h3>
                        <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <Trophy className="h-8 w-8 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Posición</p>
                                    <p className="text-2xl font-bold text-green-600">#{userRank.position || 15}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Puntos Totales</p>
                                <p className="text-xl font-bold">{userRank.points || 160} pts</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Nivel</p>
                                <p className="text-xl font-bold">{userRank.level || 'Principiante'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Puntos para subir</p>
                                <p className="text-xl font-bold">{userRank.pointsToNextLevel || 50} pts</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Recicladores */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <h3 className="text-lg font-medium mb-4">Top Recicladores</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {/* Top 3 destacados */}
                            {[
                                { position: 1, name: 'María López', points: 850, icon: <Award className="h-10 w-10 text-yellow-500" /> },
                                { position: 2, name: 'Carlos Rodríguez', points: 720, icon: <Award className="h-10 w-10 text-gray-400" /> },
                                { position: 3, name: 'Ana Martínez', points: 680, icon: <Award className="h-10 w-10 text-amber-700" /> },
                            ].map((user) => (
                                <div key={user.position} className="bg-gray-50 p-4 rounded-lg text-center">
                                    <div className="flex justify-center mb-2">{user.icon}</div>
                                    <p className="text-xl font-bold">#{user.position}</p>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-green-600 font-bold">{user.points} pts</p>
                                </div>
                            ))}
                        </div>
                        
                        {/* Tabla de ranking */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Posición
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usuario
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nivel
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Puntos
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Material Más Reciclado
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {[
                                        { position: 4, name: 'Pedro Sánchez', level: 'Experto', points: 620, material: 'Papel' },
                                        { position: 5, name: 'Laura González', level: 'Avanzado', points: 580, material: 'Plástico' },
                                        { position: 6, name: 'Miguel Torres', level: 'Avanzado', points: 540, material: 'Vidrio' },
                                        { position: 7, name: 'Sofía Ramírez', level: 'Intermedio', points: 490, material: 'Aluminio' },
                                        { position: 8, name: 'Javier Morales', level: 'Intermedio', points: 450, material: 'Cartón' },
                                        { position: 9, name: 'Carmen Vega', level: 'Intermedio', points: 410, material: 'Papel' },
                                        { position: 10, name: 'Roberto Flores', level: 'Principiante', points: 380, material: 'Electrónico' },
                                    ].map((user) => (
                                        <tr key={user.position}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">#{user.position}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{user.level}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-green-600">{user.points} pts</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{user.material}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}