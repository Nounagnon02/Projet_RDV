<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'subject',
        'message',
        'sent_at',
        'read_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
