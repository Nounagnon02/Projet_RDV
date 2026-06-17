<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepositSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'deposit_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'booking',
                'label' => 'Activer l\'acompte obligatoire',
                'description' => 'Exiger un acompte pour valider les réservations',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'deposit_percentage',
                'value' => '50',
                'type' => 'number',
                'group' => 'booking',
                'label' => 'Pourcentage d\'acompte',
                'description' => 'Pourcentage du montant total à payer en acompte (ex: 30 pour 30%)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('site_settings')->updateOrInsert(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
