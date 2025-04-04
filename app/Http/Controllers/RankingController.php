<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\RecyclingRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RankingController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Obtener los usuarios con más puntos
        $topUsers = User::select('id', 'name', 'points')
            ->orderBy('points', 'desc')
            ->take(10)
            ->get();
        
        // Calcular la posición del usuario actual
        $userPosition = User::where('points', '>', $user->points)->count() + 1;
        
        // Determinar el nivel del usuario basado en sus puntos
        $level = $this->getUserLevel($user->points);
        
        // Calcular puntos para el siguiente nivel
        $nextLevelPoints = $this->getNextLevelPoints($level);
        $pointsToNextLevel = $nextLevelPoints - $user->points;
        
        // Obtener el material más reciclado por cada usuario
        $topUserIds = $topUsers->pluck('id')->toArray();
        $mostRecycledMaterials = RecyclingRecord::select('user_id', 'material_id', DB::raw('COUNT(*) as count'))
            ->whereIn('user_id', $topUserIds)
            ->where('status', 'approved')
            ->groupBy('user_id', 'material_id')
            ->orderBy('count', 'desc')
            ->with('material')
            ->get()
            ->groupBy('user_id')
            ->map(function ($records) {
                return $records->first()->material->name;
            });
        
        // Preparar datos para la vista
        $formattedTopUsers = $topUsers->map(function ($user, $index) use ($mostRecycledMaterials) {
            return [
                'position' => $index + 1,
                'name' => $user->name,
                'points' => $user->points,
                'level' => $this->getUserLevel($user->points),
                'material' => $mostRecycledMaterials[$user->id] ?? 'Desconocido'
            ];
        });
        
        $userRank = [
            'position' => $userPosition,
            'points' => $user->points,
            'level' => $level,
            'pointsToNextLevel' => $pointsToNextLevel
        ];
        
        return Inertia::render('Ranking', [
            'topUsers' => $formattedTopUsers,
            'userRank' => $userRank
        ]);
    }
    
    private function getUserLevel($points)
    {
        if ($points < 100) {
            return 'Principiante';
        } elseif ($points < 300) {
            return 'Intermedio';
        } elseif ($points < 600) {
            return 'Avanzado';
        } else {
            return 'Experto';
        }
    }
    
    private function getNextLevelPoints($currentLevel)
    {
        switch ($currentLevel) {
            case 'Principiante':
                return 100;
            case 'Intermedio':
                return 300;
            case 'Avanzado':
                return 600;
            case 'Experto':
                return 1000;
            default:
                return 100;
        }
    }
}

