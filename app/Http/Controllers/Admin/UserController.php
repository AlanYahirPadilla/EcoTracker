<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'points', 'role', 'created_at')
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'points' => $user->points,
                    'role' => $user->role,
                    'created_at' => $user->created_at->format('Y-m-d\TH:i:s.u\Z'),
                ];
            });
            
        return Inertia::render('Admin/Users/Index', [
            'users' => $users
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:admin,recycling_manager,user',
            'points' => 'required|integer|min:0',
        ]);
        
        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'points' => $validated['points'],
            'role' => $validated['role'],
        ]);
        
        return redirect()->route('admin.users')->with('success', 'Usuario creado correctamente');
    }
    
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|string|in:admin,recycling_manager,user',
            'points' => 'required|integer|min:0',
        ]);
        
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->points = $validated['points'];
        $user->role = $validated['role'];
        
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        
        $user->save();
        
        return redirect()->route('admin.users')->with('success', 'Usuario actualizado correctamente');
    }
    
    public function destroy(User $user)
    {
        // Verificar si es el último administrador
        if ($user->isAdmin() && User::where('role', 'admin')->count() <= 1) {
            return redirect()->route('admin.users')->with('error', 'No se puede eliminar el último administrador');
        }
        
        $user->delete();
        
        return redirect()->route('admin.users')->with('success', 'Usuario eliminado correctamente');
    }
    
    public function changeRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|string|in:admin,recycling_manager,user',
        ]);
        
        // Verificar si es el último administrador
        if ($user->isAdmin() && $validated['role'] !== 'admin' && User::where('role', 'admin')->count() <= 1) {
            return redirect()->route('admin.users')->with('error', 'No se puede cambiar el rol del último administrador');
        }
        
        $user->role = $validated['role'];
        $user->save();
        
        return redirect()->route('admin.users')->with('success', 'Rol actualizado correctamente');
    }
    
    // Método de prueba para verificar si la ruta funciona
    public function testChangeRole(User $user)
    {
        return response()->json([
            'message' => 'Ruta de prueba funcionando',
            'user' => $user,
            'is_admin' => $user->isAdmin(),
            'is_recycling_manager' => $user->isRecyclingManager()
        ]);
    }
}

