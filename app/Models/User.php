<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Log;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'points',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Check if the user has a specific role.
     *
     * @param string $role
     * @return bool
     */
    public function hasRole($role)
    {
        // Añadir logging para depuración
        Log::info('Verificando rol', [
            'user_id' => $this->id,
            'user_role' => $this->role,
            'required_role' => $role,
            'comparison' => strtolower($this->role) === strtolower($role)
        ]);
        
        // Asegurarse de que la comparación sea insensible a mayúsculas/minúsculas
        return strtolower($this->role) === strtolower($role);
    }

    /**
     * Get the recycling records for the user.
     */
    public function recyclingRecords()
    {
        return $this->hasMany(RecyclingRecord::class);
    }

    /**
     * Get the reward redemptions for the user.
     */
    public function rewardRedemptions()
    {
        return $this->hasMany(RewardRedemption::class);
    }
    
    /**
     * Las actividades en las que participa el usuario
     */
    public function activities()
    {
        return $this->belongsToMany(Activity::class, 'activity_user')
            ->withPivot('status')
            ->withTimestamps();
    }

    /**
     * Verificar si el usuario está registrado en una actividad
     */
    public function isRegisteredForActivity(Activity $activity)
    {
        return $this->activities()->where('activity_id', $activity->id)->exists();
    }

    /**
     * Registrar al usuario en una actividad
     */
    public function registerForActivity(Activity $activity)
    {
        if (!$this->isRegisteredForActivity($activity)) {
            $this->activities()->attach($activity->id, ['status' => 'registered']);
            return true;
        }
        return false;
    }

    /**
     * Cancelar registro del usuario en una actividad
     */
    public function cancelActivityRegistration(Activity $activity)
    {
        return $this->activities()->updateExistingPivot($activity->id, ['status' => 'cancelled']);
    }
}

