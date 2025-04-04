<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon;

class ActivityController extends Controller
{
    /**
     * Mostrar lista de actividades
     */
    public function index()
    {
        $activities = Activity::orderBy('date', 'desc')
            ->orderBy('time_start', 'desc')
            ->get()
            ->map(function ($activity) {
                // Verificar si la actividad ya ha pasado
                $isPast = $activity->isPast();
                
                return [
                    'id' => $activity->id,
                    'title' => $activity->title_or_default,
                    'date' => $activity->date ? $activity->date->format('Y-m-d') : null,
                    'date_formatted' => $activity->date ? $activity->date->format('d/m/Y') : null,
                    'time_start' => $activity->time_start,
                    'time_end' => $activity->time_end,
                    'location' => $activity->location,
                    'building' => $activity->building,
                    'points_reward' => $activity->points_reward,
                    'is_active' => $activity->is_active,
                    'is_past' => $isPast,
                    'participants_count' => $activity->participants()->count(),
                ];
            });

        return Inertia::render('Admin/Activities/Index', [
            'activities' => $activities
        ]);
    }

    /**
     * Mostrar formulario para crear actividad
     */
    public function create()
    {
        return Inertia::render('Admin/Activities/Create');
    }

    /**
     * Guardar nueva actividad
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'time_start' => 'required|string',
            'time_end' => 'required|string',
            'location' => 'required|string|max:255',
            'building' => 'nullable|string|max:255',
            'points_reward' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        Activity::create($validated);

        return redirect()->route('admin.activities.index')
            ->with('success', 'Actividad creada correctamente.');
    }

    /**
     * Mostrar formulario para editar actividad
     */
    public function edit($id)
    {
        $activity = Activity::findOrFail($id);

        return Inertia::render('Admin/Activities/Edit', [
            'activity' => [
                'id' => $activity->id,
                'title' => $activity->title,
                'description' => $activity->description,
                'date' => $activity->date ? $activity->date->format('Y-m-d') : null,
                'time_start' => $activity->time_start,
                'time_end' => $activity->time_end,
                'location' => $activity->location,
                'building' => $activity->building,
                'points_reward' => $activity->points_reward,
                'is_active' => $activity->is_active,
            ]
        ]);
    }

    /**
     * Actualizar actividad
     */
    public function update(Request $request, $id)
    {
        $activity = Activity::findOrFail($id);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'time_start' => 'required|string',
            'time_end' => 'required|string',
            'location' => 'required|string|max:255',
            'building' => 'nullable|string|max:255',
            'points_reward' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $activity->update($validated);

        return redirect()->route('admin.activities.index')
            ->with('success', 'Actividad actualizada correctamente.');
    }

    /**
     * Eliminar actividad
     */
    public function destroy($id)
    {
        $activity = Activity::findOrFail($id);
        $activity->delete();

        return redirect()->route('admin.activities.index')
            ->with('success', 'Actividad eliminada correctamente.');
    }

    /**
     * Ver participantes de una actividad
     */
    public function participants($id)
    {
        $activity = Activity::findOrFail($id);
        $participants = $activity->participants()
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => $user->pivot->status,
                    'registered_at' => $user->pivot->created_at->format('d/m/Y H:i'),
                ];
            });

        return Inertia::render('Admin/Activities/Participants', [
            'activity' => [
                'id' => $activity->id,
                'title' => $activity->title_or_default,
                'date_formatted' => $activity->date ? $activity->date->format('d/m/Y') : null,
                'time_start' => $activity->time_start,
                'time_end' => $activity->time_end,
            ],
            'participants' => $participants
        ]);
    }

    /**
     * Actualizar estado de un participante
     */
    public function updateParticipantStatus(Request $request, $activityId, $userId)
    {
        $request->validate([
            'status' => 'required|in:registered,attended,cancelled',
        ]);

        $activity = Activity::findOrFail($activityId);
        $activity->participants()->updateExistingPivot($userId, [
            'status' => $request->status
        ]);

        return redirect()->back()->with('success', 'Estado del participante actualizado correctamente.');
    }
}

