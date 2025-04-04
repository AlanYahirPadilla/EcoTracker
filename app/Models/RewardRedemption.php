<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RewardRedemption extends Model
{
  use HasFactory;

  protected $fillable = [
      'user_id',
      'reward_id',
      'points_spent',
      'redemption_code',
      'status'
  ];

  public function user()
  {
      return $this->belongsTo(User::class);
  }

  public function reward()
  {
      return $this->belongsTo(Reward::class);
  }
}

