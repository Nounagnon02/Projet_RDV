<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'loyalty_account_id',
        'points',
        'type', // earned, redeemed, expired, bonus
        'description',
        'appointment_id',
        'order_id'
    ];

    public function account()
    {
        return $this->belongsTo(LoyaltyAccount::class, 'loyalty_account_id');
    }

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
