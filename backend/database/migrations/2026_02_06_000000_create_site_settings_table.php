<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('text');
            $table->timestamps();
        });

        // Insert default values
        DB::table('site_settings')->insert([
            ['key' => 'site_name', 'value' => 'Elsa Coiffure', 'type' => 'text', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'contact_email', 'value' => 'concierge@elsacoiffure.com', 'type' => 'email', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'contact_phone', 'value' => '+229 01 23 45 67 89', 'type' => 'text', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'contact_address', 'value' => '75 Rue. derrière stade de l\'amitié , Cotonou', 'type' => 'text', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'social_instagram', 'value' => 'https://instagram.com/elsacoiffure', 'type' => 'url', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'social_facebook', 'value' => 'https://facebook.com/elsacoiffure', 'type' => 'url', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'social_youtube', 'value' => 'https://youtube.com/@elsacoiffure', 'type' => 'url', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'footer_description', 'value' => 'Élever les standards du soin capillaire Afro à travers une expérience de luxe et une excellence artistique depuis plus d\'une décennie.', 'type' => 'textarea', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
