<?php

namespace App\Http\Controllers;

use App\Models\Availability;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AvailabilityController extends Controller
{
    private function getOrCreateProvider($user)
    {
        if ($user->provider) {
            return $user->provider;
        }

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

        return response()->json($provider->availabilities);
    }

    public function store(Request $request)
    {
        $provider = $this->getOrCreateProvider($request->user());
        if (!$provider) return response()->json(['message' => 'Vous devez être un prestataire pour gérer vos disponibilités'], 403);

        $request->validate([
            'availabilities' => 'required|array',
            'availabilities.*.day_of_week' => 'required|integer|min:0|max:6',
            'availabilities.*.start_time' => 'required|string',
            'availabilities.*.end_time' => 'required|string',
            'availabilities.*.is_active' => 'sometimes|boolean',
        ]);

        // Simple approach: delete all and recreate for simplicity in managing weekly schedule
        $provider->availabilities()->delete();

        foreach ($request->availabilities as $avail) {
            // Normalize time format to H:i:s
            $startTime = \Carbon\Carbon::parse($avail['start_time'])->format('H:i:s');
            $endTime = \Carbon\Carbon::parse($avail['end_time'])->format('H:i:s');
            
            $provider->availabilities()->create([
                'day_of_week' => $avail['day_of_week'],
                'start_time' => $startTime,
                'end_time' => $endTime,
                'is_active' => $avail['is_active'] ?? true,
            ]);
        }

        return response()->json($provider->availabilities()->get(), 201);
    }

    public function getOpeningHours()
    {
        $provider = Provider::first();
        if (!$provider) {
            return response()->json([
                'monday_friday' => '09:00 — 19:00',
                'saturday' => '10:00 — 18:00',
                'sunday' => 'Fermé'
            ]);
        }

        $availabilities = $provider->availabilities()->where('is_active', true)->get();
        
        $weekDays = [1, 2, 3, 4, 5];
        $mondayFriday = $availabilities->whereIn('day_of_week', $weekDays)->first();
        $saturday = $availabilities->where('day_of_week', 6)->first();
        $sunday = $availabilities->where('day_of_week', 0)->first();

        return response()->json([
            'monday_friday' => $mondayFriday ? substr($mondayFriday->start_time, 0, 5) . ' — ' . substr($mondayFriday->end_time, 0, 5) : '09:00 — 19:00',
            'saturday' => $saturday ? substr($saturday->start_time, 0, 5) . ' — ' . substr($saturday->end_time, 0, 5) : '10:00 — 18:00',
            'sunday' => $sunday ? substr($sunday->start_time, 0, 5) . ' — ' . substr($sunday->end_time, 0, 5) : 'Fermé'
        ]);
    }
}
