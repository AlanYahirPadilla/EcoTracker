<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MaterialController;
use App\Models\User;
use App\Models\Material;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Ruta para obtener el usuario autenticado
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rutas API simplificadas (sin autenticación para pruebas)
Route::get('/users', function () {
    return response()->json(User::all(['id', 'name', 'email', 'points', 'created_at']));
});

Route::get('/materials', function () {
    return response()->json(Material::all(['id', 'name', 'description', 'points_per_unit', 'weight_per_unit', 'is_active']));
});

