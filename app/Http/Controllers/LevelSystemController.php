<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class LevelSystemController extends Controller
{
    public function index()
    {
        // Obtener el usuario actual
        $user = Auth::user();
        
        // Definir los niveles
        $levels = [
            [
                'name' => 'Principiante',
                'range' => '0-99',
                'icon' => 'Seedling',
                'color' => 'green-400',
                'requirements' => 'Comienza tu viaje de reciclaje',
                'benefits' => 'Acceso a recompensas básicas',
                'description' => 'El primer paso en tu camino hacia un campus más sostenible. Cada pequeña acción cuenta.'
            ],
            [
                'name' => 'Intermedio',
                'range' => '100-299',
                'icon' => 'Leaf',
                'color' => 'green-500',
                'requirements' => 'Acumula 100 puntos reciclando',
                'benefits' => 'Descuentos especiales en la cafetería',
                'description' => 'Has demostrado tu compromiso con el medio ambiente. Sigue así y verás crecer tu impacto.'
            ],
            [
                'name' => 'Avanzado',
                'range' => '300-599',
                'icon' => 'Tree',
                'color' => 'green-600',
                'requirements' => 'Acumula 300 puntos reciclando',
                'benefits' => 'Puntos extra en materias participantes',
                'description' => 'Tu dedicación es notable. Estás creando un cambio significativo en nuestro campus.'
            ],
            [
                'name' => 'Experto',
                'range' => '600+',
                'icon' => 'Forest',
                'color' => 'green-700',
                'requirements' => 'Acumula 600 puntos reciclando',
                'benefits' => 'Reconocimiento especial y recompensas exclusivas',
                'description' => 'Eres un líder en sostenibilidad. Tu ejemplo inspira a toda la comunidad universitaria.'
            ]
        ];
        
        // Determinar el nivel actual del usuario
        $currentLevel = $this->getUserLevel($user->points);
        
        // Calcular el progreso hacia el siguiente nivel
        $nextLevel = $this->getNextLevel($currentLevel);
        $pointsToNextLevel = $this->getPointsToNextLevel($currentLevel, $user->points);
        $progress = $this->calculateProgress($currentLevel, $user->points);
        
        // Obtener estadísticas de usuarios por nivel
        $userStats = $this->getUserStatsByLevel();
        
        return Inertia::render('LevelSystem', [
            'levels' => $levels,
            'currentLevel' => $currentLevel,
            'nextLevel' => $nextLevel,
            'pointsToNextLevel' => $pointsToNextLevel,
            'userPoints' => $user->points,
            'progress' => $progress,
            'userStats' => $userStats
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
    
    private function getNextLevel($currentLevel)
    {
        switch ($currentLevel) {
            case 'Principiante':
                return 'Intermedio';
            case 'Intermedio':
                return 'Avanzado';
            case 'Avanzado':
                return 'Experto';
            default:
                return null; // No hay siguiente nivel para Experto
        }
    }
    
    private function getPointsToNextLevel($currentLevel, $currentPoints)
    {
        switch ($currentLevel) {
            case 'Principiante':
                return 100 - $currentPoints;
            case 'Intermedio':
                return 300 - $currentPoints;
            case 'Avanzado':
                return 600 - $currentPoints;
            default:
                return 0; // No hay siguiente nivel para Experto
        }
    }
    
    private function calculateProgress($currentLevel, $currentPoints)
    {
        switch ($currentLevel) {
            case 'Principiante':
                return ($currentPoints / 100) * 100;
            case 'Intermedio':
                return (($currentPoints - 100) / 200) * 100;
            case 'Avanzado':
                return (($currentPoints - 300) / 300) * 100;
            default:
                return 100; // Experto ya está al máximo
        }
    }
    
    private function getUserStatsByLevel()
    {
        // En un entorno real, esto consultaría la base de datos
        // Aquí usamos datos de ejemplo
        try {
            $principiante = User::where('points', '<', 100)->count();
            $intermedio = User::whereBetween('points', [100, 299])->count();
            $avanzado = User::whereBetween('points', [300, 599])->count();
            $experto = User::where('points', '>=', 600)->count();
            
            return [
                'Principiante' => $principiante,
                'Intermedio' => $intermedio,
                'Avanzado' => $avanzado,
                'Experto' => $experto
            ];
        } catch (\Exception $e) {
            // Datos de ejemplo en caso de error
            return [
                'Principiante' => 45,
                'Intermedio' => 30,
                'Avanzado' => 15,
                'Experto' => 10
            ];
        }
    }
}

