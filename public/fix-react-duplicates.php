<?php

// Verificar si se está ejecutando desde la línea de comandos
if (php_sapi_name() === 'cli') {
    echo "Este script debe ejecutarse desde un navegador web.\n";
    exit(1);
}

// Función para verificar si hay múltiples archivos de React
function check_multiple_react_versions() {
    $publicDir = __DIR__;
    $jsFiles = glob($publicDir . '/js/*.js');
    $reactFiles = [];
    
    foreach ($jsFiles as $file) {
        $content = file_get_contents($file);
        if (strpos($content, 'React') !== false) {
            $reactFiles[] = [
                'path' => str_replace($publicDir, '', $file),
                'size' => filesize($file),
                'modified' => date('Y-m-d H:i:s', filemtime($file))
            ];
        }
    }
    
    return $reactFiles;
}

// Función para eliminar archivos duplicados de React
function fix_react_duplicates() {
    $publicDir = __DIR__;
    $jsFiles = glob($publicDir . '/js/*.js');
    $reactFiles = [];
    $deletedFiles = [];
    
    // Identificar archivos de React
    foreach ($jsFiles as $file) {
        $content = file_get_contents($file);
        if (strpos($content, 'React') !== false) {
            $reactFiles[] = [
                'path' => $file,
                'size' => filesize($file),
                'modified' => filemtime($file)
            ];
        }
    }
    
    // Ordenar por fecha de modificación (más reciente primero)
    usort($reactFiles, function($a, $b) {
        return $b['modified'] - $a['modified'];
    });
    
    // Mantener solo el archivo más reciente
    if (count($reactFiles) > 1) {
        $keepFile = array_shift($reactFiles);
        
        // Eliminar los archivos duplicados
        foreach ($reactFiles as $file) {
            $backupPath = $file['path'] . '.bak';
            rename($file['path'], $backupPath);
            $deletedFiles[] = [
                'original' => $file['path'],
                'backup' => $backupPath
            ];
        }
    }
    
    return [
        'kept' => isset($keepFile) ? $keepFile['path'] : null,
        'deleted' => $deletedFiles
    ];
}

// Verificar múltiples versiones de React
$reactFiles = check_multiple_react_versions();

// Verificar si se solicitó la corrección
$fixRequested = isset($_GET['fix']) && $_GET['fix'] === 'true';
$fixResult = null;

if ($fixRequested && count($reactFiles) > 1) {
    $fixResult = fix_react_duplicates();
}

// Mostrar resultados
echo '<html><head><title>Solución de Problemas con React</title>';
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
    .button.warning { background-color: #f0ad4e; }
    .button.danger { background-color: #d9534f; }
    .success-message { background-color: #d4edda; border-color: #c3e6cb; color: #155724; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
</style>';
echo '</head><body>';
echo '<h1>Solución de Problemas con React</h1>';

// Mostrar mensaje de éxito si se corrigieron los problemas
if ($fixResult) {
    echo '<div class="success-message">';
    echo '<h3>Corrección aplicada correctamente</h3>';
    echo '<p>Se ha mantenido el archivo más reciente: <strong>' . $fixResult['kept'] . '</strong></p>';
    
    if (count($fixResult['deleted']) > 0) {
        echo '<p>Se han movido los siguientes archivos duplicados:</p>';
        echo '<ul>';
        foreach ($fixResult['deleted'] as $file) {
            echo '<li>Original: <strong>' . $file['original'] . '</strong> → Backup: <strong>' . $file['backup'] . '</strong></li>';
        }
        echo '</ul>';
    }
    
    echo '<p>Por favor, recarga la página para verificar que los problemas se han solucionado.</p>';
    echo '</div>';
}

echo '<h2>Archivos de React Detectados</h2>';
if (count($reactFiles) > 0) {
    echo '<table>';
    echo '<tr><th>Archivo</th><th>Tamaño</th><th>Modificado</th></tr>';
    foreach ($reactFiles as $file) {
        echo "<tr>";
        echo "<td>{$file['path']}</td>";
        echo "<td>" . number_format($file['size'] / 1024, 2) . " KB</td>";
        echo "<td>{$file['modified']}</td>";
        echo "</tr>";
    }
    echo '</table>';
    
    if (count($reactFiles) > 1) {
        echo '<div class="warning" style="padding: 10px; margin-bottom: 20px;">';
        echo '<strong>Advertencia:</strong> Se detectaron múltiples archivos que contienen React. Esto podría causar conflictos y errores como "Identifier has already been declared".';
        echo '</div>';
        
        if (!$fixResult) {
            echo '<a href="?fix=true" class="button warning">Corregir Duplicados de React</a>';
        }
    }
} else {
    echo '<p>No se detectaron archivos de React en el directorio público.</p>';
}

echo '<h2>Acciones Adicionales</h2>';
echo '<div style="display: flex; gap: 10px;">';
echo '<a href="/check-js-conflicts" class="button">Verificar Conflictos</a>';
echo '<a href="/check-dependencies" class="button">Verificar Dependencias</a>';
echo '<a href="/debug/admin-dashboard-view" class="button">Probar Vista Admin</a>';
echo '</div>';

echo '</body></html>';

