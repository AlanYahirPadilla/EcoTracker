<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'date',
        'time_start',
        'time_end',
        'location',
        'building',
        'description',
        'points_reward',
        'image_path',
        'is_active'
    ];

    protected $casts = [
        'date' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Los usuarios que participan en esta actividad
     */
    public function participants()
    {
        return $this->belongsToMany(User::class, 'activity_user')
            ->withPivot('status')
            ->withTimestamps();
    }

    /**
     * Obtener actividades próximas
     */
    public static function upcoming()
    {
        $now = Carbon::now();
        
        return self::where(function($query) use ($now) {
                // Actividades de hoy que aún no han terminado
                $query->whereDate('date', $now->toDateString())
                      ->where(function($q) use ($now) {
                          $currentTime = $now->format('H:i:s');
                          $q->where('time_end', '>=', $currentTime);
                      });
            })
            ->orWhere(function($query) use ($now) {
                // Actividades futuras
                $query->whereDate('date', '>', $now->toDateString());
            })
            ->where('is_active', true)
            ->orderBy('date', 'asc')
            ->orderBy('time_start', 'asc');
    }

    /**
     * Verificar si la actividad ya ha pasado
     */
    public function isPast()
    {
        $now = Carbon::now();
        $activityDate = $this->date;
        
        // Si la fecha es anterior a hoy, definitivamente ha pasado
        if ($activityDate->lt($now->startOfDay())) {
            return true;
        }
        
        // Si es hoy, verificar la hora de finalización
        if ($activityDate->isSameDay($now)) {
            $endTime = Carbon::createFromFormat('H:i', $this->time_end);
            $activityEndDateTime = Carbon::create(
                $activityDate->year,
                $activityDate->month,
                $activityDate->day,
                $endTime->hour,
                $endTime->minute,
                0
            );
        
            return $now->gt($activityEndDateTime);
        }
        
        return false;
    }

    /**
     * Verificar si la actividad está en progreso
     */
    public function isInProgress()
    {
        $now = Carbon::now();
        $activityDate = $this->date;
        
        // Solo puede estar en progreso si es hoy
        if ($activityDate->isSameDay($now)) {
            $startTime = Carbon::createFromFormat('H:i', $this->time_start);
            $endTime = Carbon::createFromFormat('H:i', $this->time_end);
            
            $activityStartDateTime = Carbon::create(
                $activityDate->year,
                $activityDate->month,
                $activityDate->day,
                $startTime->hour,
                $startTime->minute,
                0
            );
            
            $activityEndDateTime = Carbon::create(
                $activityDate->year,
                $activityDate->month,
                $activityDate->day,
                $endTime->hour,
                $endTime->minute,
                0
            );
            
            return $now->gte($activityStartDateTime) && $now->lte($activityEndDateTime);
        }
        
        return false;
    }

    /**
     * Obtener la fecha formateada para mostrar
     */
    public function getFormattedDateAttribute()
    {
        return $this->date ? $this->date->format('d/m/Y') : '';
    }

    /**
     * Obtener el título o una descripción por defecto
     */
    public function getTitleOrDefaultAttribute()
    {
        return $this->title ?: 'Actividad de reciclaje';
    }
}

