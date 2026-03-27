<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add geographic coordinates settings
        DB::table('site_settings')->insert([
            ['key' => 'location_latitude', 'value' => '6.3703', 'type' => 'number', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'location_longitude', 'value' => '2.3912', 'type' => 'number', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        DB::table('site_settings')->whereIn('key', ['location_latitude', 'location_longitude'])->delete();
    }
};
