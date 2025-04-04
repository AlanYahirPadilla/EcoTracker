<?php

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\RecyclingRecord;
use App\Models\Material;
use App\Models\Reward;
use App\Models\RewardRedemption;

echo "Verificando datos necesarios para el dashboard...

";

// Verificar tablas
$tables = [
    'users',
    'materials',
    'recycling_records',
    'rewards',
    'reward_redemptions'
];

foreach ($tables as $table) {
    if (Schema::hasTable($table)) {
        echo "Tabla '$table': Existe
";
        
        // Obtener columnas
        $columns = Schema::getColumnListing($table);
        echo "  Columnas: " . implode(', ', $columns) . "
";
        
        // Contar registros
        $count = DB::table($table)->count();
        echo "  Registros: $count
";
        
        // Verificar columnas específicas
        if ($table === 'users') {
            if (Schema::hasColumn($table, 'points')) {
                echo "  Columna 'points' en users: Existe
";
            } else {
                echo "  Columna 'points' en users: No existe (PROBLEMA)
";
            }
        }
        
        if ($table === 'recycling_records') {
            if (Schema::hasColumn($table, 'user_id') && Schema::hasColumn($table, 'material_id')) {
                // Verificar si hay registros sin user_id o material_id
                $nullUserIds = DB::table($table)->whereNull('user_id')->count();
                $nullMaterialIds = DB::table($table)->whereNull('material_id')->count();
                
                echo "  Registros sin user_id: $nullUserIds
";
                echo "  Registros sin material_id: $nullMaterialIds
";
            }
            
            if (Schema::hasColumn($table, 'status')) {
                // Verificar valores de status
                $statuses = DB::table($table)->select('status')->distinct()->get()->pluck('status')->toArray();
                echo "  Valores de status: " . implode(', ', $statuses) . "
";
            }
        }
    } else {
        echo "Tabla '$table': No existe (PROBLEMA)
";
    }
    
    echo "
";
}

// Verificar relaciones
echo "Verificando relaciones...

";

try {
    // Obtener un usuario aleatorio
    $user = User::first();
    
    if ($user) {
        echo "Usuario de prueba: ID {$user->id}, Nombre: {$user->name}
";
        
        // Verificar registros de reciclaje del usuario
        $recyclingCount = RecyclingRecord::where('user_id', $user->id)->count();
        echo "  Registros de reciclaje: $recyclingCount
";
        
        // Verificar canjes de recompensas del usuario
        $redemptionsCount = RewardRedemption::where('user_id', $user->id)->count();
        echo "  Canjes de recompensas: $redemptionsCount
";
        
        // Verificar puntos del usuario
        echo "  Puntos del usuario: {$user->points}
";
    } else {
        echo "No se encontraron usuarios en la base de datos (PROBLEMA)
";
    }
} catch (\Exception $e) {
    echo "Error al verificar relaciones: " . $e->getMessage() . "
";
}

echo "
Verificación completada.
";

