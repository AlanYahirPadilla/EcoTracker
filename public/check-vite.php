<?php
// Este script verifica la configuración de Vite y los archivos JSX

// Verificar si el archivo vite.config.js existe
$viteConfig = file_exists(dirname(__DIR__) . '/vite.config.js');
echo "Archivo vite.config.js: " . ($viteConfig ? "Existe" : "No existe") . "\n";

// Verificar si el directorio node_modules existe
$nodeModules = is_dir(dirname(__DIR__) . '/node_modules');
echo "Directorio node_modules: " . ($nodeModules ? "Existe" : "No existe") . "\n";

// Verificar si el directorio resources/js/Pages existe
$pagesDir = is_dir(dirname(__DIR__) . '/resources/js/Pages');
echo "Directorio resources/js/Pages: " . ($pagesDir ? "Existe" : "No existe") . "\n";

// Verificar si el archivo resources/js/app.js existe
$appJs = file_exists(dirname(__DIR__) . '/resources/js/app.js');
echo "Archivo resources/js/app.js: " . ($appJs ? "Existe" : "No existe") . "\n";

// Verificar si el archivo public/build/manifest.json existe
$manifestJson = file_exists(dirname(__DIR__) . '/public/build/manifest.json');
echo "Archivo public/build/manifest.json: " . ($manifestJson ? "Existe" : "No existe") . "\n";

// Listar archivos JSX en resources/js/Pages
echo "\nArchivos JSX en resources/js/Pages:\n";
$pagesPath = dirname(__DIR__) . '/resources/js/Pages';
if (is_dir($pagesPath)) {
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($pagesPath, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );
    
    foreach ($iterator as $file) {
        if ($file->isFile() && $file->getExtension() === 'jsx') {
            echo "- " . str_replace(dirname(__DIR__) . '/', '', $file->getPathname()) . "\n";
        }
    }
} else {
    echo "El directorio resources/js/Pages no existe\n";
}

// Verificar permisos de directorios
echo "\nPermisos de directorios:\n";
$directories = [
    'resources/js',
    'resources/js/Pages',
    'public/build',
    'storage/logs',
];

foreach ($directories as $dir) {
    $path = dirname(__DIR__) . '/' . $dir;
    if (is_dir($path)) {
        $perms = substr(sprintf('%o', fileperms($path)), -4);
        echo "- $dir: $perms\n";
    } else {
        echo "- $dir: No existe\n";
    }
}

// Verificar si hay errores en el log de Laravel
echo "\nÚltimas líneas del log de Laravel:\n";
$logPath = dirname(__DIR__) . '/storage/logs/laravel.log';
if (file_exists($logPath)) {
    $log = file($logPath);
    $lastLines = array_slice($log, -20);
    foreach ($lastLines as $line) {
        echo $line;
    }
} else {
    echo "El archivo de log no existe\n";
}

