<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add email configuration settings
        DB::table('site_settings')->insert([
            ['key' => 'mail_driver', 'value' => 'smtp', 'type' => 'text', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'mail_host', 'value' => 'smtp.gmail.com', 'type' => 'text', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'mail_port', 'value' => '587', 'type' => 'number', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'mail_username', 'value' => '', 'type' => 'text', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'mail_password', 'value' => '', 'type' => 'password', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'mail_encryption', 'value' => 'tls', 'type' => 'text', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'mail_from_address', 'value' => 'noreply@elsacoiffure.com', 'type' => 'email', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'mail_from_name', 'value' => 'Elsa Coiffure', 'type' => 'text', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        DB::table('site_settings')->whereIn('key', [
            'mail_driver',
            'mail_host',
            'mail_port',
            'mail_username',
            'mail_password',
            'mail_encryption',
            'mail_from_address',
            'mail_from_name'
        ])->delete();
    }
};
