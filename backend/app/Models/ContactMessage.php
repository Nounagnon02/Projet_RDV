<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'status',
        'read_at',
        'replied_at',
        'admin_reply'
    ];

    protected $casts = [
        'read_at' => 'datetime',
        'replied_at' => 'datetime',
    ];

    /**
     * Mark message as read
     */
    public function markAsRead()
    {
        if ($this->status === 'new') {
            $this->update([
                'status' => 'read',
                'read_at' => now()
            ]);
        }
    }

    /**
     * Mark message as replied
     */
    public function markAsReplied($reply)
    {
        $this->update([
            'status' => 'replied',
            'replied_at' => now(),
            'admin_reply' => $reply
        ]);
    }

    /**
     * Scope for new messages
     */
    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    /**
     * Scope for unread messages (new + read)
     */
    public function scopeUnread($query)
    {
        return $query->whereIn('status', ['new', 'read']);
    }
}
