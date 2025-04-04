<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialController extends Controller
{
    public function index()
    {
        $materials = Material::orderBy('name')
            ->get()
            ->map(function ($material) {
                return [
                    'id' => $material->id,
                    'name' => $material->name,
                    'description' => $material->description,
                    'points_per_unit' => $material->points_per_unit,
                    'weight_per_unit' => $material->weight_per_unit,
                    'is_active' => $material->is_active,
                    'recycling_count' => $material->recyclingRecords()->count(),
                    'created_at' => $material->created_at->format('d/m/Y'),
                ];
            });
            
        return Inertia::render('Admin/Materials/Index', [
            'materials' => $materials
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'points_per_unit' => 'required|integer|min:1',
            'weight_per_unit' => 'required|numeric|min:0.01',
            'is_active' => 'boolean',
        ]);
        
        Material::create($validated);
        
        return redirect()->route('admin.materials')->with('success', 'Material creado correctamente');
    }
    
    public function update(Request $request, Material $material)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'points_per_unit' => 'required|integer|min:1',
            'weight_per_unit' => 'required|numeric|min:0.01',
            'is_active' => 'boolean',
        ]);
        
        $material->update($validated);
        
        return redirect()->route('admin.materials')->with('success', 'Material actualizado correctamente');
    }
    
    public function destroy(Material $material)
    {
        // Verificar si hay registros de reciclaje asociados
        if ($material->recyclingRecords()->count() > 0) {
            return redirect()->route('admin.materials')->with('error', 'No se puede eliminar un material con registros de reciclaje asociados');
        }
        
        $material->delete();
        
        return redirect()->route('admin.materials')->with('success', 'Material eliminado correctamente');
    }
}

