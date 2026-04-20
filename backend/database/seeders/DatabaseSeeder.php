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
        $providerId = $providerRecord->id;;

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
            [
                'name' => 'Soin Signature Hydratation',
                'description' => 'Soin d\'excellence avec marula et karité',
                'duration' => 120,
                'price' => 89.00,
                'provider_id' => $providerId,
            ],
            [
                'name' => 'Diagnostic Capacillaire Complet',
                'description' => 'Analyse complète et recommandations personnalisées',
                'duration' => 45,
                'price' => 45.00,
                'provider_id' => $providerId,
            ],
            [
                'name' => 'Traitement Réparation Intégral',
                'description' => 'Réparation profonde et reconstruction',
                'duration' => 150,
                'price' => 125.00,
                'provider_id' => $providerId,
            ],
        ];

        foreach ($services as $service) {
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
