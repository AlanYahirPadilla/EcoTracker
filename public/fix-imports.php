<?php
// Este script verifica y corrige las rutas de importación en archivos JSX

$pagesPath = dirname(__DIR__) . '/resources/js/Pages';
$componentsPath = dirname(__DIR__) . '/resources/js/Components';
$layoutsPath = dirname(__DIR__) . '/resources/js/Layouts';

echo "Verificando rutas de importación en archivos JSX...\n";

// Función para procesar un directorio
function processDirectory($dir) {
    global $componentsPath, $layoutsPath;
    
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );
    
    foreach ($iterator as $file) {
        if ($file->isFile() && $file->getExtension() === 'jsx') {
            $filePath = $file->getPathname();
            $content = file_get_contents($filePath);
            
            // Buscar importaciones incorrectas
            $pattern = '/import\s+.*\s+from\s+[\'"](?!@\/)([^\.\/][^\'"]*)[\'"]/';
            if (preg_match_all($pattern, $content, $matches, PREG_SET_ORDER)) {
                echo "Archivo: " . str_replace(dirname(__DIR__) . '/', '', $filePath) . "\n";
                
                foreach ($matches as $match) {
                    $importPath = $match[1];
                    echo "  Importación incorrecta: " . $importPath . "\n";
                    
                    // Determinar la ruta correcta
                    if (file_exists($componentsPath . '/' . $importPath . '.jsx')) {
                        $newImport = '@/Components/' . $importPath;
                        echo "  Corregir a: " . $newImport . "\n";
                        
                        // Reemplazar la importación
                        $content = str_replace(
                            'from \'' . $importPath . '\'',
                            'from \'' . $newImport . '\'',
                            $content
                        );
                    } elseif (file_exists($layoutsPath . '/' . $importPath . '.jsx')) {
                        $newImport = '@/Layouts/' . $importPath;
                        echo "  Corregir a: " . $newImport . "\n";
                        
                        // Reemplazar la importación
                        $content = str_replace(
                            'from \'' . $importPath . '\'',
                            'from \'' . $newImport . '\'',
                            $content
                        );
                    }
                }
                
                // Guardar el archivo modificado
                file_put_contents($filePath, $content);
                echo "  Archivo actualizado\n";
            }
        }
    }
}

// Procesar directorios
processDirectory($pagesPath);

echo "\nVerificación completada.\n";

