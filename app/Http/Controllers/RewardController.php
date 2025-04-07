<?php

namespace App\Http\Controllers;

use App\Models\Reward;
use App\Models\RewardRedemption;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
    
    public function redeem(Reward $reward)
    {
        // Verificar si el usuario tiene suficientes puntos
        if (auth()->user()->points < $reward->points_cost) {
            return back()->with('error', 'No tienes suficientes puntos para esta recompensa.');
        }

        // Generar un código único de redención
        $redemptionCode = 'ECO-' . strtoupper(substr(md5(uniqid()), 0, 8)) . '-REWARD';

        try {
            // Crear el registro de redención
            RewardRedemption::create([
                'user_id' => auth()->id(),
                'reward_id' => $reward->id,
                'points_spent' => $reward->points_cost,
                'redemption_code' => $redemptionCode,
                'status' => 'pending',
            ]);

            // Actualizar puntos del usuario
            $user = auth()->user();
            $remainingPoints = $user->points - $reward->points_cost;
            $user->points = $remainingPoints;
            $user->save();

            // Mostrar una vista HTML tradicional
            return view('redemption-success', [
                'code' => $redemptionCode,
                'points' => $remainingPoints,
                'reward' => $reward
            ]);
        } catch (\Exception $e) {
            // Manejar errores
            return back()->with('error', 'Ocurrió un error al procesar tu canje. Por favor, intenta nuevamente.');
        }
    }
}

