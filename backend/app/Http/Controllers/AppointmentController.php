<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $provider = $request->user()->provider;
        if (!$provider) return response()->json([]);

        return response()->json($provider->appointments()->with(['client', 'service'])->get());
    }

    public function update(Request $request, Appointment $appointment)
    {
        if ($appointment->provider_id !== $request->user()->provider->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
            'provider_notes' => 'nullable|string',
        ]);

        $appointment->update($request->only('status', 'provider_notes'));

        return response()->json($appointment);
    }

    // Manual appointment creation by provider
    public function store(Request $request)
    {
        $provider = $request->user()->provider;
        if (!$provider) return response()->json(['message' => 'Provider profile required'], 403);

        $request->validate([
            'service_id' => 'required|exists:services,id',
            'client_id' => 'nullable|exists:users,id',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'client_notes' => 'nullable|string',
            'provider_notes' => 'nullable|string',
        ]);

        $appointment = $provider->appointments()->create($request->all());

        return response()->json($appointment, 201);
    }
}
