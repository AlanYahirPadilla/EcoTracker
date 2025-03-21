<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\RecyclingRecordController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RankingController;
use App\Http\Controllers\TicketController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// Rutas protegidas por autenticación
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard del usuario
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Materiales
    Route::get('/materials', [MaterialController::class, 'index'])->name('materials.index');
    
    // Registros de reciclaje
    Route::get('/recycling-records', [RecyclingRecordController::class, 'index'])->name('recycling-records.index');
    Route::post('/recycling-records', [RecyclingRecordController::class, 'store'])->name('recycling-records.store');
    Route::get('/recycle', function () {
        return Inertia::render('Recycle');
    })->name('recycle');
    
    // Recompensas
    Route::get('/rewards', function () {
        return Inertia::render('Rewards');
    })->name('rewards');
    Route::get('/rewards/list', [RewardController::class, 'index'])->name('rewards.list');
    Route::post('/rewards/{reward}/redeem', [RewardController::class, 'redeem'])->name('rewards.redeem');
    
    // NUEVAS RUTAS PARA USUARIOS (fuera del grupo de admin)
    // Ranking
    Route::get('/ranking', [RankingController::class, 'index'])->name('ranking');
    
    // Historial de Canjes
    Route::get('/rewards/history', [RewardController::class, 'history'])->name('rewards.history');
    
    // Tickets
    Route::get('/tickets', [TicketController::class, 'index'])->name('tickets');
    
    // Rutas para administradores
    Route::middleware(['can:viewAdminDashboard,App\Models\User'])->prefix('admin')->name('admin.')->group(function () {
        // Dashboard de administrador
        Route::get('/dashboard', [DashboardController::class, 'adminDashboard'])->name('dashboard');
        
        // Gestión de usuarios
        Route::get('/users', function () {
            return Inertia::render('Admin/Users/Index');
        })->name('users');
        
        // Validaciones de reciclaje
        Route::get('/validations', function () {
            return Inertia::render('Admin/Validations/Index');
        })->name('validations');
        Route::get('/validations/pending', [RecyclingRecordController::class, 'pendingValidations'])->name('validations.pending');
        Route::post('/validations/{record}/approve', [RecyclingRecordController::class, 'approve'])->name('validations.approve');
        Route::post('/validations/{record}/reject', [RecyclingRecordController::class, 'reject'])->name('validations.reject');
        
        // Gestión de materiales
        Route::get('/materials', [MaterialController::class, 'adminIndex'])->name('materials');
        Route::post('/materials', [MaterialController::class, 'store'])->name('materials.store');
        Route::put('/materials/{material}', [MaterialController::class, 'update'])->name('materials.update');
        Route::delete('/materials/{material}', [MaterialController::class, 'destroy'])->name('materials.destroy');
        
        // Gestión de recompensas
        Route::get('/rewards', [RewardController::class, 'adminIndex'])->name('rewards');
        Route::post('/rewards', [RewardController::class, 'store'])->name('rewards.store');
        Route::put('/rewards/{reward}', [RewardController::class, 'update'])->name('rewards.update');
        Route::delete('/rewards/{reward}', [RewardController::class, 'destroy'])->name('rewards.destroy');
        
        // RUTAS DE ADMIN PARA LAS NUEVAS VISTAS (si necesitas versiones de admin)
        Route::get('/ranking', [RankingController::class, 'adminIndex'])->name('ranking');
        Route::get('/rewards/history', [RewardController::class, 'adminHistory'])->name('rewards.history');
        Route::get('/tickets', [TicketController::class, 'adminIndex'])->name('tickets');
        
        // Reportes
        Route::get('/reports', function () {
            return Inertia::render('Admin/Reports/Index');
        })->name('reports');
    });
});

require __DIR__.'/auth.php';