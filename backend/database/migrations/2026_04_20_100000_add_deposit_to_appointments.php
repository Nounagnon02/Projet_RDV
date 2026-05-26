<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->decimal('total_amount', 10, 2)->default(0)->after('status');
            $table->decimal('deposit_amount', 10, 2)->default(0)->after('total_amount');
            $table->decimal('remaining_amount', 10, 2)->default(0)->after('deposit_amount');
            $table->boolean('deposit_paid')->default(false)->after('remaining_amount');
            $table->string('payment_transaction_id')->nullable()->after('deposit_paid');
        });
    }

    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn([
                'total_amount',
                'deposit_amount',
                'remaining_amount',
                'deposit_paid',
                'payment_transaction_id'
            ]);
        });
    }
};
