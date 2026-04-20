<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class SiteSettingController extends Controller
{
    private function defaultFaqs(string $lang): array
    {
        if ($lang === 'en') {
            return [
                [
                    'id' => 1,
                    'category' => 'Booking',
                    'question' => 'How do I book an appointment?',
                    'answer' => 'Click booking, select your service and date, then confirm your appointment.'
                ],
                [
                    'id' => 2,
                    'category' => 'Booking',
                    'question' => 'Can I reschedule or cancel an appointment?',
                    'answer' => 'Yes, you can cancel your appointment from My Appointments based on salon policy.'
                ],
                [
                    'id' => 3,
                    'category' => 'Shop',
                    'question' => 'How does product delivery work?',
                    'answer' => 'Orders are processed and shipped depending on product availability.'
                ],
                [
                    'id' => 4,
                    'category' => 'Shop',
                    'question' => 'Do you offer returns or refunds?',
                    'answer' => 'Returns are reviewed according to salon policy and product condition.'
                ],
                [
                    'id' => 5,
                    'category' => 'Rewards',
                    'question' => 'How do I earn loyalty points?',
                    'answer' => 'You earn points based on purchases and services. Check the loyalty page for details.'
                ],
                [
                    'id' => 6,
                    'category' => 'Account',
                    'question' => 'How can I update my profile information?',
                    'answer' => 'Open the Settings page to view your account information.'
                ],
            ];
        }

        return [
            [
                'id' => 1,
                'category' => 'Reservation',
                'question' => 'Comment reserver un rendez-vous ?',
                'answer' => 'Cliquez sur reservation, choisissez votre prestation puis votre date et confirmez votre rendez-vous.'
            ],
            [
                'id' => 2,
                'category' => 'Reservation',
                'question' => 'Puis-je reporter ou annuler un rendez-vous ?',
                'answer' => 'Oui, vous pouvez annuler votre rendez-vous depuis Mes reservations selon les conditions du salon.'
            ],
            [
                'id' => 3,
                'category' => 'Boutique',
                'question' => 'Comment fonctionne la livraison des produits ?',
                'answer' => 'Les commandes sont traitees puis expediees suivant la disponibilite des produits.'
            ],
            [
                'id' => 4,
                'category' => 'Boutique',
                'question' => 'Y a-t-il des retours ou remboursements ?',
                'answer' => 'Les retours sont etudies selon la politique du salon et l etat du produit.'
            ],
            [
                'id' => 5,
                'category' => 'Fidelite',
                'question' => 'Comment gagner des points de fidelite ?',
                'answer' => 'Vous gagnez des points selon vos achats et prestations. Consultez la page fidelite pour le detail.'
            ],
            [
                'id' => 6,
                'category' => 'Compte',
                'question' => 'Comment modifier mes informations de profil ?',
                'answer' => 'Ouvrez la page Parametres pour consulter vos informations de compte.'
            ],
        ];
    }

    /**
     * Get all site settings (public)
     */
    public function index()
    {
        $settings = SiteSetting::getAll();
        return response()->json($settings);
    }

    /**
     * Get structured help center content from DB settings
     */
    public function helpCenterContent(Request $request)
    {
        $lang = $request->query('lang', 'fr') === 'en' ? 'en' : 'fr';
        $settings = SiteSetting::getAll();

        $faqKey = $lang === 'en' ? 'help_faqs_en' : 'help_faqs_fr';
        $faqRaw = $settings[$faqKey] ?? null;

        $faqs = $this->defaultFaqs($lang);
        if (!empty($faqRaw)) {
            try {
                $decoded = json_decode($faqRaw, true, 512, JSON_THROW_ON_ERROR);
                if (is_array($decoded)) {
                    $faqs = $decoded;
                }
            } catch (\Throwable $exception) {
                Log::warning('Invalid help FAQ JSON in site_settings', [
                    'key' => $faqKey,
                    'message' => $exception->getMessage(),
                ]);
            }
        }

        return response()->json([
            'title' => $lang === 'en'
                ? ($settings['help_title_en'] ?? 'How can we help?')
                : ($settings['help_title_fr'] ?? 'Comment pouvons-nous vous aider ?'),
            'subtitle' => $lang === 'en'
                ? ($settings['help_subtitle_en'] ?? 'Find common answers or contact our team.')
                : ($settings['help_subtitle_fr'] ?? 'Retrouvez les reponses frequentes ou contactez notre equipe.'),
            'contact' => [
                'phone' => $settings['contact_phone'] ?? null,
                'email' => $settings['contact_email'] ?? null,
                'address' => $settings['contact_address'] ?? null,
            ],
            'faqs' => $faqs,
        ]);
    }

    /**
     * Get all settings with metadata (admin only)
     */
    public function adminIndex()
    {
        $settings = SiteSetting::all();
        return response()->json($settings);
    }

    /**
     * Update multiple settings at once
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
            'settings.*.type' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        foreach ($request->settings as $setting) {
            SiteSetting::set(
                $setting['key'],
                $setting['value'] ?? '',
                $setting['type'] ?? 'text'
            );
        }

        return response()->json([
            'message' => 'Paramètres mis à jour avec succès',
            'settings' => SiteSetting::getAll()
        ]);
    }

    /**
     * Update a single setting
     */
    public function updateSingle(Request $request, $key)
    {
        $validator = Validator::make($request->all(), [
            'value' => 'required',
            'type' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $setting = SiteSetting::set(
            $key,
            $request->value,
            $request->type ?? 'text'
        );

        return response()->json([
            'message' => 'Paramètre mis à jour',
            'setting' => $setting
        ]);
    }
}
