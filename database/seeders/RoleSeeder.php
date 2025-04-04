<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear roles
        $adminRole = Role::create(['name' => 'admin']);
        $recyclerRole = Role::create(['name' => 'recycler']);
        $userRole = Role::create(['name' => 'user']);

        // Crear permisos
        $permissions = [
            'view dashboard',
            'manage users',
            'manage materials',
            'manage rewards',
            'view reports',
            'validate recycling',
            'recycle',
            'redeem rewards',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Asignar permisos a roles
        $adminRole->givePermissionTo(Permission::all());
        
        $recyclerRole->givePermissionTo([
            'view dashboard',
            'validate recycling',
            'view reports',
        ]);
        
        $userRole->givePermissionTo([
            'recycle',
            'redeem rewards',
        ]);
    }
}

