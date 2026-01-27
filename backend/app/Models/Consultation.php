<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'porosity_result',
        'curl_pattern_result',
        'photos',
        'recommended_products',
        'stylist_notes',
        'status'
    ];

    protected $casts = [
        'photos' => 'array',
        'recommended_products' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relation fictive vers les produits recommandés (si on stocke des IDs)
    public function getRecommendations()
    {
        if (empty($this->recommended_products)) return collect([]);
        return Product::whereIn('id', $this->recommended_products)->get();
    }
}
