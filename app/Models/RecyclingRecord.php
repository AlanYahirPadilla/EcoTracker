<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecyclingRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'material_id',
        'quantity',
        'location',
        'comments',
        'status',
        'points_earned',
        'ticket_number'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function material()
    {
        return $this->belongsTo(Material::class);
    }
}