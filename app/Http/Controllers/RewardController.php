<?php

namespace App\Http\Controllers;

use App\Models\Reward;
use App\Models\RewardRedemption;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class RewardController extends Controller
{
    public function index()
    {
        // Obtener todas las recompensas y pasarlas directamente a la vista
        $rewards = Reward::all();
        
        return Inertia::render('Rewards', [
            'rewards' => $rewards
        ]);
    }
    
    public function list()
    {
        $rewards = Reward::all();
        return response()->json($rewards);
    }
    
    public function history()
    {
        // Obtener el usuario autenticado de manera explícita
        $user = Auth::user();
        
        // Verificar que el usuario esté autenticado
        if (!$user) {
            return redirect()->route('login');
        }
        
        // Filtrar explícitamente por el ID del usuario autenticado
        $redemptions = RewardRedemption::where('user_id', $user->id)
            ->with('reward')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($redemption) {
                return [
                    'id' => $redemption->id,
                    'date' => $redemption->created_at->format('Y-m-d'),
                    'reward' => $redemption->reward->name,
                    'points' => $redemption->points_spent,
                    'code' => $redemption->redemption_code,
                    'status' => $redemption->status === 'completed' ? 'Canjeado' : 'Pendiente',
                    'redeemedAt' => $redemption->status === 'completed' ? $redemption->updated_at->format('Y-m-d') : null,
                ];
            });
        
        // Depuración: registrar el ID del usuario y la cantidad de redenciones
        \Log::info('User ID: ' . $user->id . ', Redemptions count: ' . $redemptions->count());
        
        return Inertia::render('RewardsHistory', [
            'redeemHistory' => $redemptions
        ]);
    }
    
    public function redeem(Request $request, Reward $reward)
    {
        $user = Auth::user();
        
        // Verificar si el usuario tiene suficientes puntos
        if ($user->points < $reward->points_cost) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes suficientes puntos para canjear esta recompensa'
            ], 400);
        }
        
        // Generar código de canje
        $redemptionCode = 'ECO-' . strtoupper(substr(md5(uniqid()), 0, 8)) . '-REWARD';
        
        // Crear registro de canje
        $redemption = new RewardRedemption();
        $redemption->user_id = $user->id;
        $redemption->reward_id = $reward->id;
        $redemption->points_spent = $reward->points_cost;
        $redemption->redemption_code = $redemptionCode;
        $redemption->status = 'pending';
        $redemption->save();
        
        // Restar puntos al usuario
        $user->points -= $reward->points_cost;
        $user->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Recompensa canjeada correctamente',
            'redemption_code' => $redemptionCode
        ]);
    }
}

