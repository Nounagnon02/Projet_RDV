<?php

namespace App\Http\Controllers;

use App\Models\Availability;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function index(Request $request)
    {
        $provider = $request->user()->provider;
        if (!$provider) return response()->json([]);

        return response()->json($provider->availabilities);
    }

    public function store(Request $request)
    {
        $provider = $request->user()->provider;
        if (!$provider) return response()->json(['message' => 'Provider profile required'], 403);

        $request->validate([
            'availabilities' => 'required|array',
            'availabilities.*.day_of_week' => 'required|integer|min:0|max:6',
            'availabilities.*.start_time' => 'required|date_format:H:i',
            'availabilities.*.end_time' => 'required|date_format:H:i|after:availabilities.*.start_time',
            'availabilities.*.is_active' => 'sometimes|boolean',
        ]);

        // Simple approach: delete all and recreate for simplicity in managing weekly schedule
        $provider->availabilities()->delete();

        foreach ($request->availabilities as $avail) {
            $provider->availabilities()->create($avail);
        }

        return response()->json($provider->availabilities, 201);
    }
}
