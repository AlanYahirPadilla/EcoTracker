<?php
// Este script limpia la caché y reinicia la aplicación

echo "Limpiando caché de Laravel...\n";
echo shell_exec('cd ' . dirname(__DIR__) . ' && php artisan cache:clear');
echo shell_exec('cd ' . dirname(__DIR__) . ' && php artisan config:clear');
echo shell_exec('cd ' . dirname(__DIR__) . ' && php artisan route:clear');
echo shell_exec('cd ' . dirname(__DIR__) . ' && php artisan view:clear');

echo "\nLimpiando caché de Vite...\n";
if (is_dir(dirname(__DIR__) . '/node_modules/.vite')) {
    echo shell_exec('rm -rf ' . dirname(__DIR__) . '/node_modules/.vite');
    echo "Caché de Vite eliminada\n";
} else {
    echo "No se encontró caché de Vite\n";
}

echo "\nVerificando permisos de storage y bootstrap/cache...\n";
echo shell_exec('cd ' . dirname(__DIR__) . ' && chmod -R 775 storage bootstrap/cache');
echo "Permisos actualizados\n";

echo "\nReiniciando servidor PHP...\n";
echo "Nota: Esta operación puede no funcionar en todos los entornos\n";
echo "Si el servidor no se reinicia automáticamente, reinícialo manualmente\n";

