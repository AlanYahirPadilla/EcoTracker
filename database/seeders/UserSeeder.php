<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'points' => 1000
        ]);

        // Regular user
        User::create([
            'name' => 'Juan Pérez',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'student_id' => '123456789',
            'career' => 'Ingeniería Informática',
            'points' => 450
        ]);

        // Recycling manager
        User::create([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
            'role' => 'recycling_manager',
            'points' => 0
        ]);
    }
}