<?php
// Este script reconstruye los assets de la aplicación

echo "Reconstruyendo assets...\n";

// Limpiar caché de npm
echo "Limpiando caché de npm...\n";
echo shell_exec('cd ' . dirname(__DIR__) . ' && npm cache clean --force');

// Instalar dependencias
echo "Instalando dependencias...\n";
echo shell_exec('cd ' . dirname(__DIR__) . ' && npm install');

// Construir assets
echo "Construyendo assets...\n";
echo shell_exec('cd ' . dirname(__DIR__) . ' && npm run build');

echo "\nReconstrucción completada.\n";

