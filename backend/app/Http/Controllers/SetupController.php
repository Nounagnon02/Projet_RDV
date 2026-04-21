<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Service;
use App\Models\Product;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class SetupController extends Controller
{
    /**
     * Diagnostic de la base de données
     */
    public function diagnostic()
    {
        try {
            $data = [
                'status' => 'success',
                'database' => [
                    'users' => User::count(),
                    'services' => Service::count(),
                    'products' => Product::count(),
                    'appointments' => Appointment::count(),
                ],
                'admin_exists' => User::where('email', 'admin@projet-rdv.com')->exists(),
                'users_list' => User::all(['id', 'name', 'email', 'role'])->toArray(),
            ];

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Exécuter les seeders
     */
    public function runSeeders(Request $request)
    {
        // Sécurité: vérifier un token secret
        $secret = $request->input('secret');
        if ($secret !== env('SETUP_SECRET', 'setup-secret-2026')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        try {
            Artisan::call('db:seed', ['--force' => true]);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Seeders exécutés avec succès',
                'output' => Artisan::output(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Réinitialiser complètement la base
     */
    public function freshMigrate(Request $request)
    {
        // Sécurité: vérifier un token secret
        $secret = $request->input('secret');
        if ($secret !== env('SETUP_SECRET', 'setup-secret-2026')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        try {
            Artisan::call('migrate:fresh', ['--seed' => true, '--force' => true]);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Base de données réinitialisée avec succès',
                'output' => Artisan::output(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Créer le compte admin manuellement
     */
    public function createAdmin(Request $request)
    {
        // Sécurité: vérifier un token secret
        $secret = $request->input('secret');
        if ($secret !== env('SETUP_SECRET', 'setup-secret-2026')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        try {
            // Vérifier si admin existe déjà
            if (User::where('email', 'admin@projet-rdv.com')->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Le compte admin existe déjà',
                ], 400);
            }

            DB::beginTransaction();

            $admin = User::create([
                'name' => 'Administrateur',
                'email' => 'admin@projet-rdv.com',
                'password' => Hash::make('Admin@2026!'),
                'phone' => '+229 00 00 00 00',
                'role' => 'provider',
                'email_verified_at' => now(),
            ]);

            DB::table('providers')->insert([
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

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Compte admin créé avec succès',
                'admin' => [
                    'id' => $admin->id,
                    'email' => $admin->email,
                    'name' => $admin->name,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
