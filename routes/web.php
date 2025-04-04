<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\RecyclingRecordController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RankingController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\Api\DiagnosticController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\Admin\RewardController as AdminRewardController;
use App\Http\Controllers\Admin\MaterialController as AdminMaterialController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\LevelSystemController;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Rutas API directas (sin usar api.php)
Route::get('/api/users', [ApiController::class, 'getUsers']);
Route::get('/api/materials', [ApiController::class, 'getMaterials']);
Route::get('/api/diagnostic', [DiagnosticController::class, 'checkDatabase']);

// Rutas API alternativas usando Closure para simplificar
Route::get('/api/users-simple', function () {
  return response()->json([
      ['id' => 1, 'name' => 'Administrador', 'email' => 'admin@example.com', 'points' => 500, 'role' => 'admin', 'created_at' => '01/01/2023'],
      ['id' => 2, 'name' => 'Encargado', 'email' => 'encargado@example.com', 'points' => 350, 'role' => 'recycler', 'created_at' => '15/01/2023'],
      ['id' => 3, 'name' => 'Usuario', 'email' => 'usuario@example.com', 'points' => 120, 'role' => 'user', 'created_at' => '01/02/2023']
  ]);
});

Route::get('/api/materials-simple', function () {
  return response()->json([
      ['id' => 1, 'name' => 'Papel', 'description' => 'Papel de oficina, periódicos, revistas', 'points_per_unit' => 2, 'weight_per_unit' => 0.1, 'is_active' => true, 'recycling_count' => 120],
      ['id' => 2, 'name' => 'Plástico PET', 'description' => 'Botellas de plástico transparente', 'points_per_unit' => 3, 'weight_per_unit' => 0.05, 'is_active' => true, 'recycling_count' => 85],
      ['id' => 3, 'name' => 'Aluminio', 'description' => 'Latas de aluminio', 'points_per_unit' => 5, 'weight_per_unit' => 0.02, 'is_active' => true, 'recycling_count' => 65],
      ['id' => 4, 'name' => 'Vidrio', 'description' => 'Botellas y frascos de vidrio', 'points_per_unit' => 4, 'weight_per_unit' => 0.3, 'is_active' => true, 'recycling_count' => 40],
      ['id' => 5, 'name' => 'Cartón', 'description' => 'Cajas y empaques de cartón', 'points_per_unit' => 2, 'weight_per_unit' => 0.15, 'is_active' => true, 'recycling_count' => 95]
  ]);
});

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// Rutas protegidas por autenticación
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard del usuario - MODIFICADO para redirigir a los administradores
    Route::get('/dashboard', function () {
        // Añadir logging para depuración
        Log::info('Dashboard route', [
            'user_id' => auth()->id(),
            'user_role' => auth()->user() ? auth()->user()->role : null
        ]);

        // Comparación insensible a mayúsculas/minúsculas
        if (auth()->user() && strtolower(auth()->user()->role) === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        return app(DashboardController::class)->index();
    })->name('dashboard');

    // Perfil
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Materiales
    Route::get('/materials', [MaterialController::class, 'index'])->name('materials.index');

    // Registros de reciclaje
    Route::get('/recycling-records', [RecyclingRecordController::class, 'index'])->name('recycling-records.index');
    Route::post('/recycling-records', [RecyclingRecordController::class, 'store'])->name('recycling-records.store');

    // Ruta para la vista de reciclaje
    Route::get('/recycle', function () {
        $materials = \App\Models\Material::all();
        return Inertia::render('Recycle', [
            'materials' => $materials
        ]);
    })->name('recycle');

    // Recompensas
    Route::get('/rewards', function () {
        $rewards = \App\Models\Reward::all();
        return Inertia::render('Rewards', [
            'rewards' => $rewards
        ]);
    })->name('rewards');

    Route::get('/rewards/list', [RewardController::class, 'list'])->name('rewards.list');
    Route::post('/rewards/{reward}/redeem', [RewardController::class, 'redeem'])->name('rewards.redeem');

    // NUEVAS RUTAS PARA USUARIOS (fuera del grupo de admin)
    // Ranking
    Route::get('/ranking', [RankingController::class, 'index'])->name('ranking');

    // Historial de Canjes
    Route::get('/rewards/history', [RewardController::class, 'history'])->name('rewards.history');

    // Tickets
    Route::get('/tickets', [TicketController::class, 'index'])->name('tickets');

    // Añadir esta ruta dentro del grupo de rutas protegidas por autenticación
    Route::get('/levels', [LevelSystemController::class, 'index'])->name('levels');

    // Rutas para administradores - MODIFICADO para usar solo auth en lugar de role
    Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
        // Dashboard de administrador
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        
        // Nuevas vistas de administración
        Route::get('/validations', [AdminDashboardController::class, 'pendingValidations'])->name('validations');
        Route::get('/activity', [AdminDashboardController::class, 'recentActivity'])->name('activity');
        Route::get('/redemptions', [AdminDashboardController::class, 'allRedemptions'])->name('redemptions');
        Route::get('/tickets', [AdminDashboardController::class, 'allTickets'])->name('tickets');
        
        // Acciones de validación
        Route::post('/validations/{record}/approve', [RecyclingRecordController::class, 'approve'])->name('validations.approve');
        Route::post('/validations/{record}/reject', [RecyclingRecordController::class, 'reject'])->name('validations.reject');
        
        // Gestión de usuarios
        Route::get('/users', [AdminUserController::class, 'index'])->name('users');
        Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
        Route::put('/users/{user}/change-role', [AdminUserController::class, 'changeRole'])->name('users.change-role');
        
        // Gestión de materiales
        Route::get('/materials', function () {
            return Inertia::render('Admin/Materials/Index');
        })->name('materials');
        Route::post('/materials', [AdminMaterialController::class, 'store'])->name('materials.store');
        Route::put('/materials/{material}', [AdminMaterialController::class, 'update'])->name('materials.update');
        Route::delete('/materials/{material}', [AdminMaterialController::class, 'destroy'])->name('materials.destroy');
        
        // Gestión de recompensas - Usar el controlador de administración
        Route::get('/rewards', [AdminRewardController::class, 'index'])->name('rewards');
        Route::post('/rewards', [AdminRewardController::class, 'store'])->name('rewards.store');
        Route::put('/rewards/{reward}', [AdminRewardController::class, 'update'])->name('rewards.update');
        Route::delete('/rewards/{reward}', [AdminRewardController::class, 'destroy'])->name('rewards.destroy');
        
        // Reportes - Versión simplificada
        Route::get('/reports', [App\Http\Controllers\Admin\ReportController::class, 'index'])->name('reports');
        Route::post('/reports/export', [App\Http\Controllers\Admin\ReportController::class, 'exportData'])->name('reports.export');

        // Gestión de actividades
        Route::get('/activities', function () {
            return Inertia::render('Admin/Activities/Index');
        })->name('activities');
        Route::post('/activities', [App\Http\Controllers\Admin\ActivityController::class, 'store'])->name('activities.store');
        Route::put('/activities/{activity}', [App\Http\Controllers\Admin\ActivityController::class, 'update'])->name('activities.update');
        Route::delete('/activities/{activity}', [App\Http\Controllers\Admin\ActivityController::class, 'destroy'])->name('activities.destroy');
    });
});

