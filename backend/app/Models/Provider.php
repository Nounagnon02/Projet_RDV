<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    protected $fillable = [
        'user_id',
        'business_name',
        'description',
        'address',
        'city',
        'postal_code',
        'slug',
        'avatar',
        'cover_image',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }

    public function availabilities()
    {
        return $this->hasMany(Availability::class);
    }

    public function closedPeriods()
    {
        return $this->hasMany(ClosedPeriod::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function settings()
    {
        return $this->hasOne(Setting::class);
    }
}
