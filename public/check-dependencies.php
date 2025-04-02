<?php

// Verificar si se está ejecutando desde la línea de comandos
if (php_sapi_name() === 'cli') {
    echo "Este script debe ejecutarse desde un navegador web.\n";
    exit(1);
}

// Función para verificar si una clase existe
function check_class($class) {
    return class_exists($class) ? 'Disponible' : 'No disponible';
}

// Función para verificar si un trait existe
function check_trait($trait) {
    return trait_exists($trait) ? 'Disponible' : 'No disponible';
}

// Función para verificar si un archivo existe
function check_file($path) {
    return file_exists($path) ? 'Existe' : 'No existe';
}

// Obtener la ruta base
$basePath = realpath(__DIR__ . '/..');

// Verificar dependencias de Laravel
$laravelDependencies = [
    'Illuminate\Foundation\Application' => check_class('Illuminate\Foundation\Application'),
    'Illuminate\Support\Facades\Route' => check_class('Illuminate\Support\Facades\Route'),
    'Illuminate\Support\Facades\Auth' => check_class('Illuminate\Support\Facades\Auth'),
    'Illuminate\Support\Facades\DB' => check_class('Illuminate\Support\Facades\DB'),
];

// Verificar dependencias de Jetstream
$jetstreamDependencies = [
    'Laravel\Jetstream\Jetstream' => check_class('Laravel\Jetstream\Jetstream'),
    'Laravel\Jetstream\HasProfilePhoto' => check_trait('Laravel\Jetstream\HasProfilePhoto'),
    'Laravel\Fortify\TwoFactorAuthenticatable' => check_trait('Laravel\Fortify\TwoFactorAuthenticatable'),
];

// Verificar dependencias de Inertia
$inertiaDependencies = [
    'Inertia\Inertia' => check_class('Inertia\Inertia'),
    'Inertia\Response' => check_class('Inertia\Response'),
];

// Verificar archivos importantes
$importantFiles = [
    'composer.json' => check_file($basePath . '/composer.json'),
    'package.json' => check_file($basePath . '/package.json'),
    '.env' => check_file($basePath . '/.env'),
    'app/Models/User.php' => check_file($basePath . '/app/Models/User.php'),
    'routes/web.php' => check_file($basePath . '/routes/web.php'),
];

// Verificar si composer.json contiene Jetstream
$composerJson = file_exists($basePath . '/composer.json') ? file_get_contents($basePath . '/composer.json') : '{}';
$composerData = json_decode($composerJson, true);
$hasJetstream = isset($composerData['require']['laravel/jetstream']);
$jetstreamVersion = $hasJetstream ? $composerData['require']['laravel/jetstream'] : 'No instalado';

// Verificar si package.json contiene @inertiajs/react
$packageJson = file_exists($basePath . '/package.json') ? file_get_contents($basePath . '/package.json') : '{}';
$packageData = json_decode($packageJson, true);
$hasInertiaReact = isset($packageData['dependencies']['@inertiajs/react']);
$inertiaReactVersion = $hasInertiaReact ? $packageData['dependencies']['@inertiajs/react'] : 'No instalado';

// Mostrar resultados
echo '<html><head><title>Verificación de Dependencias</title>';
echo '<style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
    h1, h2 { color: #333; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
    .available { color: green; }
    .not-available { color: red; }
    .warning { background-color: #fff3cd; }
</style>';
echo '</head><body>';
echo '<h1>Verificación de Dependencias de Laravel</h1>';

echo '<h2>Dependencias de Laravel</h2>';
echo '<table><tr><th>Clase</th><th>Estado</th></tr>';
foreach ($laravelDependencies as $class => $status) {
    $statusClass = $status === 'Disponible' ? 'available' : 'not-available';
    echo "<tr><td>$class</td><td class=\"$statusClass\">$status</td></tr>";
}
echo '</table>';

echo '<h2>Dependencias de Jetstream</h2>';
echo '<table><tr><th>Clase/Trait</th><th>Estado</th></tr>';
foreach ($jetstreamDependencies as $class => $status) {
    $statusClass = $status === 'Disponible' ? 'available' : 'not-available';
    echo "<tr><td>$class</td><td class=\"$statusClass\">$status</td></tr>";
}
echo '</table>';

echo '<h2>Dependencias de Inertia</h2>';
echo '<table><tr><th>Clase</th><th>Estado</th></tr>';
foreach ($inertiaDependencies as $class => $status) {
    $statusClass = $status === 'Disponible' ? 'available' : 'not-available';
    echo "<tr><td>$class</td><td class=\"$statusClass\">$status</td></tr>";
}
echo '</table>';

echo '<h2>Archivos Importantes</h2>';
echo '<table><tr><th>Archivo</th><th>Estado</th></tr>';
foreach ($importantFiles as $file => $status) {
    $statusClass = $status === 'Existe' ? 'available' : 'not-available';
    echo "<tr><td>$file</td><td class=\"$statusClass\">$status</td></tr>";
}
echo '</table>';

echo '<h2>Información de Paquetes</h2>';
echo '<table>';
echo '<tr><th>Paquete</th><th>Versión</th></tr>';
echo "<tr><td>laravel/jetstream</td><td>$jetstreamVersion</td></tr>";
echo "<tr><td>@inertiajs/react</td><td>$inertiaReactVersion</td></tr>";
echo '</table>';

// Mostrar recomendaciones
echo '<h2>Recomendaciones</h2>';
echo '<ul>';

if (!$hasJetstream && check_trait('Laravel\Jetstream\HasProfilePhoto') === 'No disponible') {
    echo '<li class="warning">El trait Laravel\Jetstream\HasProfilePhoto no está disponible, pero se está utilizando en el modelo User. Debes instalar Jetstream o modificar el modelo User para eliminar esta dependencia.</li>';
}

if (!$hasInertiaReact && check_class('Inertia\Inertia') === 'No disponible') {
    echo '<li class="warning">Inertia.js no está instalado correctamente. Debes instalar @inertiajs/react para que la aplicación funcione correctamente.</li>';
}

echo '</ul>';

echo '</body></html>';