require __DIR__.'/auth.php';

// Añadir esta ruta al final del archivo, fuera de cualquier grupo
Route::get('/test-change-role/{user}', [App\Http\Controllers\Admin\UserController::class, 'testChangeRole']);

// Ruta de diagnóstico
Route::get('/diagnostic', [App\Http\Controllers\DiagnosticController::class, 'index'])->name('diagnostic');

// Rutas de depuración
Route::get('/debug/auth', [App\Http\Controllers\DebugController::class, 'auth']);
Route::get('/debug/dashboard', [App\Http\Controllers\DebugController::class, 'dashboard']);

// Ruta de diagnóstico para el dashboard de administración (sin middleware)
Route::get('/debug/admin-dashboard-view', function () {
    try {
        // Datos mínimos para la vista
        $stats = [
            'totalUsers' => 0,
            'totalRecycled' => 0,
            'pendingValidations' => 0,
            'totalRedemptions' => 0
        ];

        $recentUsers = [];
        $recentRecords = [];
        $topMaterials = [];

        // Renderizar la vista con datos mínimos
        return Inertia\Inertia::render('Admin/Dashboard', [
            'auth' => [
                'user' => [
                    'id' => 1,
                    'name' => 'Admin Test',
                    'email' => 'admin@example.com',
                    'role' => 'admin'
                ]
            ],
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'recentRecords' => $recentRecords,
            'topMaterials' => $topMaterials,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

// Ruta para verificar conflictos de JavaScript (solo en entorno local)
if (app()->environment('local')) {
    Route::get('/check-js-conflicts', function () {
        include public_path('check-js-conflicts.php');
        exit;
    });
}

// Ruta para verificar dependencias (solo en entorno local)
if (app()->environment('local')) {
    Route::get('/check-dependencies', function () {
        include public_path('check-dependencies.php');
        exit;
    });
}

// Ruta para verificar roles (solo en entorno local)
if (app()->environment('local')) {
    Route::get('/check-roles', function () {
        include public_path('check-roles.php');
        exit;
    });
}

// Ruta para solucionar problemas con React duplicado (solo en entorno local)
if (app()->environment('local')) {
    Route::get('/fix-react-duplicates', function () {
        include public_path('fix-react-duplicates.php');
        exit;
    });
}

// Ruta para verificar middleware (solo en entorno local)
if (app()->environment('local')) {
    Route::get('/check-middleware', function () {
        include public_path('check-middleware.php');
        exit;
    });
}

