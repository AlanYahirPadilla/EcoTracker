<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\RecyclingRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Schema;

class RecycleController extends Controller
{
    public function index()
    {
        $materials = Material::all();
        
        return Inertia::render('Recycle', [
            'materials' => $materials
        ]);
    }
    
    public function store(Request $request)
    {
        // Agregar logs para diagnosticar el problema
        \Log::info('Recibiendo solicitud de reciclaje', $request->all());
        
        try {
            // Validación básica
            $validated = $request->validate([
                'material_id' => 'required',
                'quantity' => 'required|integer|min:1|max:50',
                'location' => 'required|string',
                'comments' => 'nullable|string'
            ]);
            
            // Obtener el material y calcular puntos
            $material = Material::findOrFail($validated['material_id']);
            $pointsEarned = $material->points_per_unit * $validated['quantity'];
            
            // Generar número de ticket
            $ticketNumber = 'ECO-' . rand(1000, 9999);
            
            // Crear el registro con puntos correctamente asignados
            $record = new RecyclingRecord();
            $record->user_id = auth()->id();
            $record->material_id = $validated['material_id'];
            $record->quantity = $validated['quantity'];
            $record->location = $validated['location'];
            $record->comments = $validated['comments'];
            $record->ticket_number = $ticketNumber;
            $record->points_earned = $pointsEarned; // Usar el nombre correcto de la columna
            $record->status = 'pending';
            
            // Registrar para depuración
            \Log::info('Guardando registro con puntos: ' . $pointsEarned);
            
            $record->save();
            
            // Agregar logs después de guardar
            \Log::info('Registro de reciclaje guardado', ['id' => $record->id]);
            
            // Preparar datos para la vista
            $ticket = $record;
            $ticket->material_name = $material->name;
            
            return Inertia::render('Recycle', [
                'materials' => Material::all(),
                'success' => true,
                'ticket' => $ticket
            ]);
            
        } catch (\Exception $e) {
            // Log del error para diagnóstico
            \Log::error('Error en RecycleController: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            return back()->withErrors(['error' => 'Ha ocurrido un error: ' . $e->getMessage()]);
        }
    }
} 