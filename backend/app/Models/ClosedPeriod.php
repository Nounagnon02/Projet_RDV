<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClosedPeriod extends Model
{
    protected $fillable = [
        'provider_id',
        'start_date',
        'end_date',
        'reason',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}
