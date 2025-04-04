<?php

namespace App\Policies;

use App\Models\RecyclingRecord;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RecyclingRecordPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return in_array($user->role, ['admin', 'recycling_manager']);
    }

    public function view(User $user, RecyclingRecord $record)
    {
        return $user->id === $record->user_id || in_array($user->role, ['admin', 'recycling_manager']);
    }

    public function create(User $user)
    {
        return true; // Todos los usuarios pueden crear registros
    }

    public function update(User $user, RecyclingRecord $record)
    {
        return in_array($user->role, ['admin', 'recycling_manager']);
    }

    public function delete(User $user, RecyclingRecord $record)
    {
        return $user->role === 'admin';
    }
}