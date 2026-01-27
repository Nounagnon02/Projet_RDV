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
        if (!Schema::hasTable('hair_profiles')) {
            Schema::create('hair_profiles', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->enum('hair_type', ['4A', '4B', '4C', 'mixte', 'unknown'])->default('unknown');
                $table->enum('porosity', ['low', 'medium', 'high', 'unknown'])->default('unknown');
                $table->enum('elasticity', ['low', 'medium', 'high', 'unknown'])->default('unknown');
                $table->enum('density', ['low', 'medium', 'high', 'unknown'])->default('unknown');
                $table->text('allergies')->nullable();
                $table->json('product_preferences')->nullable();
                $table->json('styling_preferences')->nullable();
                $table->timestamp('last_consultation_date')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('hair_profiles');
    }
};
