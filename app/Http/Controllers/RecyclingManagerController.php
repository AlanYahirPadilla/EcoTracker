<?php

namespace App\Http\Controllers;

use App\Models\RewardRedemption;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class RecyclingManagerController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('RecyclingManager/Dashboard', [
            'pendingRedemptions' => $this->getPendingRedemptions(),
            'recentRedemptions' => $this->getRecentlyCompletedRedemptions()
        ]);
    }
    
    public function verifyTicket(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
        ]);
        
        $redemption = RewardRedemption::where('redemption_code', $validated['code'])
            ->where('status', 'pending')
            ->with(['user', 'reward'])
            ->first();
            
        if (!$redemption) {
            return back()->with('error', 'Código inválido o ya canjeado');
        }
        
        return Inertia::render('RecyclingManager/VerifyTicket', [
            'redemption' => [
                'id' => $redemption->id,
                'code' => $redemption->redemption_code,
                'reward' => $redemption->reward->name,
                'description' => $redemption->reward->description,
                'points' => $redemption->points_spent,
                'user' => [
                    'id' => $redemption->user->id,
                    'name' => $redemption->user->name,
                ],
                'created_at' => $redemption->created_at->format('d/m/Y H:i')
            ]
        ]);
    }
    
    public function completeRedemption(Request $request, $id)
    {
        $redemption = RewardRedemption::findOrFail($id);
        
        if ($redemption->status !== 'pending') {
            return back()->with('error', 'Este ticket ya ha sido procesado');
        }
        
        try {
            DB::transaction(function() use ($redemption, $request) {
                // 1. Actualizar estado del canje
                $redemption->status = 'completed';
                $redemption->completed_at = now();
                $redemption->completed_by = auth()->id();
                $redemption->save();
                
                // 2. Transferir puntos al recycling_manager
                $manager = auth()->user();
                $manager->points += $redemption->points_spent;
                $manager->save();
            });
            
            return redirect()->route('recycling-manager.dashboard')
                ->with('success', 'Canje completado correctamente y puntos transferidos');
                
        } catch (\Exception $e) {
            return back()->with('error', 'Error al procesar el canje: ' . $e->getMessage());
        }
    }
    
    public function history()
    {
        $completedRedemptions = RewardRedemption::where('completed_by', auth()->id())
            ->with(['user', 'reward'])
            ->orderBy('completed_at', 'desc')
            ->get()
            ->map(function ($redemption) {
                return [
                    'id' => $redemption->id,
                    'code' => $redemption->redemption_code,
                    'reward' => $redemption->reward->name,
                    'points' => $redemption->points_spent,
                    'user' => $redemption->user->name,
                    'completed_at' => $redemption->completed_at ? date('d/m/Y H:i', strtotime($redemption->completed_at)) : null
                ];
            });
            
        return Inertia::render('RecyclingManager/History', [
            'completedRedemptions' => $completedRedemptions
        ]);
    }
    
    private function getPendingRedemptions()
    {
        return RewardRedemption::where('status', 'pending')
            ->with(['user', 'reward'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($redemption) {
                return [
                    'id' => $redemption->id,
                    'code' => $redemption->redemption_code,
                    'reward' => $redemption->reward->name,
                    'points' => $redemption->points_spent,
                    'user' => $redemption->user->name,
                    'completed_at' => $redemption->completed_at ? date('d/m/Y H:i', strtotime($redemption->completed_at)) : null
                ];
            });
    }
    
    private function getRecentlyCompletedRedemptions()
    {
        return RewardRedemption::where('completed_by', auth()->id())
            ->where('status', 'completed')
            ->with(['user', 'reward'])
            ->orderBy('completed_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($redemption) {
                return [
                    'id' => $redemption->id,
                    'code' => $redemption->redemption_code,
                    'reward' => $redemption->reward->name,
                    'points' => $redemption->points_spent,
                    'user' => $redemption->user->name,
                    'completed_at' => $redemption->completed_at ? date('d/m/Y H:i', strtotime($redemption->completed_at)) : null
                ];
            });
    }

    public function showVerifyTicketForm(Request $request)
    {
        $code = $request->query('code');
        
        if (!$code) {
            return redirect()->route('recycling-manager.dashboard')
                ->with('error', 'Código no proporcionado');
        }
        
        $redemption = RewardRedemption::where('redemption_code', $code)
            ->where('status', 'pending')
            ->with(['user', 'reward'])
            ->first();
            
        if (!$redemption) {
            return redirect()->route('recycling-manager.dashboard')
                ->with('error', 'Código inválido o ya canjeado');
        }
        
        return Inertia::render('RecyclingManager/VerifyTicket', [
            'redemption' => [
                'id' => $redemption->id,
                'code' => $redemption->redemption_code,
                'reward' => $redemption->reward->name,
                'description' => $redemption->reward->description,
                'points' => $redemption->points_spent,
                'user' => [
                    'id' => $redemption->user->id,
                    'name' => $redemption->user->name,
                ],
                'created_at' => $redemption->created_at->format('d/m/Y H:i')
            ]
        ]);
    }

    /**
 * Export redemption history to PDF or CSV
 */
