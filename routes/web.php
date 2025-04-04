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

// API routes
Route::get('/api/users', [ApiController::class, 'getUsers']);
Route::get('/api/materials', [ApiController::class, 'getMaterials']);
Route::get('/api/diagnostic', [DiagnosticController::class, 'checkDatabase']);

// Simple API routes using closures
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

// Auth protected routes
Route::middleware(['auth', 'verified'])->group(function () {
    // User dashboard with admin redirect
    Route::get('/dashboard', function () {
        Log::info('Dashboard route', [
            'user_id' => auth()->id(),
            'user_role' => auth()->user() ? auth()->user()->role : null
        ]);

        if (auth()->user() && strtolower(auth()->user()->role) === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        return app(DashboardController::class)->index();
    })->name('dashboard');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Materials routes
    Route::get('/materials', [MaterialController::class, 'index'])->name('materials.index');

    // Recycling records routes
    Route::get('/recycling-records', [RecyclingRecordController::class, 'index'])->name('recycling-records.index');
    Route::post('/recycling-records', [RecyclingRecordController::class, 'store'])->name('recycling-records.store');

    // Recycle view route
    Route::get('/recycle', function () {
        $materials = \App\Models\Material::all();
        return Inertia::render('Recycle', [
            'materials' => $materials
        ]);
    })->name('recycle');

    // Rewards routes
    Route::get('/rewards', function () {
        $rewards = \App\Models\Reward::all();
        return Inertia::render('Rewards', [
            'rewards' => $rewards
        ]);
    })->name('rewards');

    Route::get('/rewards/list', [RewardController::class, 'list'])->name('rewards.list');
    Route::post('/rewards/{reward}/redeem', [RewardController::class, 'redeem'])->name('rewards.redeem');

    // User routes
    Route::get('/ranking', [RankingController::class, 'index'])->name('ranking');
    Route::get('/rewards/history', [RewardController::class, 'history'])->name('rewards.history');
    Route::get('/tickets', [TicketController::class, 'index'])->name('tickets');
    Route::get('/levels', [LevelSystemController::class, 'index'])->name('levels');

    // Admin routes
    Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        
        Route::get('/validations', [AdminDashboardController::class, 'pendingValidations'])->name('validations');
        Route::get('/activity', [AdminDashboardController::class, 'recentActivity'])->name('activity');
        Route::get('/redemptions', [AdminDashboardController::class, 'allRedemptions'])->name('redemptions');
        Route::get('/tickets', [AdminDashboardController::class, 'allTickets'])->name('tickets');
        
        Route::post('/validations/{record}/approve', [RecyclingRecordController::class, 'approve'])->name('validations.approve');
        Route::post('/validations/{record}/reject', [RecyclingRecordController::class, 'reject'])->name('validations.reject');
        
        // User management
        Route::get('/users', [AdminUserController::class, 'index'])->name('users');
        Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
        Route::put('/users/{user}/change-role', [AdminUserController::class, 'changeRole'])->name('users.change-role');
        
        // Material management
        Route::get('/materials', function () {
            return Inertia::render('Admin/Materials/Index');
        })->name('materials');
        Route::post('/materials', [AdminMaterialController::class, 'store'])->name('materials.store');
        Route::put('/materials/{material}', [AdminMaterialController::class, 'update'])->name('materials.update');
        Route::delete('/materials/{material}', [AdminMaterialController::class, 'destroy'])->name('materials.destroy');
        
        // Reward management
        Route::get('/rewards', [AdminRewardController::class, 'index'])->name('rewards');
        Route::post('/rewards', [AdminRewardController::class, 'store'])->name('rewards.store');
        Route::put('/rewards/{reward}', [AdminRewardController::class, 'update'])->name('rewards.update');
        Route::delete('/rewards/{reward}', [AdminRewardController::class, 'destroy'])->name('rewards.destroy');
        
        // Reports
        Route::get('/reports', [App\Http\Controllers\Admin\ReportController::class, 'index'])->name('reports');
        Route::post('/reports/export', [App\Http\Controllers\Admin\ReportController::class, 'exportData'])->name('reports.export');

        // Activity management
        Route::get('/activities', function () {
            return Inertia::render('Admin/Activities/Index');
        })->name('activities');
        Route::post('/activities', [App\Http\Controllers\Admin\ActivityController::class, 'store'])->name('activities.store');
        Route::put('/activities/{activity}', [App\Http\Controllers\Admin\ActivityController::class, 'update'])->name('activities.update');
        Route::delete('/activities/{activity}', [App\Http\Controllers\Admin\ActivityController::class, 'destroy'])->name('activities.destroy');
    });
    
    // Activities routes
    Route::get('/activities', [ActivityController::class, 'index'])->name('activities.index');
    Route::get('/activities/{id}', [ActivityController::class, 'show'])->name('activities.show');
    Route::post('/activities/{id}/register', [ActivityController::class, 'register'])->name('activities.register');
    Route::post('/activities/{id}/cancel', [ActivityController::class, 'cancel'])->name('activities.cancel');
    Route::get('/my-activities', [ActivityController::class, 'myActivities'])->name('activities.my');
});

require __DIR__.'/auth.php';

// Debug routes
Route::get('/test-change-role/{user}', [App\Http\Controllers\Admin\UserController::class, 'testChangeRole']);
Route::get('/diagnostic', [App\Http\Controllers\DiagnosticController::class, 'index'])->name('diagnostic');
Route::get('/debug/auth', [App\Http\Controllers\DebugController::class, 'auth']);
Route::get('/debug/dashboard', [App\Http\Controllers\DebugController::class, 'dashboard']);

// Admin dashboard diagnostic route (no middleware)
Route::get('/debug/admin-dashboard-view', function () {
    try {
        $stats = [
            'totalUsers' => 0,
            'totalRecycled' => 0,
            'pendingValidations' => 0,
            'totalRedemptions' => 0
        ];

        $recentUsers = [];
        $recentRecords = [];
        $topMaterials = [];

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

// Local environment debug routes
if (app()->environment('local')) {
    Route::get('/check-js-conflicts', function () {
        include public_path('check-js-conflicts.php');
        exit;
    });
    
    Route::get('/check-dependencies', function () {
        include public_path('check-dependencies.php');
        exit;
    });
    
    Route::get('/check-roles', function () {
        include public_path('check-roles.php');
        exit;
    });
    
    Route::get('/fix-react-duplicates', function () {
        include public_path('fix-react-duplicates.php');
        exit;
    });
    
    Route::get('/check-middleware', function () {
        include public_path('check-middleware.php');
        exit;
    });
}

// API routes
Route::middleware(['auth'])->prefix('api')->group(function () {
    Route::get('/activities/upcoming', [ActivityController::class, 'upcoming'])->name('api.activities.upcoming');
    Route::get('/activities/next', [ActivityController::class, 'nextActivity'])->name('api.activities.next');
});