<?php

namespace App\Http\Controllers;

use App\Models\Provider;
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
}
