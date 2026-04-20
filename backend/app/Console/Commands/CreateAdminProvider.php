<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class CreateAdminProvider extends Command
{
    protected $signature = 'admin:create {email?} {password?} {name?}';
    protected $description = 'Créer un compte provider administrateur';

    public function handle()
    {
        $this->info('🔧 Création d\'un compte provider administrateur');
        $this->info('');

        $email = $this->argument('email') ?? $this->ask('Email du provider', 'admin@projet-rdv.com');
        $password = $this->argument('password') ?? $this->secret('Mot de passe (min 8 caractères)');
        $name = $this->argument('name') ?? $this->ask('Nom du provider', 'Administrateur');
        $phone = $this->ask('Téléphone', '+33 1 00 00 00 00');

        if (strlen($password) < 8) {
            $this->error('❌ Le mot de passe doit contenir au moins 8 caractères');
            return 1;
        }

        if (User::where('email', $email)->exists()) {
            $this->error('❌ Un utilisateur avec cet email existe déjà');
            return 1;
        }

        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'phone' => $phone,
                'role' => 'provider',
                'email_verified_at' => now(),
            ]);

            DB::table('providers')->insert([
                'user_id' => $user->id,
                'business_name' => $name,
                'description' => 'Compte administrateur',
                'address' => 'À définir',
                'city' => 'À définir',
                'postal_code' => '00000',
                'slug' => \Illuminate\Support\Str::slug($name . '-' . $user->id),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::commit();

            $this->info('');
            $this->info('✅ Compte provider créé avec succès!');
            $this->info('');
            $this->table(
                ['Champ', 'Valeur'],
                [
                    ['Email', $email],
                    ['Mot de passe', '********'],
                    ['Nom', $name],
                    ['Rôle', 'provider'],
                ]
            );

            return 0;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('❌ Erreur: ' . $e->getMessage());
            return 1;
        }
    }
}
