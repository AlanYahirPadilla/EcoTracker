<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class DiagnosticController extends Controller
{
    public function checkDatabase()
    {
        try {
            // Verificar conexión a la base de datos
            DB::connection()->getPdo();
            
            $diagnostics = [
                'connection' => 'OK',
                'tables' => []
            ];
            
            // Verificar tablas importantes
            $tables = ['users', 'materials', 'recycling_records', 'rewards', 'reward_redemptions'];
            
            foreach ($tables as $table) {
                $exists = Schema::hasTable($table);
                $count = 0;
                
                if ($exists) {
                    $count = DB::table($table)->count();
                }
                
                $diagnostics['tables'][$table] = [
                    'exists' => $exists,
                    'count' => $count
                ];
            }
            
            // Verificar columnas en la tabla materials
            if (Schema::hasTable('materials')) {
                $diagnostics['materials_columns'] = [
                    'id' => Schema::hasColumn('materials', 'id'),
                    'name' => Schema::hasColumn('materials', 'name'),
                    'description' => Schema::hasColumn('materials', 'description'),
                    'points_per_unit' => Schema::hasColumn('materials', 'points_per_unit'),
                    'weight_per_unit' => Schema::hasColumn('materials', 'weight_per_unit'),
                    'is_active' => Schema::hasColumn('materials', 'is_active')
                ];
            }
            
            return response()->json($diagnostics);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error de diagnóstico',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

