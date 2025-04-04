<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\RecyclingRecord;
use App\Models\RewardRedemption;

class ProfileController extends Controller
{
    /**
     * Display the user's profile.
     */
    public function show(Request $request): Response
    {
        $user = $request->user();
        
        // Obtener los registros de reciclaje del usuario
        $recyclingRecords = RecyclingRecord::where('user_id', $user->id)
            ->with('material')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($record) {
                return [
                    'id' => $record->id,
                    'material' => $record->material->name,
                    'quantity' => $record->quantity,
                    'points' => $record->points_earned,
                    'date' => $record->created_at->format('Y-m-d'),
                    'status' => $record->status
                ];
            });
        
        // Obtener los canjes de recompensas del usuario
        $rewardRedemptions = RewardRedemption::where('user_id', $user->id)
            ->with('reward')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($redemption) {
                return [
                    'id' => $redemption->id,
                    'reward' => $redemption->reward->name,
                    'points' => $redemption->reward->points_cost,
                    'date' => $redemption->created_at->format('Y-m-d'),
                    'status' => $redemption->status
                ];
            });
        
        // Calcular estadísticas
        $totalRecycled = RecyclingRecord::where('user_id', $user->id)
            ->where('status', 'approved')
            ->count();
            
        $totalPoints = $user->points;
        
        $totalRedemptions = RewardRedemption::where('user_id', $user->id)
            ->where('status', 'approved')
            ->count();
        
        return Inertia::render('Profile/Show', [
            'recyclingRecords' => $recyclingRecords,
            'rewardRedemptions' => $rewardRedemptions,
            'stats' => [
                'totalRecycled' => $totalRecycled,
                'totalPoints' => $totalPoints,
                'totalRedemptions' => $totalRedemptions
            ]
        ]);
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
