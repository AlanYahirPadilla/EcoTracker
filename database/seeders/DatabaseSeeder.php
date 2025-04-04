<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            MaterialSeeder::class,
            RewardSeeder::class,
            UserSeeder::class,
            // Otros seeders que tengas...
        ]);
        
        // Crear un usuario administrador si no está en UserSeeder
        $admin = \App\Models\User::where('email', 'admin@example.com')->first();
        
        if (!$admin) {
            $admin = \App\Models\User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'),
            ]);
        }
        
        // Asignar rol solo si no lo tiene ya
        if ($admin && !$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }
    }
}

