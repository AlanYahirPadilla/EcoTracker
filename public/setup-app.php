<?php
// Este script verifica y crea todos los archivos necesarios para la aplicación

$baseDir = dirname(__DIR__);
$resourcesDir = $baseDir . '/resources';
$jsDir = $resourcesDir . '/js';
$cssDir = $resourcesDir . '/css';
$pagesDir = $jsDir . '/Pages';
$authDir = $pagesDir . '/Auth';
$componentsDir = $jsDir . '/Components';
$layoutsDir = $jsDir . '/Layouts';

echo "Configurando la aplicación EcoTracker...\n\n";

// Crear directorios si no existen
$directories = [
    $resourcesDir,
    $jsDir,
    $cssDir,
    $pagesDir,
    $authDir,
    $componentsDir,
    $layoutsDir
];

foreach ($directories as $dir) {
    if (!is_dir($dir)) {
        echo "Creando directorio: " . str_replace($baseDir . '/', '', $dir) . "\n";
        mkdir($dir, 0755, true);
    }
}

// Crear archivo app.js
$appJsContent = <<<'EOT'
import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#16a34a',
    },
});
EOT;

file_put_contents($jsDir . '/app.js', $appJsContent);
echo "Archivo creado: resources/js/app.js\n";

// Crear archivo bootstrap.js
$bootstrapJsContent = <<<'EOT'
import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
EOT;

file_put_contents($jsDir . '/bootstrap.js', $bootstrapJsContent);
echo "Archivo creado: resources/js/bootstrap.js\n";

// Crear archivo app.css
$appCssContent = <<<'EOT'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOT;

file_put_contents($cssDir . '/app.css', $appCssContent);
echo "Archivo creado: resources/css/app.css\n";

// Crear componentes básicos
$inputErrorContent = <<<'EOT'
export default function InputError({ message, className = "", ...props }) {
    return message ? (
        <p {...props} className={`text-sm text-red-600 ${className}`}>
            {message}
        </p>
    ) : null;
}
EOT;

file_put_contents($componentsDir . '/InputError.jsx', $inputErrorContent);
echo "Archivo creado: resources/js/Components/InputError.jsx\n";

$inputLabelContent = <<<'EOT'
export default function InputLabel({ value, className = "", children, ...props }) {
    return (
        <label {...props} className={`block font-medium text-sm text-gray-700 ` + className}>
            {value ? value : children}
        </label>
    );
}
EOT;

file_put_contents($componentsDir . '/InputLabel.jsx', $inputLabelContent);
echo "Archivo creado: resources/js/Components/InputLabel.jsx\n";

$textInputContent = <<<'EOT'
import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = useRef(null);

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={`border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm ${className}`}
            ref={ref || input}
        />
    );
});
EOT;

file_put_contents($componentsDir . '/TextInput.jsx', $textInputContent);
echo "Archivo creado: resources/js/Components/TextInput.jsx\n";

$primaryButtonContent = <<<'EOT'
export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
EOT;

file_put_contents($componentsDir . '/PrimaryButton.jsx', $primaryButtonContent);
echo "Archivo creado: resources/js/Components/PrimaryButton.jsx\n";

$checkboxContent = <<<'EOT'
export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500 ' +
                className
            }
        />
    );
}
EOT;

file_put_contents($componentsDir . '/Checkbox.jsx', $checkboxContent);
echo "Archivo creado: resources/js/Components/Checkbox.jsx\n";

// Crear layout de invitado
$guestLayoutContent = <<<'EOT'
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div>
                <Link href="/">
                    <h1 className="text-3xl font-bold text-green-600">EcoTracker</h1>
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
EOT;

file_put_contents($layoutsDir . '/GuestLayout.jsx', $guestLayoutContent);
echo "Archivo creado: resources/js/Layouts/GuestLayout.jsx\n";

// Crear página de login
$loginContent = <<<'EOT'
import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="ml-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
EOT;

file_put_contents($authDir . '/Login.jsx', $loginContent);
echo "Archivo creado: resources/js/Pages/Auth/Login.jsx\n";

// Crear archivo jsconfig.json para alias @
$jsconfigContent = <<<'EOT'
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["resources/js/*"]
        }
    },
    "exclude": ["node_modules", "public"]
}
EOT;

file_put_contents($baseDir . '/jsconfig.json', $jsconfigContent);
echo "Archivo creado: jsconfig.json\n";

echo "\nConfiguración completada. Ahora ejecuta:\n";
echo "npm run build\n";
?>