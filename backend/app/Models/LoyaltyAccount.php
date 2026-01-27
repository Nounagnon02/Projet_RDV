<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'points',
        'tier',
        'total_visits'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(LoyaltyTransaction::class);
    }

    /**
     * Ajoute des points et met à jour le tier
     */
    public function addPoints(int $amount, string $description, ?int $appointmentId = null, ?int $orderId = null)
    {
        $this->points += $amount;
        $this->save();

        $this->transactions()->create([
            'points' => $amount,
            'type' => 'earned',
            'description' => $description,
            'appointment_id' => $appointmentId,
            'order_id' => $orderId
        ]);

        $this->checkTierUpgrade();
    }

    /**
     * Utilise des points
     */
    public function redeemPoints(int $amount, string $description, ?int $orderId = null)
    {
        if ($this->points < $amount) {
            throw new \Exception("Points insuffisants");
        }

        $this->points -= $amount;
        $this->save();

        $this->transactions()->create([
            'points' => -$amount,
            'type' => 'redeemed',
            'description' => $description,
            'order_id' => $orderId
        ]);
    }

    /**
     * Vérifie et met à jour le statut (tier)
     */
    public function checkTierUpgrade()
    {
        // Logique simple pour l'exemple :
        // > 1000 pts = Gold
        // > 3000 pts = Platinum
        
        $oldTier = $this->tier;
        $newTier = 'regular';

        if ($this->points >= 3000) {
            $newTier = 'platinum';
        } elseif ($this->points >= 1000) {
            $newTier = 'gold';
        }

        if ($newTier !== $oldTier) {
            $this->tier = $newTier;
            $this->save();
            // On pourrait déclencher un événement ici (Notification utilisateur)
        }
    }
}
