<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'time_start',
        'time_end',
        'location',
        'building',
        'description',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'date' => 'date'
    ];
}

