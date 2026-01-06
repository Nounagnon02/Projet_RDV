<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $provider = $request->user()->provider;
        if (!$provider) return response()->json([]);

        return response()->json($provider->services);
    }

    public function store(Request $request)
    {
        $provider = $request->user()->provider;
        if (!$provider) return response()->json(['message' => 'Provider profile required'], 403);

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
