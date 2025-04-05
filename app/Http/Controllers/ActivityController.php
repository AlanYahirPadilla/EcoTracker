<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class ActivityController extends Controller
{
    /**
     * Mostrar todas las actividades próximas
     */
    public function index()
    {
        $activities = Activity::upcoming()
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'title' => $activity->title_or_default,
                    'description' => $activity->description,
                    'location' => $activity->location,
                    'building' => $activity->building,
                    'date' => $activity->formatted_date,
                    'time_start' => $activity->time_start,
                    'time_end' => $activity->time_end,
                    'image_path' => $activity->image_path,
                    'points_reward' => $activity->points_reward,
                    'is_registered' => Auth::check() ? Auth::user()->isRegisteredForActivity($activity) : false,
                    'participants_count' => $activity->participants()->count(),
                ];
            });

        return Inertia::render('Activities/Index', [
            'activities' => $activities
        ]);
    }

    /**
     * Mostrar una actividad específica
     */
    public function show($id)
    {
        $activity = Activity::findOrFail($id);
        $isRegistered = Auth::check() ? Auth::user()->isRegisteredForActivity($activity) : false;
        $participantsCount = $activity->participants()->count();

        return Inertia::render('Activities/Show', [
            'activity' => [
                'id' => $activity->id,
                'title' => $activity->title_or_default,
                'description' => $activity->description,
                'location' => $activity->location,
                'building' => $activity->building,
                'date' => $activity->formatted_date,
                'time_start' => $activity->time_start,
                'time_end' => $activity->time_end,
                'image_path' => $activity->image_path,
                'points_reward' => $activity->points_reward,
                'is_registered' => $isRegistered,
                'participants_count' => $participantsCount,
            ]
        ]);
    }

    /**
     * Registrar al usuario en una actividad
     */
    public function register($id)
    {
        $activity = Activity::findOrFail($id);
        $user = Auth::user();

        if ($activity->isPast()) {
            return redirect()->back()->with('error', 'No puedes registrarte en una actividad que ya ha pasado.');
        }

        if ($user->registerForActivity($activity)) {
            return redirect()->back()->with('success', 'Te has registrado correctamente en la actividad.');
        }

        return redirect()->back()->with('info', 'Ya estás registrado en esta actividad.');
    }

    /**
     * Cancelar registro del usuario en una actividad
     */
    public function cancel($id)
    {
        $activity = Activity::findOrFail($id);
        $user = Auth::user();

        if ($activity->isPast()) {
            return redirect()->back()->with('error', 'No puedes cancelar tu registro en una actividad que ya ha pasado.');
        }

        if ($user->cancelActivityRegistration($activity)) {
            return redirect()->back()->with('success', 'Has cancelado tu registro en la actividad.');
        }

        return redirect()->back()->with('error', 'No estás registrado en esta actividad.');
    }

    /**
     * Obtener actividades próximas para el dashboard
     */
    /**
     * Obtener actividades próximas para el dashboard.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function upcoming()
    {
        try {
            $now = now();
        
            // Obtener actividades futuras o en curso
            $activities = Activity::where('is_active', true)
                ->where(function($query) use ($now) {
                    // Actividades de hoy que aún no han terminado
                    $query->whereDate('date', $now->toDateString())
                        ->where(function($q) use ($now) {
                            $currentTime = $now->format('H:i:s');
                            $q->where('time_end', '>=', $currentTime);
                        });
                })
                ->orWhere(function($query) use ($now) {
                    // Actividades futuras
                    $query->whereDate('date', '>', $now->toDateString())
                        ->where('is_active', true);
                })
                ->orderBy('date', 'asc')
                ->orderBy('time_start', 'asc')
                ->take(5)
                ->get();
            
            // Si no hay actividades, devolver un array vacío
            if ($activities->isEmpty()) {
                return response()->json(['activities' => []]);
            }
        
            // Mapear actividades para el frontend
            $mappedActivities = $activities->map(function ($activity) {
                $isRegistered = false;
                if (auth()->check()) {
                    $isRegistered = auth()->user()->isRegisteredForActivity($activity);
                }
            
                return [
                    'id' => $activity->id,
                    'title' => $activity->title ?: 'Actividad de reciclaje',
                    'description' => $activity->description ?: '',
                    'location' => $activity->location ?: 'CUCEI',
                    'building' => $activity->building ?: '',
                    'date' => $activity->date ? $activity->date->format('d/m/Y') : $now->format('d/m/Y'),
                    'time_start' => $activity->time_start ?: '09:00',
                    'time_end' => $activity->time_end ?: '13:00',
                    'points_reward' => $activity->points_reward ?: 0,
                    'is_registered' => $isRegistered,
                ];
            });

            return response()->json(['activities' => $mappedActivities]);
        } catch (\Exception $e) {
            \Log::error('Error en upcoming activities: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
        
            // Devolver un error más descriptivo
            return response()->json([
                'error' => 'Error al cargar actividades próximas',
                'message' => $e->getMessage(),
                'trace' => app()->environment('local') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    /**
     * Obtener la próxima actividad para el dashboard
     */
    public function nextActivity()
    {
        try {
            $nextActivity = Activity::where(function($query) {
                    $now = Carbon::now();
                    // Actividades de hoy que aún no han terminado
                    $query->whereDate('date', $now->toDateString())
                          ->where('time_end', '>=', $now->format('H:i:s'));
                })
                ->orWhere(function($query) {
                    // Actividades futuras
                    $query->whereDate('date', '>', Carbon::now()->toDateString());
                })
                ->where('is_active', true)
                ->orderBy('date', 'asc')
                ->orderBy('time_start', 'asc')
                ->first();

            if (!$nextActivity) {
                return response()->json(['nextActivity' => null]);
            }

            $isRegistered = Auth::check() ? Auth::user()->isRegisteredForActivity($nextActivity) : false;

            return response()->json([
                'nextActivity' => [
                    'id' => $nextActivity->id,
                    'title' => $nextActivity->title ?: 'Actividad de reciclaje',
                    'date' => $nextActivity->date->isToday() ? 'Hoy' : $nextActivity->date->format('d/m/Y'),
                    'timeStart' => $nextActivity->time_start,
                    'timeEnd' => $nextActivity->time_end,
                    'location' => $nextActivity->location,
                    'building' => $nextActivity->building,
                    'description' => $nextActivity->description,
                    'points_reward' => $nextActivity->points_reward,
                    'is_registered' => $isRegistered,
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error en nextActivity: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Mostrar actividades en las que está registrado el usuario
     */
    public function myActivities()
    {
        $user = Auth::user();
        $activities = $user->activities()
            ->orderBy('date', 'asc')
            ->orderBy('time_start', 'asc')
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'title' => $activity->title_or_default,
                    'description' => $activity->description,
                    'location' => $activity->location,
                    'building' => $activity->building,
                    'date' => $activity->formatted_date,
                    'time_start' => $activity->time_start,
                    'time_end' => $activity->time_end,
                    'points_reward' => $activity->points_reward,
                    'status' => $activity->pivot->status,
                    'is_past' => $activity->isPast(),
                ];
            });

        return Inertia::render('Activities/MyActivities', [
            'activities' => $activities
        ]);
    }
}

