<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HairProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'hair_type',
        'porosity',
        'elasticity',
        'density',
        'allergies',
        'product_preferences',
        'styling_preferences',
        'last_consultation_date'
    ];

    protected $casts = [
        'product_preferences' => 'array',
        'styling_preferences' => 'array',
        'last_consultation_date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
