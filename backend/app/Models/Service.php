<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'provider_id',
        'name',
        'description',
        'duration',
        'price',
        'category',
        'is_active',
        'image',
    ];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
