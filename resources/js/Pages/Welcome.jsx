import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { Leaf, ArrowRight, Recycle, Trophy, Users } from 'lucide-react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Bienvenido" />
            <div className="flex flex-col min-h-screen">
                <header className="bg-green-600 text-white py-4">
                    <div className="container mx-auto px-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Leaf className="h-6 w-6" />
                            <h1 className="text-2xl font-bold">EcoTracker</h1>
                        </div>
                        <div className="flex gap-4">
                            {auth.user ? (
                                <Link href={route('dashboard')} className="font-semibold text-white hover:text-white/80">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 border border-white text-white rounded-md hover:bg-green-700"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 bg-white text-green-600 rounded-md hover:bg-gray-100"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1">
                    <section className="py-12 text-center">
                        <div className="container mx-auto px-4">
                            <h2 className="text-4xl font-bold mb-4">Recicla, Acumula Puntos, Obtén Recompensas</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                Únete a la iniciativa de sustentabilidad del CUCEI y contribuye a un campus más verde mientras
                                obtienes beneficios.
                            </p>
                            <Link
                                href={route('register')}
                                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Comenzar Ahora <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </section>

                    <section className="py-12 bg-gray-50">
                        <div className="container mx-auto px-4">
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <div className="flex flex-col items-center">
                                        <Recycle className="h-12 w-12 text-green-600 mb-4" />
                                        <h3 className="text-xl font-bold mb-2">Registra tu Reciclaje</h3>
                                        <p className="text-gray-600 text-center">
                                            Documenta los materiales que reciclas y obtén puntos por cada aportación.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <div className="flex flex-col items-center">
                                        <Trophy className="h-12 w-12 text-green-600 mb-4" />
                                        <h3 className="text-xl font-bold mb-2">Gana Recompensas</h3>
                                        <p className="text-gray-600 text-center">
                                            Canjea tus puntos por descuentos en la cafetería, productos ecológicos o puntos extra
                                            en materias.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm">
                                    <div className="flex flex-col items-center">
                                        <Users className="h-12 w-12 text-green-600 mb-4" />
                                        <h3 className="text-xl font-bold mb-2">Compite y Colabora</h3>
                                        <p className="text-gray-600 text-center">
                                            Participa en el ranking de reciclaje y contribuye a las metas colectivas del campus.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="py-12">
                        <div className="container mx-auto px-4">
                            <div className="max-w-4xl mx-auto">
                                <div className="border-b border-gray-200">
                                    <nav className="-mb-px flex">
                                        <button className="w-1/3 py-4 px-1 text-center border-b-2 border-green-600 font-medium text-green-600">
                                            Estudiantes
                                        </button>
                                        <button className="w-1/3 py-4 px-1 text-center border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                                            Encargados de Reciclaje
                                        </button>
                                        <button className="w-1/3 py-4 px-1 text-center border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                                            Administradores
                                        </button>
                                    </nav>
                                </div>
                                <div className="p-4 border-l border-r border-b rounded-b-md mt-0">
                                    <h3 className="text-xl font-bold mb-2">Para Estudiantes</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Registra tus materiales reciclados</li>
                                        <li>Acumula puntos por cada aportación</li>
                                        <li>Visualiza tu historial de reciclaje</li>
                                        <li>Canjea puntos por recompensas</li>
                                        <li>Compite en el ranking de reciclaje</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="bg-gray-100 py-6">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-gray-600">© 2025 EcoTracker - CUCEI. Todos los derechos reservados.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}