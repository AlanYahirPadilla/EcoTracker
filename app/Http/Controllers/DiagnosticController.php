<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class DiagnosticController extends Controller
{
    public function index()
    {
        try {
            // Verificar tablas
            $tables = $this->checkTables();
            
            // Verificar rutas
            $routes = $this->checkRoutes();
            
            // Verificar middleware
            $middleware = $this->checkMiddleware();
            
            // Verificar vistas
            $views = $this->checkViews();
            
            // Verificar controladores
            $controllers = $this->checkControllers();
            
            // Verificar usuario actual
            $currentUser = $this->checkCurrentUser();
            
            return Inertia::render('Diagnostic', [
                'tables' => $tables,
                'routes' => $routes,
                'middleware' => $middleware,
                'views' => $views,
                'controllers' => $controllers,
                'currentUser' => $currentUser,
            ]);
        } catch (\Exception $e) {
            Log::error('Error en DiagnosticController index', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
    
    private function checkTables()
    {
        $requiredTables = [
            'users', 
            'recycling_records', 
            'materials', 
            'rewards', 
            'reward_redemptions',
            'activities'
        ];
        
        $tables = [];
        
        foreach ($requiredTables as $table) {
            $exists = Schema::hasTable($table);
            
            if ($exists) {
                $columns = Schema::getColumnListing($table);
                $count = DB::table($table)->count();
            } else {
                $columns = [];
                $count = 0;
            }
            
            $tables[$table] = [
                'exists' => $exists,
                'columns' => $columns,
                'count' => $count
            ];
        }
        
        return $tables;
    }
    
    private function checkRoutes()
    {
        $requiredRoutes = [
            'dashboard',
            'admin.dashboard',
            'admin.validations',
            'admin.activity',
            'admin.redemptions',
            'admin.tickets',
            'admin.users',
            'admin.materials',
            'admin.rewards',
            'admin.reports',
            'admin.activities'
        ];
        
        $routes = [];
        
        foreach ($requiredRoutes as $routeName) {
            $exists = Route::has($routeName);
            
            if ($exists) {
                try {
                    $uri = route($routeName);
                } catch (\Exception $e) {
                    $uri = 'Error: ' . $e->getMessage();
                }
            } else {
                $uri = 'No existe';
            }
            
            $routes[$routeName] = [
                'exists' => $exists,
                'uri' => $uri
            ];
        }
        
        return $routes;
    }
    
    private function checkMiddleware()
    {
        $kernel = app()->make(\App\Http\Kernel::class);
        $middlewareGroups = $kernel->getMiddlewareGroups();
        $middlewareAliases = $kernel->getMiddlewareAliases();
        
        return [
            'groups' => $middlewareGroups,
            'aliases' => $middlewareAliases
        ];
    }
    
    private function checkViews()
    {
        $requiredViews = [
            'Admin/Dashboard.jsx',
            'Admin/PendingValidations.jsx',
            'Admin/RecentActivity.jsx',
            'Admin/AllRedemptions.jsx',
            'Admin/AllTickets.jsx',
            'Admin/Users/Index.jsx',
            'Admin/Materials/Index.jsx',
            'Admin/Rewards/Index.jsx',
            'Admin/Reports/Index.jsx',
            'Admin/Activities/Index.jsx'
        ];
        
        $views = [];
        
        foreach ($requiredViews as $view) {
            $path = resource_path('js/Pages/' . $view);
            $exists = file_exists($path);
            
            $views[$view] = [
                'exists' => $exists,
                'path' => $path
            ];
        }
        
        return $views;
    }
    
    private function checkControllers()
    {
        $requiredControllers = [
            'AdminDashboardController',
            'Admin\RewardController',
            'Admin\MaterialController',
            'Admin\UserController',
            'Admin\ReportController',
            'Admin\ActivityController',
            'RecyclingRecordController',
            'RewardController',
            'TicketController',
            'RankingController',
            'LevelSystemController'
        ];
        
        $controllers = [];
        
        foreach ($requiredControllers as $controller) {
            $className = "App\\Http\\Controllers\\$controller";
            $exists = class_exists($className);
            
            $controllers[$controller] = [
                'exists' => $exists,
                'class' => $className
            ];
        }
        
        return $controllers;
    }
    
    private function checkCurrentUser()
    {
        if (!auth()->check()) {
            return [
                'authenticated' => false,
                'message' => 'No autenticado'
            ];
        }
        
        $user = auth()->user();
        
        return [
            'authenticated' => true,
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'has_admin_role' => $user->hasRole('admin'),
            'role_check_admin' => $user->role === 'admin',
            'role_check_admin_lowercase' => strtolower($user->role) === 'admin'
        ];
    }
    
    public function checkDatabase()
    {
        try {
            // Verificar conexión a la base de datos
            DB::connection()->getPdo();
            $connected = true;
            $connection = DB::connection()->getDatabaseName();
        } catch (\Exception $e) {
            $connected = false;
            $connection = $e->getMessage();
        }
        
        // Verificar tablas
        $tables = $this->checkTables();
        
        return response()->json([
            'database' => [
                'connected' => $connected,
                'connection' => $connection
            ],
            'tables' => $tables
        ]);
    }
}

