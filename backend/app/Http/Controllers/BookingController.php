<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use App\Models\Service;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class BookingController extends Controller
{
    public function getProviderPublic($slug)
    {
        $provider = Provider::where('slug', $slug)->with('services')->firstOrFail();
        return response()->json($provider);
    }

    public function getServicesPublic($slug)
    {
        $provider = Provider::where('slug', $slug)->firstOrFail();
        return response()->json($provider->services()->where('is_active', true)->get());
    }

    public function getAvailableSlots(Request $request, $slug)
    {
        $provider = Provider::where('slug', $slug)->firstOrFail();
        $date = $request->query('date', Carbon::today()->toDateString());
        $serviceId = $request->query('service_id');

        $carbonDate = Carbon::parse($date);
        $dayOfWeek = $carbonDate->dayOfWeek; // 0 (Sun) to 6 (Sat)

        // Get provider availabilities for this day
        $availabilities = $provider->availabilities()
            ->where('day_of_week', $dayOfWeek)
            ->where('is_active', true)
            ->get();

        if ($availabilities->isEmpty()) {
            return response()->json([]);
        }

        // Check for closed periods
        $isClosed = $provider->closedPeriods()
            ->where('start_date', '<=', $date)
            ->where('end_date', '>=', $date)
            ->exists();

        if ($isClosed) {
            return response()->json([]);
        }

        // Get existing appointments
        $existingAppointments = $provider->appointments()
            ->where('date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->get();

        $slots = [];
        $slotDuration = $provider->settings->slot_duration ?? 30;

        foreach ($availabilities as $availability) {
            $start = Carbon::parse($date . ' ' . $availability->start_time);
            $end = Carbon::parse($date . ' ' . $availability->end_time);

            while ($start->copy()->addMinutes($slotDuration)->lte($end)) {
                $slotStart = $start->format('H:i');
                $slotEnd = $start->copy()->addMinutes($slotDuration)->format('H:i');

                // Check for conflict
                $isConflict = $existingAppointments->contains(function ($appointment) use ($slotStart, $slotEnd) {
                    return ($slotStart >= $appointment->start_time && $slotStart < $appointment->end_time) ||
                           ($slotEnd > $appointment->start_time && $slotEnd <= $appointment->end_time);
                });

                if (!$isConflict) {
                    $slots[] = $slotStart;
                }

                $start->addMinutes($slotDuration);
            }
        }

        return response()->json($slots);
    }

    public function bookAppointment(Request $request, $slug)
    {
        $provider = Provider::where('slug', $slug)->firstOrFail();

        $request->validate([
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'client_notes' => 'nullable|string',
        ]);

        $service = Service::find($request->service_id);
        $startTime = Carbon::parse($request->date . ' ' . $request->start_time);
        $endTime = $startTime->copy()->addMinutes($service->duration);

        // Basic conflict check
        $conflict = $provider->appointments()
            ->where('date', $request->date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) use ($request, $endTime) {
                $query->whereBetween('start_time', [$request->start_time, $endTime->format('H:i')])
                      ->orWhereBetween('end_time', [$request->start_time, $endTime->format('H:i')]);
            })
            ->exists();

        if ($conflict) {
            return response()->json(['message' => 'Ce créneau est déjà pris.'], 422);
        }

        $appointment = $provider->appointments()->create([
            'client_id' => $request->user()->id,
            'service_id' => $request->service_id,
            'date' => $request->date,
            'start_time' => $request->start_time,
            'end_time' => $endTime->format('H:i'),
            'status' => 'pending',
            'client_notes' => $request->client_notes,
        ]);

        return response()->json($appointment, 201);
    }

    public function myAppointments(Request $request)
    {
        return response()->json($request->user()->appointments()->with(['provider', 'service'])->get());
    }

    public function cancelAppointment(Request $request, Appointment $appointment)
    {
        if ($appointment->client_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $appointment->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Rendez-vous annulé']);
    }
}
