<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;

class ActivityController extends Controller
{
    /**
     * Guardar nueva actividad
     */
    public function store(Request $request)
    {
        try {
            Log::info('Datos recibidos para crear actividad:', $request->all());
            
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

            // Convertir la fecha a un objeto Carbon
            $validated['date'] = Carbon::parse($validated['date']);
            
            // Asegurarse de que is_active esté definido
            $validated['is_active'] = $validated['is_active'] ?? true;
            
            Log::info('Datos validados para crear actividad:', $validated);
            
            $activity = Activity::create($validated);
            
            Log::info('Actividad creada con ID: ' . $activity->id);

            return redirect()->route('admin.activities.index')
                ->with('success', 'Actividad creada correctamente.');
        } catch (\Exception $e) {
            Log::error('Error al crear actividad: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return redirect()->back()
                ->withInput()
                ->with('error', 'Error al crear la actividad: ' . $e->getMessage());
        }
    }

    /**
     * Actualizar actividad
     */
    public function update(Request $request, $id)
    {
        try {
            Log::info('Datos recibidos para actualizar actividad:', $request->all());
            
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

            // Convertir la fecha a un objeto Carbon
            $validated['date'] = Carbon::parse($validated['date']);
            
            // Asegurarse de que is_active esté definido
            $validated['is_active'] = $validated['is_active'] ?? true;
            
            Log::info('Datos validados para actualizar actividad:', $validated);
            
            $activity->update($validated);
            
            Log::info('Actividad actualizada con ID: ' . $activity->id);

            return redirect()->route('admin.activities.index')
                ->with('success', 'Actividad actualizada correctamente.');
        } catch (\Exception $e) {
            Log::error('Error al actualizar actividad: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return redirect()->back()
                ->withInput()
                ->with('error', 'Error al actualizar la actividad: ' . $e->getMessage());
        }
    }
}

