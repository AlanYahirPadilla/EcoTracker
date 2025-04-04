<?php
// Este script verifica la estructura de directorios y archivos clave

$baseDir = dirname(__DIR__);
$resourcesDir = $baseDir . '/resources';
$jsDir = $resourcesDir . '/js';
$cssDir = $resourcesDir . '/css';

echo "Verificando estructura de directorios...\n";

// Verificar directorios clave
$directories = [
    $resourcesDir => 'resources',
    $jsDir => 'resources/js',
    $cssDir => 'resources/css',
    $jsDir . '/Pages' => 'resources/js/Pages',
    $jsDir . '/Components' => 'resources/js/Components',
    $jsDir . '/Layouts' => 'resources/js/Layouts',
];

foreach ($directories as $dir => $path) {
    if (is_dir($dir)) {
        echo "✓ Directorio $path existe\n";
    } else {
        echo "✗ Directorio $path no existe - creando...\n";
        mkdir($dir, 0755, true);
        echo "  Directorio $path creado\n";
    }
}

// Verificar archivos clave
$files = [
    $jsDir . '/app.js' => 'resources/js/app.js',
    $cssDir . '/app.css' => 'resources/css/app.css',
    $baseDir . '/vite.config.js' => 'vite.config.js',
];

foreach ($files as $file => $path) {
    if (file_exists($file)) {
        echo "✓ Archivo $path existe\n";
    } else {
        echo "✗ Archivo $path no existe\n";
    }
}

echo "\nVerificación completada.\n";

