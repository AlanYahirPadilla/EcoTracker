<?php

// Verificar si se está ejecutando desde la línea de comandos
if (php_sapi_name() === 'cli') {
    echo "Este script debe ejecutarse desde un navegador web.\n";
    exit(1);
}

// Cargar el framework de Laravel
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Obtener el kernel HTTP
$kernel = app()->make(\App\Http\Kernel::class);

// Obtener los middleware registrados
$middlewareGroups = $kernel->getMiddlewareGroups();
$middlewareAliases = $kernel->getMiddlewareAliases();

// Verificar si el middleware 'role' está registrado
$roleMiddlewareRegistered = isset($middlewareAliases['role']);
$roleMiddlewareClass = $roleMiddlewareRegistered ? $middlewareAliases['role'] : null;

// Verificar si la clase del middleware existe
$roleMiddlewareExists = $roleMiddlewareClass ? class_exists($roleMiddlewareClass) : false;

// Verificar el archivo del middleware
$middlewarePath = app_path('Http/Middleware/CheckRole.php');
$middlewareFileExists = file_exists($middlewarePath);
$middlewareContent = $middlewareFileExists ? file_get_contents($middlewarePath) : null;

// Mostrar resultados
echo '<html><head><title>Verificación de Middleware</title>';
echo '<style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
    h1, h2 { color: #333; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
    .available { color: green; }
    .not-available { color: red; }
    .warning { background-color: #fff3cd; }
    pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
    .button { display: inline-block; padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; }
</style>';
echo '</head><body>';
echo '<h1>Verificación de Middleware</h1>';

echo '<h2>Middleware "role"</h2>';
echo '<table>';
echo '<tr><th>Componente</th><th>Estado</th></tr>';
echo '<tr><td>Middleware registrado como "role"</td><td class="' . ($roleMiddlewareRegistered ? 'available' : 'not-available') . '">' . ($roleMiddlewareRegistered ? 'Sí' : 'No') . '</td></tr>';
if ($roleMiddlewareRegistered) {
    echo '<tr><td>Clase del middleware</td><td>' . $roleMiddlewareClass . '</td></tr>';
    echo '<tr><td>Clase existe</td><td class="' . ($roleMiddlewareExists ? 'available' : 'not-available') . '">' . ($roleMiddlewareExists ? 'Sí' : 'No') . '</td></tr>';
}
echo '<tr><td>Archivo del middleware</td><td class="' . ($middlewareFileExists ? 'available' : 'not-available') . '">' . ($middlewareFileExists ? 'Existe' : 'No existe') . '</td></tr>';
echo '</table>';

if ($middlewareFileExists) {
    echo '<h2>Contenido del Middleware</h2>';
    echo '<pre>' . htmlspecialchars($middlewareContent) . '</pre>';
}

echo '<h2>Middleware Registrados</h2>';
echo '<h3>Grupos de Middleware</h3>';
echo '<pre>' . htmlspecialchars(print_r($middlewareGroups, true)) . '</pre>';

echo '<h3>Aliases de Middleware</h3>';
echo '<pre>' . htmlspecialchars(print_r($middlewareAliases, true)) . '</pre>';

echo '<h2>Acciones</h2>';
echo '<div style="display: flex  true)) . '</pre>';

echo '<h2>Acciones</h2>';
echo '<div style="display: flex; gap: 10px;">';
echo '<a href="/check-js-conflicts" class="button">Verificar Conflictos JavaScript</a>';
echo '<a href="/check-dependencies" class="button">Verificar Dependencias</a>';
echo '<a href="/debug/admin-dashboard-view" class="button">Probar Vista Admin</a>';
echo '</div>';

echo '</body></html>';

