<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Service;
use App\Models\Appointment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin Provider
        $admin = User::create([
            'name' => 'Administrateur',
            'email' => 'admin@projet-rdv.com',
            'password' => Hash::make('Admin@2026!'),
            'phone' => '+229 00 00 00 00',
            'role' => 'provider',
            'email_verified_at' => now(),
        ]);

        // Create Admin Provider Profile
        \DB::table('providers')->insert([
            'user_id' => $admin->id,
            'business_name' => 'Administration',
            'description' => 'Compte administrateur principal',
            'address' => 'Cotonou',
            'city' => 'Cotonou',
            'postal_code' => '00000',
            'slug' => 'administration',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create Provider (Elsa)
        $provider = User::create([
            'name' => 'Elsa Coiffure',
            'email' => 'elsa@coiffure.com',
            'password' => Hash::make('password123'),
            'phone' => '+33 1 23 45 67 89',
            'role' => 'provider',
        ]);

        // Create Provider Profile (required for services to work)
        \DB::table('providers')->insert([
            'user_id' => $provider->id,
            'business_name' => 'Elsa Coiffure - L\'Atelier de Luxe',
            'description' => 'Excellence dans l\'art du soin capillaire afro',
            'address' => '75 Av. des Champs-Élysées',
            'city' => 'Paris',
            'postal_code' => '75008',
            'slug' => 'elsa-coiffure',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Get the provider ID from the providers table
        $providerRecord = \DB::table('providers')->where('user_id', $provider->id)->first();
        $providerId = $providerRecord->id;

        // Create Second Provider (Prestige)
        $provider2User = User::create([
            'name' => 'Elsa Coiffure - Prestige',
            'email' => 'prestige@coiffure.com',
            'password' => Hash::make('password123'),
            'phone' => '+33 1 98 76 54 32',
            'role' => 'provider',
        ]);

        // Create Second Provider Profile
        \DB::table('providers')->insert([
            'user_id' => $provider2User->id,
            'business_name' => 'Elsa Coiffure - Prestige',
            'description' => 'Services premium de haute coiffure afro',
            'address' => '75 Av. des Champs-Élysées',
            'city' => 'Paris',
            'postal_code' => '75008',
            'slug' => 'elsa-coiffure-prestige',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $provider2Record = \DB::table('providers')->where('user_id', $provider2User->id)->first();
        $provider2Id = $provider2Record->id;

        // Create Client
        $client = User::create([
            'name' => 'Kangbode Nouagnon Prince',
            'email' => 'kangbode@example.com',
            'password' => Hash::make('password123'),
            'phone' => '+33 6 12 34 56 78',
            'role' => 'client',
        ]);

        // Create Services
        $services = [
            // Traitement cheveux naturels
            [
                'name' => 'Traitement Cheveux Naturels',
                'description' => 'Soin complet incluant une analyse capillaire rapide, un nettoyage et un démêlage en profondeur des cheveux.',
                'duration' => 90,
                'price' => 2500.00,
                'provider_id' => $providerId,
                'category' => 'traitement',
            ],
            // Ressérage de locks
            [
                'name' => 'Ressérage - Moins de 100 tiges',
                'description' => 'Ressérage de locks pour moins de 100 tiges. Prix valable pour tous types de ressérage.',
                'duration' => 120,
                'price' => 5000.00,
                'provider_id' => $providerId,
                'category' => 'resserage',
            ],
            [
                'name' => 'Ressérage - Entre 100 et 150 tiges',
                'description' => 'Ressérage de locks pour 100 à 150 tiges. Prix valable pour tous types de ressérage.',
                'duration' => 180,
                'price' => 7000.00,
                'provider_id' => $providerId,
                'category' => 'resserage',
            ],
            [
                'name' => 'Ressérage - Entre 150 et 200 tiges',
                'description' => 'Ressérage de locks pour 150 à 200 tiges. Prix valable pour tous types de ressérage.',
                'duration' => 240,
                'price' => 9000.00,
                'provider_id' => $providerId,
                'category' => 'resserage',
            ],
            [
                'name' => 'Micro Locks',
                'description' => 'Ressérage micro locks. Prix valable pour tous types de ressérage.',
                'duration' => 300,
                'price' => 12000.00,
                'provider_id' => $providerId,
                'category' => 'resserage',
            ],
            // Détox et bain de locks
            [
                'name' => 'Bain de Locks Classique',
                'description' => 'Bain classique pour nettoyer et rafraîchir vos locks en douceur.',
                'duration' => 45,
                'price' => 2000.00,
                'provider_id' => $providerId,
                'category' => 'detox',
            ],
            [
                'name' => 'Détox Simple',
                'description' => 'Détoxification en profondeur de vos locks pour éliminer les impuretés.',
                'duration' => 90,
                'price' => 7000.00,
                'provider_id' => $providerId,
                'category' => 'detox',
            ],
            [
                'name' => 'Détox + Hydratation',
                'description' => 'Détoxification complète suivie d\'un soin hydratant intense pour vos locks.',
                'duration' => 120,
                'price' => 8000.00,
                'provider_id' => $providerId,
                'category' => 'detox',
            ],
            // Tresses protectrices
            [
                'name' => 'Tresses Protectrices',
                'description' => 'Réalisation de tresses protectrices. Le prix débute à partir de 1500 FCFA — à convenir avec le prestataire en fonction de votre demande (type, longueur, complexité).',
                'duration' => 120,
                'price' => 1500.00,
                'provider_id' => $providerId,
                'category' => 'tresses',
            ],
            // Départ de locks
            [
                'name' => 'Départ de Locks',
                'description' => 'Départ de locks. Le prix commence à partir de 5000 FCFA — contacter le prestataire pour un prix précis en fonction de vos besoins, nombre de tiges et type de départ.',
                'duration' => 120,
                'price' => 5000.00,
                'provider_id' => $providerId,
                'category' => 'depart',
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }

        // Dupliquer les services pour le 2e prestataire
        foreach ($services as $service) {
            $service['provider_id'] = $provider2Id;
            Service::create($service);
        }

        // Create Products
        $products = [
            [
                'name' => 'Organic Marula Growth Oil',
                'slug' => 'organic-marula-growth-oil',
                'description' => 'Huile naturelle pour la croissance des cheveux',
                'price' => 52.00,
                'category' => 'Oils & Serums',
                'hair_goal' => 'Growth',
                'stock' => 25,
            ],
            [
                'name' => 'Whipped Shea Butter Mask',
                'slug' => 'whipped-shea-butter-mask',
                'description' => 'Masque hydratant intensif au beurre de karité',
                'price' => 45.00,
                'category' => 'Masks',
                'hair_goal' => 'Hydration',
                'stock' => 18,
            ],
            [
                'name' => 'Gold-Trim Silk Bonnet',
                'slug' => 'gold-trim-silk-bonnet',
                'description' => 'Bonnet en soie premium pour la nuit',
                'price' => 75.00,
                'category' => 'Silk Accessories',
                'hair_goal' => 'Retention',
                'stock' => 12,
            ],
            [
                'name' => 'Protein Reconstructor Serum',
                'slug' => 'protein-reconstructor-serum',
                'description' => 'Sérum réparateur à base de protéines',
                'price' => 65.00,
                'category' => 'Oils & Serums',
                'hair_goal' => 'Repair',
                'stock' => 22,
            ],
            [
                'name' => 'Scalp Clarifying Shampoo',
                'slug' => 'scalp-clarifying-shampoo',
                'description' => 'Shampoing purifiant pour un cuir chevelu sain',
                'price' => 32.00,
                'category' => 'Cleansing',
                'hair_goal' => 'Scalp Health',
                'stock' => 30,
            ],
            [
                'name' => 'Silk Pillowcase Premium',
                'slug' => 'silk-pillowcase-premium',
                'description' => 'Taie d\'oreiller en soie de haute qualité',
                'price' => 58.00,
                'category' => 'Silk Accessories',
                'hair_goal' => 'Retention',
                'stock' => 15,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        // Create Appointments for Client
        $service = Service::first();
        for ($i = 0; $i < 2; $i++) {
            Appointment::create([
                'client_id' => $client->id,
                'provider_id' => $provider->id,
                'service_id' => $service->id,
                'date' => now()->addDays(5 + $i)->toDateString(),
                'start_time' => '14:00:00',
                'end_time' => '16:00:00',
                'status' => 'confirmed',
            ]);
        }
    }
}
