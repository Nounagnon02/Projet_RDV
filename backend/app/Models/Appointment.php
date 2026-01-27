<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'provider_id',
        'client_id',
        'guest_name',
        'guest_whatsapp',
        'service_id',
        'date',
        'start_time',
        'end_time',
        'status',
        'client_notes',
        'provider_notes',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
