<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ApiController extends Controller
{
    public function getUsers()
    {
        try {
            // Verificar si la tabla existe y tiene registros
            if (!User::first()) {
                // Si no hay usuarios, devolver un array vacío
                return response()->json([]);
            }
            
            // Obtener usuarios de manera segura
            $users = User::select('id', 'name', 'email', 'points', 'created_at')
                ->orderBy('name')
                ->get()
                ->toArray();
                
            return response()->json($users);
        } catch (\Exception $e) {
            // Registrar el error
            Log::error('Error al obtener usuarios: ' . $e->getMessage());
            
            // Devolver una respuesta de error genérica
            return response()->json([
                'error' => 'Error al obtener usuarios',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getMaterials()
    {
        try {
            // Verificar si la tabla existe y tiene registros
            if (!Material::first()) {
                // Si no hay materiales, devolver un array vacío
                return response()->json([]);
            }
            
            // Obtener materiales de manera segura
            $materials = Material::select('id', 'name', 'description', 'points_per_unit')
                ->when(
                    \Schema::hasColumn('materials', 'weight_per_unit'), 
                    function($query) {
                        return $query->addSelect('weight_per_unit');
                    }
                )
                ->when(
                    \Schema::hasColumn('materials', 'is_active'), 
                    function($query) {
                        return $query->addSelect('is_active');
                    }
                )
                ->orderBy('name')
                ->get()
                ->toArray();
                
            return response()->json($materials);
        } catch (\Exception $e) {
            // Registrar el error
            Log::error('Error al obtener materiales: ' . $e->getMessage());
            
            // Devolver una respuesta de error genérica
            return response()->json([
                'error' => 'Error al obtener materiales',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

