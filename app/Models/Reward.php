<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reward extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'points_cost',
        'category',
        'is_active'
    ];

    public function redemptions()
    {
        return $this->hasMany(RewardRedemption::class);
    }
}

