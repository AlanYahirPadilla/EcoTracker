<?php

namespace App\Http\Controllers;

use App\Models\RecyclingRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    public function index()
    {
        // Obtener el usuario autenticado de manera explícita
        $user = Auth::user();
        
        // Verificar que el usuario esté autenticado
        if (!$user) {
            return redirect()->route('login');
        }
        
        // Filtrar explícitamente por el ID del usuario autenticado
        $tickets = RecyclingRecord::where('user_id', $user->id)
            ->with('material')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($record) {
                return [
                    'id' => $record->id,
                    'code' => $record->ticket_number,
                    'date' => $record->created_at->format('Y-m-d'),
                    'material' => $record->material->name,
                    'quantity' => $record->quantity,
                    'points' => $record->points_earned,
                    'status' => $this->translateStatus($record->status)
                ];
            });
        
        // Depuración: registrar el ID del usuario y la cantidad de tickets
        \Log::info('User ID: ' . $user->id . ', Tickets count: ' . $tickets->count());
        
        return Inertia::render('Tickets', [
            'tickets' => $tickets
        ]);
    }
    
    private function translateStatus($status)
    {
        switch ($status) {
            case 'approved':
                return 'Aprobado';
            case 'rejected':
                return 'Rechazado';
            case 'pending':
                return 'Pendiente';
            default:
                return $status;
        }
    }
}

