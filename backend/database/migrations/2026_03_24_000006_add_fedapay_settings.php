<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('site_settings')->insert([
            ['key' => 'fedapay_mode', 'value' => 'sandbox', 'type' => 'text', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'fedapay_public_key', 'value' => '', 'type' => 'text', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'fedapay_secret_key', 'value' => '', 'type' => 'password', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        DB::table('site_settings')->whereIn('key', ['fedapay_mode', 'fedapay_public_key', 'fedapay_secret_key'])->delete();
    }
};
