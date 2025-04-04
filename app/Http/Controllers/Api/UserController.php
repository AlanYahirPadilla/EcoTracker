<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'points', 'created_at')
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                // Determinar el rol del usuario (esto depende de cómo manejes los roles en tu aplicación)
                $role = 'user';
                if ($user->hasPermissionTo('viewAdminDashboard')) {
                    $role = 'admin';
                } elseif ($user->hasPermissionTo('validateRecycling')) {
                    $role = 'recycler';
                }
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'points' => $user->points,
                    'role' => $role,
                    'created_at' => $user->created_at->format('d/m/Y'),
                ];
            });
            
        return response()->json($users);
    }
}

