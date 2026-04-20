<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('orders') && !Schema::hasColumn('orders', 'fedapay_transaction_id')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->string('fedapay_transaction_id')->nullable();
            });
        }
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('fedapay_transaction_id');
        });
    }
};
