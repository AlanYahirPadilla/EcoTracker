<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DebugController extends Controller
{
    public function auth()
    {
        $user = auth()->user();
        
        if (!$user) {
            return response()->json([
                'authenticated' => false,
                'message' => 'No autenticado'
            ]);
        }
        
        return response()->json([
            'authenticated' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'has_admin_role' => $user->hasRole('admin'),
                'role_check_admin' => $user->role === 'admin',
                'role_check_admin_lowercase' => strtolower($user->role) === 'admin'
            ]
        ]);
    }
    
    public function dashboard()
    {
        try {
            $user = auth()->user();
            
            if (!$user) {
                return response()->json([
                    'error' => 'No autenticado'
                ], 401);
            }
            
            // Verificar si el usuario es administrador
            $isAdmin = $user->hasRole('admin');
            
            if (!$isAdmin) {
                return response()->json([
                    'error' => 'No autorizado',
                    'user_role' => $user->role,
                    'expected_role' => 'admin'
                ], 403);
            }
            
            // Intentar obtener datos básicos
            $stats = [
                'totalUsers' => \App\Models\User::count(),
                'pendingValidations' => \App\Models\RecyclingRecord::where('status', 'pending')->count()
            ];
            
            return response()->json([
                'success' => true,
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error('Error en debug/dashboard', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
    
    public function adminDashboard()
    {
        try {
            // Intentar renderizar la vista Admin/Dashboard con datos mínimos
            return Inertia::render('Admin/Dashboard', [
                'stats' => [
                    'totalUsers' => 0,
                    'totalRecycled' => 0,
                    'pendingValidations' => 0,
                    'totalRedemptions' => 0
                ],
                'recentUsers' => [],
                'recentRecords' => [],
                'topMaterials' => []
            ]);
        } catch (\Exception $e) {
            Log::error('Error en debug/admin-dashboard', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}



