<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    public function index()
    {
        $materials = Material::select('id', 'name', 'description', 'points_per_unit', 'weight_per_unit', 'is_active', 'created_at')
            ->orderBy('name')
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
            
        return response()->json($materials);
    }
}

