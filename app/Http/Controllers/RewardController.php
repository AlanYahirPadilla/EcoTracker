<?php

namespace App\Http\Controllers;

use App\Models\Reward;
use App\Models\RewardRedemption;
use App\Models\User; // Añadir esta importación
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RewardController extends Controller
{
    public function index()
    {
        $rewards = Reward::where('active', true)->get();
        return response()->json($rewards);
    }

    public function redeem(Request $request, Reward $reward)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autenticado'
            ], 401);
        }
        
        if ($user->points < $reward->points_cost) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes suficientes puntos para canjear esta recompensa'
            ], 400);
        }
        
        // Generar código de canje único
        $redemptionCode = 'ECO-' . strtoupper(Str::random(8)) . '-REWARD';
        
        // Crear registro de canje
        $redemption = RewardRedemption::create([
            'user_id' => $user->id,
            'reward_id' => $reward->id,
            'points_spent' => $reward->points_cost,
            'redemption_code' => $redemptionCode,
            'status' => 'pending'
        ]);
        
        // Restar puntos al usuario - usar el modelo User para actualizar
        User::where('id', $user->id)->decrement('points', $reward->points_cost);
        
        return response()->json([
            'success' => true,
            'message' => 'Recompensa canjeada correctamente',
            'redemption_code' => $redemptionCode
        ]);
    }

    // Para administradores
    public function adminIndex()
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!Auth::user() || Auth::user()->role !== 'admin') {
            abort(403, 'No tienes permiso para acceder a esta página');
        }
        
        $rewards = Reward::all();
        return Inertia::render('Admin/Rewards/Index', [
            'rewards' => $rewards
        ]);
    }

    public function store(Request $request)
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!Auth::user() || Auth::user()->role !== 'admin') {
            abort(403, 'No tienes permiso para realizar esta acción');
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'points_cost' => 'required|integer|min:1',
            'category' => 'required|string|max:255',
            'active' => 'boolean'
        ]);

        $reward = Reward::create($validated);
        return redirect()->back()->with('success', 'Recompensa creada correctamente');
    }

    public function update(Request $request, Reward $reward)
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!Auth::user() || Auth::user()->role !== 'admin') {
            abort(403, 'No tienes permiso para realizar esta acción');
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'points_cost' => 'required|integer|min:1',
            'category' => 'required|string|max:255',
            'active' => 'boolean'
        ]);

        $reward->update($validated);
        return redirect()->back()->with('success', 'Recompensa actualizada correctamente');
    }

    public function destroy(Reward $reward)
    {
        // Verificar si el usuario tiene permisos de administrador
        if (!Auth::user() || Auth::user()->role !== 'admin') {
            abort(403, 'No tienes permiso para realizar esta acción');
        }
        
        $reward->delete();
        return redirect()->back()->with('success', 'Recompensa eliminada correctamente');
    }

    public function history()
{
    return Inertia::render('RewardsHistory');
}
}