public function exportHistory(Request $request)
{
    $format = $request->query('format', 'pdf');
    
    // Obtener los canjes completados
    $redemptions = RewardRedemption::where('status', 'completed')
        ->with(['user', 'reward'])
        ->orderBy('completed_at', 'desc')
        ->get()
        ->map(function($redemption) {
            return [
                'code' => $redemption->redemption_code,
                'date' => $redemption->completed_at ? date('d/m/Y H:i', strtotime($redemption->completed_at)) : '',
                'reward' => $redemption->reward->name,
                'user' => $redemption->user->name,
                'points' => $redemption->points_spent
            ];
        });
    
    // Exportar según formato
    if ($format === 'pdf') {
        return $this->generatePdfReport($redemptions);
    } else {
        return $this->generateCsvReport($redemptions);
    }
}

/**
 * Generate CSV report
 */
private function generateCsvReport($redemptions)
{
    $headers = [
        'Content-Type' => 'text/csv; charset=UTF-8',
        'Content-Disposition' => 'attachment; filename="historial-canjes-' . now()->format('Y-m-d') . '.csv"',
    ];
    
    $callback = function() use ($redemptions) {
        $file = fopen('php://output', 'w');
        // UTF-8 BOM for Excel compatibility
        fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
        
        // Headers
        fputcsv($file, ['Código', 'Fecha', 'Recompensa', 'Usuario', 'Puntos']);
        
        // Data
        foreach ($redemptions as $redemption) {
            fputcsv($file, [
                $redemption['code'],
                $redemption['date'],
                $redemption['reward'],
                $redemption['user'],
                $redemption['points']
            ]);
        }
        
        fclose($file);
    };
    
    return response()->stream($callback, 200, $headers);
}

/**
 * Generate PDF report using DomPDF
 */
private function generatePdfReport($redemptions)
{
    $totalPoints = collect($redemptions)->sum('points');
    
    // Generar PDF con DomPDF
    $data = [
        'redemptions' => $redemptions,
        'totalPoints' => $totalPoints,
        'date' => now()->format('d/m/Y'),
        'count' => count($redemptions)
    ];
    
    // Si no puedes instalar DomPDF, usa esta versión simple
    if (!class_exists('Barryvdh\DomPDF\Facade\Pdf') && !class_exists('Barryvdh\DomPDF\Facade')) {
        // Versión simplificada: archivo HTML con mime type correcto
        $html = view('exports.redemptions-html', $data)->render();
        $filename = 'historial-canjes-'.now()->format('Y-m-d').'.html';
        
        return response($html)
            ->header('Content-Type', 'text/html')
            ->header('Content-Disposition', 'attachment; filename="'.$filename.'"');
    }
    
    // Usar DomPDF para generar un PDF real
    $pdf = app('dompdf.wrapper');
    $pdf->loadView('exports.redemptions-pdf', $data);
    return $pdf->download('historial-canjes-' . now()->format('Y-m-d') . '.pdf');
}
}