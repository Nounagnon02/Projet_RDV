<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('consultations')) {
            Schema::create('consultations', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('porosity_result')->nullable(); // low, medium, high
                $table->string('curl_pattern_result')->nullable(); // 4A, 4B, 4C
                $table->json('photos')->nullable(); // URLs des photos uploadées
                $table->json('recommended_products')->nullable(); // IDs des produits recommandés
                $table->text('stylist_notes')->nullable();
                $table->string('status')->default('completed'); // pending_review, completed
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('consultations');
    }
};
