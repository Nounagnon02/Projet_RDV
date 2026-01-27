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
        // Update Products table
        if (Schema::hasTable('products')) {
            Schema::table('products', function (Blueprint $table) {
                if (!Schema::hasColumn('products', 'hair_goal')) {
                    $table->string('hair_goal')->nullable()->after('category_id'); // retention, hydration, scalp_health
                }
                if (!Schema::hasColumn('products', 'ingredients')) {
                    $table->text('ingredients')->nullable()->after('description');
                }
                if (!Schema::hasColumn('products', 'usage_instructions')) {
                    $table->text('usage_instructions')->nullable()->after('ingredients');
                }
                if (!Schema::hasColumn('products', 'is_featured')) {
                    $table->boolean('is_featured')->default(false);
                }
            });
        } else {
             Schema::create('products', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->decimal('price', 10, 2);
                $table->integer('stock')->default(0);
                $table->string('category')->nullable(); // ou foreignId category_id
                $table->string('hair_goal')->nullable();
                $table->text('ingredients')->nullable();
                $table->text('usage_instructions')->nullable();
                $table->json('images')->nullable();
                $table->boolean('is_featured')->default(false);
                $table->timestamps();
            });
        }

        // Update Orders table
        if (Schema::hasTable('orders')) {
             Schema::table('orders', function (Blueprint $table) {
                if (!Schema::hasColumn('orders', 'shipping_address')) {
                    $table->json('shipping_address')->nullable();
                }
                if (!Schema::hasColumn('orders', 'delivery_method')) {
                    $table->string('delivery_method')->default('standard'); // standard, express, pickup
                }
                if (!Schema::hasColumn('orders', 'tracking_number')) {
                    $table->string('tracking_number')->nullable();
                }
            });
        } else {
            Schema::create('orders', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained();
                $table->decimal('total_amount', 10, 2);
                $table->string('status')->default('pending');
                $table->json('shipping_address')->nullable();
                $table->string('delivery_method')->default('standard');
                $table->string('tracking_number')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        // On ne drop pas les tables car elles pouvaient exister avant.
        // On pourrait dropper les colonnes ajoutees, mais c'est risqué.
    }
};
