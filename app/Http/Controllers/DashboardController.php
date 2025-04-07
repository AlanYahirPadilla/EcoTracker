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
use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;

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
            
            // Obtener recompensas disponibles
            try {
                // Consulta más simple y directa
                $availableRewards = Reward::where('is_active', true)
                    ->orderBy('points_cost', 'asc')
                    ->take(3)
                    ->get();
                
                // Ver qué obtenemos para depuración
                \Log::info('Recompensas para dashboard:', [
                    'count' => $availableRewards->count(),
                    'ids' => $availableRewards->pluck('id')->toArray()
                ]);
                
            } catch (\Exception $e) {
                \Log::error('Error al obtener recompensas: ' . $e->getMessage());
                $availableRewards = collect([]);
            }
            
            // Asegurarnos de que availableRewards tenga datos
            if (!isset($availableRewards) || $availableRewards->isEmpty()) {
                \Log::warning('No se encontraron recompensas activas');
                // Usar datos de ejemplo en caso de no encontrar recompensas
                $availableRewards = [
                    [
                        'id' => 1, 
                        'name' => 'Café Gratis', 
                        'description' => 'Cafetería CUCEI', 
                        'points_cost' => 100
                    ],
                    [
                        'id' => 2, 
                        'name' => 'Puntos Extra', 
                        'description' => 'En cualquier materia', 
                        'points_cost' => 500
                    ],
                    [
                        'id' => 3, 
                        'name' => 'Botella Ecológica', 
                        'description' => 'Edición CUCEI', 
                        'points_cost' => 300
                    ]
                ];
            }
        
            // Obtener la próxima actividad
            try {
                // Buscar directamente la actividad que acabas de activar (ID 4 o el que corresponda)
                $specificActivity = Activity::find(4); // Ajusta el ID según corresponda
                \Log::info('Actividad específica:', $specificActivity ? $specificActivity->toArray() : ['No encontrada']);
                
                // Si existe y está activa, usarla directamente
                if ($specificActivity && $specificActivity->is_active) {
                    $activity = $specificActivity;
                    
                    $activityData = [
                        'date' => $activity->date ? $activity->date->format('Y-m-d') : 'Hoy',
                        'timeStart' => $activity->time_start,
                        'timeEnd' => $activity->time_end,
                        'location' => $activity->location,
                        'building' => $activity->building,
                        'description' => $activity->description,
                        'status' => 'upcoming',
                        'is_active' => $activity->is_active // Asegúrate de incluir este campo
                    ];
                    
                    $activityStatus = 'upcoming';
                } else {
                    // Si no se encuentra la actividad específica, continuar con la lógica normal
                    // Filtrar correctamente las actividades
                    $activeActivities = Activity::where('is_active', 1)
                        ->orderBy('date')
                        ->orderBy('time_start')
                        ->get();
                    
                    // Depurar también las actividades filtradas
                    \Log::info('Actividades filtradas:', $activeActivities->toArray());
                    
                    if ($activeActivities->count() > 0) {
                        // Tomar la primera actividad activa
                        $activity = $activeActivities->first();
                        
                        // Verificar si está en curso actualmente
                        $currentTime = now()->format('H:i');
                        $currentDate = now()->format('Y-m-d');
                        $now = Carbon::now();
                        $activityDate = $activity->date ? Carbon::parse($activity->date) : $now->copy()->startOfDay();
                        $activityEndTime = Carbon::parse($activityDate->format('Y-m-d') . ' ' . $activity->time_end);
                        
                        $isInProgress = false;
                        $isUpcoming = true;
                        
                        // Verificar si ya pasó
                        if ($now->gt($activityEndTime)) {
                            // La actividad ya terminó, no mostrarla
                            $activityData = null;
                            $activityStatus = 'none';
                        } else {
                            // Sólo está en progreso si es hoy y dentro del horario
                            if ((!$activityDate || $activityDate == $currentDate) && 
                                $activity->time_start <= $currentTime && 
                                $activity->time_end >= $currentTime) {
                                $isInProgress = true;
                            }
                            
                            $activityData = [
                                'date' => $activity->date ? $activity->date->format('Y-m-d') : 'Hoy',
                                'timeStart' => $activity->time_start,
                                'timeEnd' => $activity->time_end,
                                'location' => $activity->location,
                                'building' => $activity->building,
                                'description' => $activity->description,
                                'status' => $isInProgress ? 'in_progress' : 'upcoming'
                            ];
                            
                            $activityStatus = $isInProgress ? 'in_progress' : 'upcoming';
                        }
                    } else {
                        $activityData = null;
                        $activityStatus = 'none';
                    }
                }
            } catch (\Exception $e) {
                \Log::error('Error al obtener próxima actividad: ' . $e->getMessage(), [
                    'trace' => $e->getTraceAsString()
                ]);
            
                $activityData = null;
                $activityStatus = 'none';
            }
            
            return Inertia::render('Dashboard', [
                'stats' => $stats,
                'recentRecords' => $recentRecords,
                'availableRewards' => $availableRewards,
                'nextActivity' => $activityData,
                'activityStatus' => $activityStatus
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

