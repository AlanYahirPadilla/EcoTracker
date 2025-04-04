<?php

namespace Database\Seeders;

use App\Models\Reward;
use Illuminate\Database\Seeder;

class RewardSeeder extends Seeder
{
    public function run()
    {
        $rewards = [
            [
                'name' => 'Café Gratis',
                'description' => 'Cafetería CUCEI',
                'points_cost' => 100,
                'category' => 'food',
                'active' => true
            ],
            [
                'name' => 'Puntos Extra',
                'description' => 'En cualquier materia',
                'points_cost' => 500,
                'category' => 'academic',
                'active' => true
            ],
            [
                'name' => 'Botella Ecológica',
                'description' => 'Edición CUCEI',
                'points_cost' => 300,
                'category' => 'merchandise',
                'active' => true
            ],
            [
                'name' => 'Descuento en Cafetería',
                'description' => '15% de descuento',
                'points_cost' => 200,
                'category' => 'food',
                'active' => true
            ],
            [
                'name' => 'Libreta Ecológica',
                'description' => 'Papel reciclado',
                'points_cost' => 150,
                'category' => 'merchandise',
                'active' => true
            ]
        ];

        foreach ($rewards as $reward) {
            Reward::create($reward);
        }
    }
}