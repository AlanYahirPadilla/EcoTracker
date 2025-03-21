<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RankingController extends Controller
{
    public function index()
    {
        // Obtener el usuario actual
        $user = auth()->user();
        
        // Obtener la posición del usuario (simulado para el ejemplo)
        $userRank = [
            'position' => 15,
            'points' => $user->points ?? 160,
            'level' => 'Principiante',
            'pointsToNextLevel' => 50
        ];
        
        return Inertia::render('Ranking', [
            'userRank' => $userRank,
        ]);

        
    }
    
}