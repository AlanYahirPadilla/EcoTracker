<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reward;
use App\Models\RewardRedemption;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RewardController extends Controller
{
    public function index()
    {
        $rewards = Reward::orderBy('name')
            ->get()
            ->map(function ($reward) {
                return [
                    'id' => $reward->id,
                    'name' => $reward->name,
                    'description' => $reward->description,
                    'points_cost' => $reward->points_cost,
                    'category' => $reward->category,
                    'is_active' => $reward->is_active,
                    'redemptions_count' => $reward->redemptions()->count(),
                    'created_at' => $reward->created_at->format('d/m/Y'),
                ];
            });
            
        return Inertia::render('Admin/Rewards/Index', [
            'rewards' => $rewards
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'points_cost' => 'required|integer|min:1',
            'category' => 'required|string|in:food,merchandise,academic,other',
            'is_active' => 'boolean',
        ]);
        
        Reward::create($validated);
        
        return redirect()->route('admin.rewards')->with('success', 'Recompensa creada correctamente');
    }
    
    public function update(Request $request, Reward $reward)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'points_cost' => 'required|integer|min:1',
            'category' => 'required|string|in:food,merchandise,academic,other',
            'is_active' => 'boolean',
        ]);
        
        $reward->update($validated);
        
        return redirect()->route('admin.rewards')->with('success', 'Recompensa actualizada correctamente');
    }
    
    public function destroy(Reward $reward)
    {
        // Verificar si hay canjes asociados
        if ($reward->redemptions()->count() > 0) {
            return redirect()->route('admin.rewards')->with('error', 'No se puede eliminar una recompensa con canjes asociados');
        }
        
        $reward->delete();
        
        return redirect()->route('admin.rewards')->with('success', 'Recompensa eliminada correctamente');
    }
}

