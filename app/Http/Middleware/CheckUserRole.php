// php artisan make:middleware CheckUserRole

// app/Http/Middleware/CheckUserRole.php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckUserRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        if (!$request->user() || $request->user()->role !== $role) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}

// Registrar en app/Http/Kernel.php en $routeMiddleware
protected $routeMiddleware = [
    // ...
    'role' => \App\Http\Middleware\CheckUserRole::class,
];