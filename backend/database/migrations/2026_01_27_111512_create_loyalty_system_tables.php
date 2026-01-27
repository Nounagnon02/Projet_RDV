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
        // Table des comptes fidélité
        if (!Schema::hasTable('loyalty_accounts')) {
            Schema::create('loyalty_accounts', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->integer('points')->default(0);
                $table->enum('tier', ['regular', 'gold', 'platinum'])->default('regular');
                $table->integer('total_visits')->default(0);
                $table->timestamps();
            });
        }

        // Table des transactions de fidélité
        if (!Schema::hasTable('loyalty_transactions')) {
            Schema::create('loyalty_transactions', function (Blueprint $table) {
                $table->id();
                $table->foreignId('loyalty_account_id')->constrained()->onDelete('cascade');
                $table->integer('points'); // Positif pour gain, negatif pour depense
                $table->string('type'); // 'earned', 'redeemed', 'expired', 'bonus'
                $table->string('description')->nullable();
                $table->foreignId('appointment_id')->nullable(); // Si lié à un RDV
                $table->foreignId('order_id')->nullable(); // Si lié à une commande
                $table->timestamps();
            });
        }

        // Table des vouchers/récompenses
        if (!Schema::hasTable('vouchers')) {
            Schema::create('vouchers', function (Blueprint $table) {
                $table->id();
                $table->string('code')->unique();
                $table->enum('discount_type', ['percentage', 'fixed']);
                $table->decimal('discount_value', 10, 2);
                $table->decimal('min_purchase_amount', 10, 2)->nullable();
                $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); // Nullable si générique
                $table->boolean('is_active')->default(true);
                $table->timestamp('expires_at')->nullable();
                $table->timestamp('used_at')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('vouchers');
        Schema::dropIfExists('loyalty_transactions');
        Schema::dropIfExists('loyalty_accounts');
    }
};
