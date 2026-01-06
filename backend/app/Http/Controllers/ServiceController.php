<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    private function getOrCreateProvider($user)
    {
        if ($user->provider) {
            return $user->provider;
        }

        // Auto-create provider profile for users with provider role
        if ($user->role === 'provider') {
            return Provider::create([
                'user_id' => $user->id,
                'business_name' => $user->name,
                'slug' => Str::slug($user->name) . '-' . Str::random(5)
            ]);
        }

        return null;
    }

    public function index(Request $request)
    {
        $provider = $this->getOrCreateProvider($request->user());
        if (!$provider) return response()->json([]);

        return response()->json($provider->services);
    }

    public function store(Request $request)
    {
        $provider = $this->getOrCreateProvider($request->user());
        if (!$provider) return response()->json(['message' => 'Vous devez être un prestataire pour gérer des services'], 403);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'category' => 'nullable|string',
        ]);

        $service = $provider->services()->create($request->all());

        return response()->json($service, 201);
    }

    public function update(Request $request, Service $service)
    {
        if ($service->provider_id !== $request->user()->provider->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'sometimes|required|integer|min:1',
            'price' => 'sometimes|required|numeric|min:0',
            'category' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $service->update($request->all());

        return response()->json($service);
    }

    public function destroy(Request $request, Service $service)
    {
        if ($service->provider_id !== $request->user()->provider->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $service->delete();

        return response()->json(['message' => 'Service supprimé']);
    }
}
