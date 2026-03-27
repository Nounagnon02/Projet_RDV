<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProviderController extends Controller
{
    public function profile(Request $request)
    {
        $provider = $request->user()->provider;
        
        if (!$provider) {
            return response()->json(['message' => 'Profil non trouvé'], 404);
        }

        return response()->json($provider);
    }

    public function update(Request $request)
    {
        $provider = $request->user()->provider;

        if (!$provider) {
            // If doesn't exist, create it (for initial setup)
            $provider = new Provider();
            $provider->user_id = $request->user()->id;
        }

        $request->validate([
            'business_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'postal_code' => 'nullable|string',
        ]);

        $provider->business_name = $request->business_name;
        $provider->description = $request->description;
        $provider->address = $request->address;
        $provider->city = $request->city;
        $provider->postal_code = $request->postal_code;
        
        if (!$provider->slug) {
            $provider->slug = Str::slug($request->business_name) . '-' . Str::random(5);
        }

        $provider->save();

        return response()->json($provider);
    }

    public function clients(Request $request)
    {
        $provider = $request->user()->provider;
        if (!$provider) {
            return response()->json(['message' => 'Prestataire non trouvé'], 404);
        }

        $clients = User::whereHas('appointments', function ($query) use ($provider) {
            $query->where('provider_id', $provider->id);
        })
        ->with(['hairProfile', 'loyaltyAccount'])
        ->withCount(['appointments' => function ($query) use ($provider) {
            $query->where('provider_id', $provider->id);
        }])
        ->get()
        ->map(function ($client) use ($provider) {
            $lastAppointment = $client->appointments()
                ->where('provider_id', $provider->id)
                ->latest('date')
                ->first();

            return [
                'id' => $client->id,
                'name' => $client->name,
                'email' => $client->email,
                'phone' => $client->phone,
                'hairType' => $client->hairProfile->hair_type ?? 'N/A',
                'porosity' => $client->hairProfile->porosity ?? 'N/A',
                'points' => $client->loyaltyAccount->points ?? 0,
                'tier' => $client->loyaltyAccount->tier ?? 'Regular',
                'totalVisits' => $client->appointments_count,
                'lastVisit' => $lastAppointment ? $lastAppointment->date : 'N/A',
            ];
        });

        return response()->json($clients);
    }

    public function storeClient(Request $request)
    {
        $provider = $request->user()->provider;
        if (!$provider) {
            return response()->json(['message' => 'Prestataire non trouvé'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'hairType' => 'nullable|string',
            'porosity' => 'nullable|string',
        ]);

        $client = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => bcrypt(Str::random(12)), // Random password for manual creation
            'role' => 'client',
        ]);

        if ($request->filled('hairType') || $request->filled('porosity')) {
            $client->hairProfile()->create([
                'hair_type' => $request->hairType,
                'porosity' => $request->porosity,
            ]);
        }

        // Initialize loyalty account
        $client->loyaltyAccount()->create([
            'points' => 0,
            'tier' => 'Regular',
        ]);

        return response()->json([
            'message' => 'Client créé avec succès',
            'client' => $client->load(['hairProfile', 'loyaltyAccount'])
        ], 201);
    }
}
