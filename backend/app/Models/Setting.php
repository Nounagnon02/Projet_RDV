<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'provider_id',
        'slot_duration',
        'cancellation_delay_hours',
        'reminder_hours_before',
        'timezone',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}
