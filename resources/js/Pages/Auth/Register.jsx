// resources/js/Pages/Auth/Register.jsx
import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Leaf } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        student_id: '',
        career: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    const careers = [
        { value: 'ing_informatica', label: 'Ingeniería Informática' },
        { value: 'ing_computacion', label: 'Ingeniería en Computación' },
        { value: 'ing_quimica', label: 'Ingeniería Química' },
        { value: 'ing_civil', label: 'Ingeniería Civil' },
        { value: 'ing_industrial', label: 'Ingeniería Industrial' },
        { value: 'ing_biomedica', label: 'Ingeniería Biomédica' },
        { value: 'lic_quimica', label: 'Licenciatura en Química' },
        { value: 'lic_fisica', label: 'Licenciatura en Física' },
        { value: 'lic_matematicas', label: 'Licenciatura en Matemáticas' },
    ];

    return (
        <>
            <Head title="Registro" />

            <div className="min-h-screen flex flex-col">
                <header className="bg-green-600 text-white py-4">
                    <div className="container mx-auto px-4">
                        <Link href="/" className="flex items-center gap-2 w-fit">
                            <Leaf className="h-6 w-6" />
                            <h1 className="text-2xl font-bold">EcoTracker</h1>
                        </Link>
                    </div>
                </header>

                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-center mb-2">Crear una cuenta</h2>
                        <p className="text-gray-600 text-center mb-6">
                            Regístrate para comenzar a reciclar y ganar puntos
                        </p>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Nombre Completo
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={data.name}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Tu nombre completo"
                                    required
                                />
                                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Correo Electrónico
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="tu@correo.com"
                                    required
                                />
                                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                            </div>

                            <div>
                                <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
                                    Código de Estudiante
                                </label>
                                <input
                                    id="student_id"
                                    type="text"
                                    name="student_id"
                                    value={data.student_id}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    onChange={(e) => setData('student_id', e.target.value)}
                                    placeholder="Ej: 123456789"
                                    required
                                />
                                {errors.student_id && (
                                    <div className="text-red-500 text-sm mt-1">{errors.student_id}</div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="career" className="block text-sm font-medium text-gray-700">
                                    Carrera
                                </label>
                                <select
                                    id="career"
                                    name="career"
                                    value={data.career}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    onChange={(e) => setData('career', e.target.value)}
                                    required
                                >
                                    <option value="">Selecciona tu carrera</option>
                                    {careers.map((career) => (
                                        <option key={career.value} value={career.value}>
                                            {career.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.career && <div className="text-red-500 text-sm mt-1">{errors.career}</div>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && (
                                    <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                    Confirmar Contraseña
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Crear Cuenta
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            ¿Ya tienes una cuenta?{' '}
                            <Link href={route('login')} className="text-green-600 hover:text-green-500">
                                Inicia Sesión
                            </Link>
                        </div>
                    </div>
                </div>

                <footer className="bg-gray-100 py-6">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-gray-600">© 2025 EcoTracker - CUCEI. Todos los derechos reservados.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}