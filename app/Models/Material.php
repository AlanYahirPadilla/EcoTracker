<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'points_per_unit',
        'weight_per_unit',
        'is_active'
    ];

    // Asegurarse de que estos campos sean tratados como booleanos
    protected $casts = [
        'is_active' => 'boolean',
        'weight_per_unit' => 'float',
        'points_per_unit' => 'integer',
    ];

    public function recyclingRecords()
    {
        return $this->hasMany(RecyclingRecord::class);
    }
}

