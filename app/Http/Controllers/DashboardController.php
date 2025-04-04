<?php

namespace App\Http\Controllers;

use App\Models\RecyclingRecord;
use App\Models\Reward;
use App\Models\RewardRedemption;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
// Añadir la importación del modelo Activity
use App\Models\Activity;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
        
            // Verificar que el usuario esté autenticado
            if (!$user) {
                Log::error('Intento de acceso al dashboard sin autenticación');
                return redirect()->route('login');
            }
        
            Log::info('Acceso al dashboard', ['user_id' => $user->id]);
        
            // Obtener estadísticas del usuario con manejo de errores
            try {
                $stats = [
                    'totalRecycled' => RecyclingRecord::where('user_id', $user->id)
                        ->where('status', 'approved')
                        ->sum('quantity'),
                    
                    'pendingTickets' => RecyclingRecord::where('user_id', $user->id)
                        ->where('status', 'pending')
                        ->count(),
                    
                    'totalPoints' => $user->points,
                    
                    'redeemedRewards' => RewardRedemption::where('user_id', $user->id)
                        ->count()
                ];
            } catch (\Exception $e) {
                Log::error('Error al obtener estadísticas: ' . $e->getMessage(), [
                    'user_id' => $user->id,
                    'trace' => $e->getTraceAsString()
                ]);
            
                // Si hay un error, usar valores predeterminados
                $stats = [
                    'totalRecycled' => 0,
                    'pendingTickets' => 0,
                    'totalPoints' => $user->points ?? 0,
                    'redeemedRewards' => 0
                ];
            }
        
            // Obtener últimos registros de reciclaje con manejo de errores
            try {
                $recentRecords = RecyclingRecord::where('user_id', $user->id)
                    ->with('material')
                    ->orderBy('created_at', 'desc')
                    ->take(5)
                    ->get()
                    ->map(function ($record) {
                        return [
                            'id' => $record->id,
                            'date' => $record->created_at->format('Y-m-d'),
                            'material' => $record->material->name,
                            'quantity' => $record->quantity,
                            'points' => $record->points_earned,
                            'status' => $this->translateStatus($record->status)
                        ];
                    });
            } catch (\Exception $e) {
                Log::error('Error al obtener registros recientes: ' . $e->getMessage(), [
                    'user_id' => $user->id,
                    'trace' => $e->getTraceAsString()
                ]);
            
                // Si hay un error, usar un array vacío
                $recentRecords = [];
            }
            
            // Obtener recompensas disponibles con manejo de errores
            try {
                $availableRewards = Reward::where('is_active', true)
                    ->orderBy('points_cost', 'asc')
                    ->take(3)
                    ->get();
            } catch (\Exception $e) {
                Log::error('Error al obtener recompensas disponibles: ' . $e->getMessage(), [
                    'trace' => $e->getTraceAsString()
                ]);
            
                // Si hay un error, usar un array vacío
                $availableRewards = [];
            }
        
           // Obtener próxima actividad
        $nextActivity = Activity::upcoming()->first();
        
        if ($nextActivity) {
            $nextActivity = [
                'id' => $nextActivity->id,
                'title' => $nextActivity->title_or_default,
                'date' => $nextActivity->date->isToday() ? 'Hoy' : $nextActivity->formatted_date,
                'timeStart' => $nextActivity->time_start,
                'timeEnd' => $nextActivity->time_end,
                'location' => $nextActivity->location,
                'building' => $nextActivity->building,
                'description' => $nextActivity->description,
                'points_reward' => $nextActivity->points_reward,
                'is_registered' => $user->isRegisteredForActivity($nextActivity),
            ];
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentRecords' => $recentRecords,
            'availableRewards' => $availableRewards,
            'nextActivity' => $nextActivity,
        ]);
        } catch (\Exception $e) {
            Log::error('Error general en el dashboard: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString()
            ]);
        
            // En caso de error, mostrar una página de error específica para el dashboard
            return Inertia::render('Dashboard/Error', [
                'status' => 500,
                'message' => 'Ha ocurrido un error al cargar el dashboard. Por favor, inténtalo de nuevo.'
            ]);
        }
    }

    private function translateStatus($status)
    {
        switch ($status) {
            case 'pending':
                return 'Pendiente';
            case 'approved':
                return 'Aprobado';
            case 'rejected':
                return 'Rechazado';
            default:
                return 'Desconocido';
        }
    }
}

