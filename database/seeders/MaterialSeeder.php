<?php

namespace Database\Seeders;

use App\Models\Material;
use Illuminate\Database\Seeder;

class MaterialSeeder extends Seeder
{
    public function run()
    {
        $materials = [
            [
                'name' => 'Papel',
                'description' => 'Hojas de papel, cuadernos, libros',
                'points_per_unit' => 2,
                'active' => true
            ],
            [
                'name' => 'Cartón',
                'description' => 'Cajas, empaques',
                'points_per_unit' => 2,
                'active' => true
            ],
            [
                'name' => 'Plástico',
                'description' => 'Botellas, envases',
                'points_per_unit' => 2,
                'active' => true
            ],
            [
                'name' => 'Aluminio',
                'description' => 'Latas, papel aluminio',
                'points_per_unit' => 5,
                'active' => true
            ],
            [
                'name' => 'Vidrio',
                'description' => 'Botellas, frascos',
                'points_per_unit' => 3,
                'active' => true
            ],
            [
                'name' => 'Residuo Electrónico',
                'description' => 'Baterías, cables, dispositivos pequeños',
                'points_per_unit' => 10,
                'active' => true
            ]
        ];

        foreach ($materials as $material) {
            Material::create($material);
        }
    }
}