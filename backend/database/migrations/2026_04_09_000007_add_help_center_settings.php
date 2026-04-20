<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $defaults = [
            [
                'key' => 'help_title_fr',
                'value' => 'Comment pouvons-nous vous aider ?',
                'type' => 'text',
            ],
            [
                'key' => 'help_subtitle_fr',
                'value' => 'Retrouvez les reponses frequentes ou contactez notre equipe.',
                'type' => 'text',
            ],
            [
                'key' => 'help_title_en',
                'value' => 'How can we help?',
                'type' => 'text',
            ],
            [
                'key' => 'help_subtitle_en',
                'value' => 'Find common answers or contact our team.',
                'type' => 'text',
            ],
            [
                'key' => 'help_faqs_fr',
                'value' => json_encode([
                    [
                        'id' => 1,
                        'category' => 'Reservation',
                        'question' => 'Comment reserver un rendez-vous ?',
                        'answer' => 'Cliquez sur reservation, choisissez votre prestation puis votre date et confirmez votre rendez-vous.',
                    ],
                    [
                        'id' => 2,
                        'category' => 'Reservation',
                        'question' => 'Puis-je reporter ou annuler un rendez-vous ?',
                        'answer' => 'Oui, vous pouvez annuler votre rendez-vous depuis Mes reservations selon les conditions du salon.',
                    ],
                ], JSON_UNESCAPED_UNICODE),
                'type' => 'json',
            ],
            [
                'key' => 'help_faqs_en',
                'value' => json_encode([
                    [
                        'id' => 1,
                        'category' => 'Booking',
                        'question' => 'How do I book an appointment?',
                        'answer' => 'Click booking, select your service and date, then confirm your appointment.',
                    ],
                    [
                        'id' => 2,
                        'category' => 'Booking',
                        'question' => 'Can I reschedule or cancel an appointment?',
                        'answer' => 'Yes, you can cancel your appointment from My Appointments based on salon policy.',
                    ],
                ], JSON_UNESCAPED_UNICODE),
                'type' => 'json',
            ],
        ];

        foreach ($defaults as $setting) {
            DB::table('site_settings')->updateOrInsert(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'type' => $setting['type'],
                    'updated_at' => $now,
                    'created_at' => $now,
                ]
            );
        }
    }

    public function down(): void
    {
        DB::table('site_settings')->whereIn('key', [
            'help_title_fr',
            'help_subtitle_fr',
            'help_title_en',
            'help_subtitle_en',
            'help_faqs_fr',
            'help_faqs_en',
        ])->delete();
    }
};
