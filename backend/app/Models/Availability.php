<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Availability extends Model
{
    protected $fillable = [
        'provider_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_active',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}
