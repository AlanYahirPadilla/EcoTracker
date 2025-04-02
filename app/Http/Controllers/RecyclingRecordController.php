<?php

namespace App\Http\Controllers;

use App\Models\RecyclingRecord;
use App\Models\Material;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecyclingRecordController extends Controller
{
    public function index()
    {
        $records = RecyclingRecord::where('user_id', auth()->id())
            ->with('material')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($records);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'material_id' => 'required|exists:materials,id',
            'quantity' => 'required|integer|min:1|max:50',
            'location' => 'required|string',
            'comments' => 'nullable|string',
        ]);
        
        // Obtener el material para calcular puntos
        $material = Material::find($validated['material_id']);
        
        // Crear un nuevo registro de reciclaje
        $record = new RecyclingRecord();
        $record->user_id = auth()->id();
        $record->material_id = $validated['material_id'];
        $record->quantity = $validated['quantity'];
        $record->location = $validated['location'];
        $record->comments = $validated['comments'] ?? null;
        $record->status = 'pending';
        
        // Calcular puntos estimados
        $record->points_earned = $material->points_per_unit * $validated['quantity'];
        
        // Generar código de ticket
        $record->ticket_number = 'ECO-' . rand(1000, 9999);
        
        $record->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Registro de reciclaje enviado correctamente',
            'ticket_number' => $record->ticket_number
        ]);
    }
    
    public function pendingValidations()
    {
        $pendingRecords = RecyclingRecord::where('status', 'pending')
            ->with(['user', 'material'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($record) {
                return [
                    'id' => $record->id,
                    'user' => [
                        'id' => $record->user->id,
                        'name' => $record->user->name,
                        'email' => $record->user->email
                    ],
                    'material' => [
                        'id' => $record->material->id,
                        'name' => $record->material->name,
                        'points_per_unit' => $record->material->points_per_unit
                    ],
                    'quantity' => $record->quantity,
                    'location' => $record->location,
                    'comments' => $record->comments,
                    'ticket_number' => $record->ticket_number,
                    'points_earned' => $record->points_earned,
                    'created_at' => $record->created_at->format('Y-m-d H:i:s')
                ];
            });
            
        return response()->json($pendingRecords);
    }
    
    public function approve(Request $request, RecyclingRecord $record)
    {
        // Verificar que el registro esté pendiente
        if ($record->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Este registro ya ha sido procesado'
            ], 400);
        }
        
        // Actualizar el estado del registro
        $record->status = 'approved';
        $record->save();
        
        // Actualizar los puntos del usuario
        $user = User::find($record->user_id);
        $user->points += $record->points_earned;
        $user->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Registro aprobado correctamente'
        ]);
    }
    
    public function reject(Request $request, RecyclingRecord $record)
    {
        // Verificar que el registro esté pendiente
        if ($record->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Este registro ya ha sido procesado'
            ], 400);
        }
        
        // Actualizar el estado del registro
        $record->status = 'rejected';
        $record->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Registro rechazado correctamente'
        ]);
    }
}


