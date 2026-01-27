<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'discount_type',
        'discount_value',
        'min_purchase_amount',
        'user_id',
        'is_active',
        'expires_at',
        'used_at'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
        'is_active' => 'boolean',
        'min_purchase_amount' => 'decimal:2',
        'discount_value' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isValid(?float $cartTotal = null)
    {
        if (!$this->is_active) return false;
        if ($this->used_at) return false;
        if ($this->expires_at && $this->expires_at->isPast()) return false;
        
        if ($cartTotal !== null && $this->min_purchase_amount && $cartTotal < $this->min_purchase_amount) {
            return false;
        }

        return true;
    }

    public function calculateDiscount(float $amount)
    {
        if ($this->discount_type === 'percentage') {
            return $amount * ($this->discount_value / 100);
        }
        
        return min($amount, $this->discount_value);
    }
}
