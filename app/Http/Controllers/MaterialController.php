<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialController extends Controller
{
    public function index()
    {
        $materials = Material::where('active', true)->get();
        return response()->json($materials);
    }

    // Para administradores
    public function adminIndex()
    {
        $materials = Material::all();
        return Inertia::render('Admin/Materials/Index', [
            'materials' => $materials
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'points_per_unit' => 'required|integer|min:1',
            'active' => 'boolean'
        ]);

        $material = Material::create($validated);
        return redirect()->back()->with('success', 'Material creado correctamente');
    }

    public function update(Request $request, Material $material)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'points_per_unit' => 'required|integer|min:1',
            'active' => 'boolean'
        ]);

        $material->update($validated);
        return redirect()->back()->with('success', 'Material actualizado correctamente');
    }

    public function destroy(Material $material)
    {
        $material->delete();
        return redirect()->back()->with('success', 'Material eliminado correctamente');
    }
}