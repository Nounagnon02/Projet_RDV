<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                if (!Schema::hasColumn('orders', 'payment_status')) {
                    $table->string('payment_status')->default('pending');
                }
                if (!Schema::hasColumn('orders', 'full_name')) {
                    $table->string('full_name')->nullable();
                }
                if (!Schema::hasColumn('orders', 'delivery_location')) {
                    $table->string('delivery_location')->nullable();
                }
                if (!Schema::hasColumn('orders', 'phone')) {
                    $table->string('phone')->nullable();
                }
                if (!Schema::hasColumn('orders', 'email')) {
                    $table->string('email')->nullable();
                }
            });
        }

        if (!Schema::hasTable('order_items')) {
            Schema::create('order_items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
                $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                $table->integer('quantity');
                $table->decimal('price', 10, 2);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('order_items')) {
            Schema::dropIfExists('order_items');
        }

        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                if (Schema::hasColumn('orders', 'payment_status')) {
                    $table->dropColumn('payment_status');
                }
                if (Schema::hasColumn('orders', 'full_name')) {
                    $table->dropColumn('full_name');
                }
                if (Schema::hasColumn('orders', 'delivery_location')) {
                    $table->dropColumn('delivery_location');
                }
                if (Schema::hasColumn('orders', 'phone')) {
                    $table->dropColumn('phone');
                }
                if (Schema::hasColumn('orders', 'email')) {
                    $table->dropColumn('email');
                }
            });
        }
    }
};
