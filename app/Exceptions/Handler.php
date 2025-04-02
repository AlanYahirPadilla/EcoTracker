<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Inertia\Inertia;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
        
        // Personalizar el manejo de errores para Inertia
        $this->renderable(function (Throwable $e, $request) {
            if ($request->is('admin/*') && $request->inertia()) {
                return Inertia::render('Error', [
                    'status' => 500,
                    'message' => $e->getMessage()
                ])->toResponse($request);
            }
        });
    }
}

