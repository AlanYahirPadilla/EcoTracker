<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityController extends Controller
{
    public function index()
    {
        $activities = Activity::orderBy('date', 'desc')
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'date' => $activity->date ? $activity->date->format('Y-m-d') : null,
                    'time_start' => $activity->time_start,
                    'time_end' => $activity->time_end,
                    'location' => $activity->location,
                    'building' => $activity->building,
                    'description' => $activity->description,
                    'is_active' => $activity->is_active,
                    'created_at' => $activity->created_at->format('Y-m-d'),
                ];
            });
            
        return Inertia::render('Admin/Activities/Index', [
            'activities' => $activities
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'nullable|date',
            'time_start' => 'required|string',
            'time_end' => 'required|string',
            'location' => 'required|string',
            'building' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        
        // Agregar logging para depuración
        \Log::info('Creando actividad', $validated);
        
        $activity = Activity::create($validated);
        
        // Verificar que se creó correctamente
        \Log::info('Actividad creada', ['id' => $activity->id]);
        
        return redirect()->route('admin.activities')->with('success', 'Actividad creada correctamente');
    }
    
    public function update(Request $request, Activity $activity)
    {
        $validated = $request->validate([
            'date' => 'nullable|date',
            'time_start' => 'required|string',
            'time_end' => 'required|string',
            'location' => 'required|string',
            'building' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        
        $activity->update($validated);
        
        return redirect()->route('admin.activities')->with('success', 'Actividad actualizada correctamente');
    }
    
    public function destroy(Activity $activity)
    {
        $activity->delete();
        
        return redirect()->route('admin.activities')->with('success', 'Actividad eliminada correctamente');
    }
}

