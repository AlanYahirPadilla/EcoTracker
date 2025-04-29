<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\Admin\ActivityController as AdminActivityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RecyclingRecordController;
use App\Http\Controllers\RewardRedemptionController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\MaterialController;
use App\Http\Controllers\Admin\RewardController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\RankingController;
use App\Http\Controllers\RewardController as UserRewardController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Ruta principal - Redirecciona según el rol del usuario
Route::get('/', function () {
    if (Auth::check()) {
        if (Auth::user()->is_admin) {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

// Rutas de autenticación (Laravel Breeze las genera automáticamente)
require __DIR__.'/auth.php';

// Rutas protegidas por autenticación
Route::middleware(['auth'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Perfil de usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Reciclaje
    Route::get('/recycle', [RecyclingRecordController::class, 'create'])->name('recycle.create');
    Route::post('/recycle', [RecyclingRecordController::class, 'store'])->name('recycle.store');
    Route::get('/recycle/history', [RecyclingRecordController::class, 'history'])->name('recycle.history');
    
    // Recompensas
    Route::get('/rewards', [UserRewardController::class, 'index'])->name('rewards.index');
    Route::post('/rewards/{id}/redeem', [RewardRedemptionController::class, 'store'])->name('rewards.redeem');
    Route::get('/rewards/history', [UserRewardController::class, 'history'])->name('rewards.history');
    
    // Ranking
    Route::get('/ranking', [RankingController::class, 'index'])->name('ranking');
    
    // Tickets
    Route::get('/tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::get('/tickets/{id}', [TicketController::class, 'show'])->name('tickets.show');
    
    // Actividades
    Route::get('/activities', [ActivityController::class, 'index'])->name('activities.index');
    Route::get('/activities/{id}', [ActivityController::class, 'show'])->name('activities.show');
    Route::post('/activities/{id}/register', [ActivityController::class, 'register'])->name('activities.register');
    Route::post('/activities/{id}/cancel', [ActivityController::class, 'cancel'])->name('activities.cancel');
    Route::get('/my-activities', [ActivityController::class, 'myActivities'])->name('activities.my');
    
    // Redirección a dashboard de admin para usuarios administradores
    Route::get('/admin', function () {
        if (Auth::user()->is_admin) {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('dashboard');
    });
});

// Rutas de API
Route::middleware(['auth'])->prefix('api')->group(function () {
    Route::get('/activities/upcoming', [ActivityController::class, 'upcoming']);
    Route::get('/activities/next', [ActivityController::class, 'nextActivity']);
    Route::get('/user/stats', [App\Http\Controllers\Api\UserController::class, 'stats']);
    Route::get('/materials', [App\Http\Controllers\Api\MaterialController::class, 'index']);
});

// Rutas para administradores
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Validaciones pendientes
    Route::get('/pending-validations', [AdminDashboardController::class, 'pendingValidations'])->name('pending-validations');
    Route::post('/validations/{id}/approve', [RecyclingRecordController::class, 'approve'])->name('validations.approve');
    Route::post('/validations/{id}/reject', [RecyclingRecordController::class, 'reject'])->name('validations.reject');
    
    // Actividad reciente
    Route::get('/activity', [AdminDashboardController::class, 'recentActivity'])->name('activity');
    
    // Historial de canjes
    Route::get('/all-redemptions', [AdminDashboardController::class, 'allRedemptions'])->name('all-redemptions');
    Route::post('/redemptions/{id}/complete', [RewardRedemptionController::class, 'complete'])->name('redemptions.complete');
    
    // Tickets de reciclaje
    Route::get('/all-tickets', [AdminDashboardController::class, 'allTickets'])->name('all-tickets');
    
    // Gestión de usuarios
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');
    
    // Gestión de materiales
    Route::get('/materials', [MaterialController::class, 'index'])->name('materials.index');
    Route::get('/materials/create', [MaterialController::class, 'create'])->name('materials.create');
    Route::post('/materials', [MaterialController::class, 'store'])->name('materials.store');
    Route::get('/materials/{id}/edit', [MaterialController::class, 'edit'])->name('materials.edit');
    Route::put('/materials/{id}', [MaterialController::class, 'update'])->name('materials.update');
    Route::delete('/materials/{id}', [MaterialController::class, 'destroy'])->name('materials.destroy');
    
    // Gestión de recompensas
    Route::get('/rewards', [RewardController::class, 'index'])->name('rewards.index');
    Route::get('/rewards/create', [RewardController::class, 'create'])->name('rewards.create');
    Route::post('/rewards', [RewardController::class, 'store'])->name('rewards.store');
    Route::get('/rewards/{id}/edit', [RewardController::class, 'edit'])->name('rewards.edit');
    Route::put('/rewards/{id}', [RewardController::class, 'update'])->name('rewards.update');
    Route::delete('/rewards/{id}', [RewardController::class, 'destroy'])->name('rewards.destroy');
    
    // Reportes
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/generate', [ReportController::class, 'generate'])->name('reports.generate');
    Route::get('/reports/export', [ReportController::class, 'export'])->name('reports.export');
    
    // Gestión de actividades
    Route::get('/activities', [AdminActivityController::class, 'index'])->name('activities.index');
    Route::get('/activities/create', [AdminActivityController::class, 'create'])->name('activities.create');
    Route::post('/activities', [AdminActivityController::class, 'store'])->name('activities.store');
    Route::get('/activities/{id}/edit', [AdminActivityController::class, 'edit'])->name('activities.edit');
    Route::put('/activities/{id}', [AdminActivityController::class, 'update'])->name('activities.update');
    Route::delete('/activities/{id}', [AdminActivityController::class, 'destroy'])->name('activities.destroy');
    Route::get('/activities/{id}/participants', [AdminActivityController::class, 'participants'])->name('activities.participants');
    Route::put('/activities/{activityId}/participants/{userId}', [AdminActivityController::class, 'updateParticipantStatus'])->name('activities.participants.update');
});

// Ruta de diagnóstico para actividades
Route::get('/debug/activities', function () {
    try {
        $now = now();
        
        // Obtener actividades futuras o en curso
        $activities = App\Models\Activity::where('is_active', true)
            ->where(function($query) use ($now) {
                // Actividades de hoy que aún no han terminado
                $query->whereDate('date', $now->toDateString())
                    ->where(function($q) use ($now) {
                        $currentTime = $now->format('H:i:s');
                        $q->where('time_end', '>=', $currentTime);
                    });
            })
            ->orWhere(function($query) use ($now) {
                // Actividades futuras
                $query->whereDate('date', '>', $now->toDateString())
                    ->where('is_active', true);
            })
            ->orderBy('date', 'asc')
            ->orderBy('time_start', 'asc')
            ->take(5)
            ->get();
            
        return response()->json([
            'success' => true,
            'count' => $activities->count(),
            'activities' => $activities,
            'now' => $now->toDateTimeString(),
            'query' => [
                'today' => $now->toDateString(),
                'current_time' => $now->format('H:i:s')
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

// Fallback route para rutas no encontradas
Route::fallback(function () {
    return Inertia::render('Fallback', [
        'status' => 404,
        'message' => 'Página no encontrada'
    ]);
});

