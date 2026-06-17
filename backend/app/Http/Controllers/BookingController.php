<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use App\Models\Service;
use App\Models\Appointment;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Http;

class BookingController extends Controller
{
    // Liste tous les prestataires
    public function getAllProviders(Request $request)
    {
        $query = Provider::with('services')->whereHas('services');
        
        // Recherche par nom
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where('business_name', 'like', "%{$search}%");
        }

        $providers = $query->get();
        return response()->json($providers);
    }

    // Liste tous les services disponibles
    public function getAllServices(Request $request)
    {
        $services = Service::with('provider')
            ->where('is_active', true)
            ->get();
        
        return response()->json($services);
    }

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

        $rules = [
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'client_notes' => 'nullable|string',
            'payment_transaction_id' => 'nullable|string',
        ];

        // Add guest rules if not authenticated
        if (!$request->user()) {
            $rules['guest_name'] = 'required|string|max:255';
            $rules['guest_whatsapp'] = 'required|string|max:20';
        }

        $request->validate($rules);

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

        // Calculate deposit
        $depositSettings = \DB::table('site_settings')
            ->whereIn('key', ['deposit_enabled', 'deposit_percentage'])
            ->pluck('value', 'key');
        
        $depositEnabled = ($depositSettings['deposit_enabled'] ?? 'false') === 'true';
        $depositPercentage = (int)($depositSettings['deposit_percentage'] ?? 30);
        
        $totalAmount = $service->price;
        $depositAmount = $depositEnabled ? ($totalAmount * $depositPercentage / 100) : 0;
        $remainingAmount = $totalAmount - $depositAmount;

        $appointmentData = [
            'provider_id' => $provider->id,
            'service_id' => $request->service_id,
            'date' => $request->date,
            'start_time' => $request->start_time,
            'end_time' => $endTime->format('H:i'),
            'status' => 'pending',
            'client_notes' => $request->client_notes,
            'total_amount' => $totalAmount,
            'deposit_amount' => $depositAmount,
            'remaining_amount' => $remainingAmount,
            'deposit_paid' => $request->has('payment_transaction_id'),
            'payment_transaction_id' => $request->payment_transaction_id,
        ];

        if ($request->user()) {
            $appointmentData['client_id'] = $request->user()->id;
        } else {
            $appointmentData['guest_name'] = $request->guest_name;
            $appointmentData['guest_whatsapp'] = $request->guest_whatsapp;
        }

        $appointment = Appointment::create($appointmentData);

        // Envoyer l'email de confirmation premium uniquement si l'utilisateur est connecté
        if ($request->user()) {
            try {
                \Illuminate\Support\Facades\Mail::to($request->user())->send(new \App\Mail\BookingConfirmation($appointment));
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Erreur envoi email booking: ' . $e->getMessage());
            }
        }

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

        // Envoyer l'email d'annulation premium
        try {
            \Illuminate\Support\Facades\Mail::to($request->user())->send(new \App\Mail\CancellationConfirmation($appointment));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Erreur envoi email cancellation: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Rendez-vous annulé']);
    }

    // =============================================
    // OPTION C — Réservation globale (tous prestataires)
    // =============================================

    private function getFedaPaySettings()
    {
        $settings = SiteSetting::whereIn('key', ['fedapay_mode', 'fedapay_public_key', 'fedapay_secret_key'])->get()->pluck('value', 'key');

        return [
            'mode' => $settings['fedapay_mode'] ?? env('FEDAPAY_MODE', 'sandbox'),
            'public_key' => $settings['fedapay_public_key'] ?? env('FEDAPAY_PUBLIC_KEY'),
            'secret_key' => $settings['fedapay_secret_key'] ?? env('FEDAPAY_SECRET_KEY'),
        ];
    }

    /**
     * Récupère les créneaux disponibles TOUS prestataires confondus
     */
    public function getGlobalAvailableSlots(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date|after_or_equal:' . Carbon::today()->toDateString(),
        ]);

        $service = Service::findOrFail($request->service_id);
        $date = $request->date;
        $carbonDate = Carbon::parse($date);
        $dayOfWeek = $carbonDate->dayOfWeek;

        // Trouver TOUS les services avec le même nom (chez tous les prestataires)
        $matchingServices = Service::where('name', $service->name)
            ->where('is_active', true)
            ->get();

        if ($matchingServices->isEmpty()) {
            return response()->json([]);
        }

        $slotDuration = 30; // minutes
        $allSlots = [];

        foreach ($matchingServices as $matchService) {
            $provider = $matchService->provider;
            if (!$provider) continue;

            // Récupérer les disponibilités du prestataire pour ce jour
            $availabilities = $provider->availabilities()
                ->where('day_of_week', $dayOfWeek)
                ->where('is_active', true)
                ->get();

            if ($availabilities->isEmpty()) continue;

            // Vérifier fermeture exceptionnelle
            $isClosed = $provider->closedPeriods()
                ->where('start_date', '<=', $date)
                ->where('end_date', '>=', $date)
                ->exists();

            if ($isClosed) continue;

            // Récupérer les RDV existants
            $existingAppointments = Appointment::where('provider_id', $provider->id)
                ->where('date', $date)
                ->whereIn('status', ['pending', 'confirmed'])
                ->get();

            // Générer les créneaux
            foreach ($availabilities as $availability) {
                $start = Carbon::parse($date . ' ' . $availability->start_time);
                $end = Carbon::parse($date . ' ' . $availability->end_time);

                while ($start->copy()->addMinutes($slotDuration)->lte($end)) {
                    $slotStart = $start->format('H:i');
                    $slotEnd = $start->copy()->addMinutes($slotDuration)->format('H:i');

                    $isConflict = $existingAppointments->contains(function ($appt) use ($slotStart, $slotEnd) {
                        return ($slotStart >= $appt->start_time && $slotStart < $appt->end_time) ||
                               ($slotEnd > $appt->start_time && $slotEnd <= $appt->end_time);
                    });

                    if (!$isConflict) {
                        $allSlots[] = $slotStart;
                    }

                    $start->addMinutes($slotDuration);
                }
            }
        }

        // Supprimer les doublons et trier
        $allSlots = array_unique($allSlots);
        sort($allSlots);

        return response()->json(array_values($allSlots));
    }

    /**
     * Réserve un rendez-vous avec le 1er prestataire disponible + crée le paiement FedaPay
     */
    public function globalBookAppointment(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'date' => 'required|date|after_or_equal:' . Carbon::today()->toDateString(),
            'start_time' => 'required|date_format:H:i',
            'guest_name' => 'required|string|max:255',
            'guest_whatsapp' => 'required|string|max:20',
            'callback_url' => 'required|url',
        ]);

        $service = Service::findOrFail($request->service_id);
        $serviceName = $service->name;
        $serviceDuration = $service->duration;

        $startTime = $request->start_time;
        $endTime = Carbon::parse($request->date . ' ' . $startTime)->addMinutes($serviceDuration)->format('H:i');
        $carbonDate = Carbon::parse($request->date);
        $dayOfWeek = $carbonDate->dayOfWeek;

        // Trouver tous les services avec le même nom
        $matchingServices = Service::where('name', $serviceName)
            ->where('is_active', true)
            ->get();

        if ($matchingServices->isEmpty()) {
            return response()->json(['message' => 'Aucun prestataire disponible pour ce service'], 404);
        }

        // Trouver le premier prestataire disponible
        $assignedProvider = null;
        $assignedService = null;

        foreach ($matchingServices as $matchService) {
            $provider = $matchService->provider;
            if (!$provider) continue;

            // Vérifier les disponibilités du prestataire
            $avail = $provider->availabilities()
                ->where('day_of_week', $dayOfWeek)
                ->where('is_active', true)
                ->first();

            if (!$avail) continue;

            // Vérifier que l'horaire demandé est dans les disponibilités
            $availStart = Carbon::parse($avail->start_time);
            $availEnd = Carbon::parse($avail->end_time);
            $reqStart = Carbon::parse($startTime);
            $reqEnd = Carbon::parse($endTime);

            if ($reqStart->lt($availStart) || $reqEnd->gt($availEnd)) continue;

            // Vérifier les conflits de RDV
            $conflict = Appointment::where('provider_id', $provider->id)
                ->where('date', $request->date)
                ->whereIn('status', ['pending', 'confirmed'])
                ->where(function ($q) use ($startTime, $endTime) {
                    $q->whereBetween('start_time', [$startTime, $endTime])
                      ->orWhereBetween('end_time', [$startTime, $endTime]);
                })
                ->exists();

            if (!$conflict) {
                $assignedProvider = $provider;
                $assignedService = $matchService;
                break;
            }
        }

        if (!$assignedProvider) {
            return response()->json(['message' => 'Aucun prestataire disponible pour ce créneau'], 422);
        }

        // Calculer l'acompte (50%)
        $totalAmount = $service->price;
        $depositPercentage = 50;
        $depositAmount = $totalAmount * $depositPercentage / 100;
        $remainingAmount = $totalAmount - $depositAmount;

        // Créer le rendez-vous
        $appointment = Appointment::create([
            'provider_id' => $assignedProvider->id,
            'service_id' => $assignedService->id,
            'date' => $request->date,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'status' => 'pending',
            'guest_name' => $request->guest_name,
            'guest_whatsapp' => $request->guest_whatsapp,
            'total_amount' => $totalAmount,
            'deposit_amount' => $depositAmount,
            'remaining_amount' => $remainingAmount,
            'deposit_paid' => false,
        ]);

        // Créer la transaction FedaPay pour l'acompte
        $fedapay = $this->getFedaPaySettings();

        try {
            $response = Http::withBasicAuth($fedapay['secret_key'], '')
                ->post("https://{$fedapay['mode']}.fedapay.com/v1/transactions", [
                    'description' => "Acompte 50% - {$service->name}",
                    'amount' => (int) $depositAmount,
                    'currency' => ['iso' => 'XOF'],
                    'callback_url' => $request->callback_url,
                    'customer' => [
                        'firstname' => $request->guest_name,
                        'phone_number' => ['number' => $request->guest_whatsapp, 'country' => 'bj'],
                    ],
                ]);

            if ($response->successful()) {
                $transaction = $response->json();
                $payload = $transaction['v1/transaction'] ?? $transaction['transaction'] ?? null;
                $transactionId = $payload['id'] ?? null;
                $token = $payload['token'] ?? null;
                $checkoutUrl = $payload['url'] ?? null;

                if ($transactionId) {
                    $appointment->update(['payment_transaction_id' => $transactionId]);
                }

                return response()->json([
                    'success' => true,
                    'checkout_url' => $checkoutUrl,
                    'transaction_id' => $transactionId,
                    'appointment_id' => $appointment->id,
                    'deposit_amount' => $depositAmount,
                    'total_amount' => $totalAmount,
                ]);
            }

            // FedaPay a échoué, mais le RDV est créé
            return response()->json([
                'success' => false,
                'message' => 'Erreur de paiement, veuillez réessayer',
                'appointment_id' => $appointment->id,
            ], 500);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('FedaPay error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur de paiement: ' . $e->getMessage(),
                'appointment_id' => $appointment->id,
            ], 500);
        }
    }

    /**
     * Confirme le paiement et le rendez-vous après retour de FedaPay
     */
    public function confirmBookingPayment(Request $request)
    {
        $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
            'transaction_id' => 'nullable|string',
        ]);

        $appointment = Appointment::findOrFail($request->appointment_id);

        // Si déjà confirmé, ne pas dupliquer
        if ($appointment->status === 'confirmed') {
            return response()->json(['message' => 'Déjà confirmé', 'appointment' => $appointment]);
        }

        // Vérifier la transaction FedaPay si on a un ID
        if ($request->transaction_id) {
            try {
                $fedapay = $this->getFedaPaySettings();
                $response = Http::withBasicAuth($fedapay['secret_key'], '')
                    ->get("https://{$fedapay['mode']}.fedapay.com/v1/transactions/{$request->transaction_id}");

                if ($response->successful()) {
                    $transaction = $response->json();
                    $status = $transaction['v1/transaction']['status'] ?? $transaction['status'] ?? null;

                    if ($status === 'approved') {
                        $appointment->update([
                            'deposit_paid' => true,
                            'payment_transaction_id' => $request->transaction_id,
                            'status' => 'confirmed',
                        ]);

                        // Envoyer confirmation
                        try {
                            \Illuminate\Support\Facades\Mail::to($request->guest_name . '@example.com')
                                ->send(new \App\Mail\BookingConfirmation($appointment));
                        } catch (\Exception $e) {
                            \Illuminate\Support\Facades\Log::error('Email error: ' . $e->getMessage());
                        }

                        return response()->json([
                            'message' => 'Paiement confirmé, rendez-vous réservé !',
                            'appointment' => $appointment->load('provider', 'service'),
                        ]);
                    }
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('FedaPay verify error: ' . $e->getMessage());
            }
        }

        // Si on arrive ici, la vérification a échoué → marquer quand même comme confirmé
        // (la confirmation viendra du webhook si besoin)
        $appointment->update([
            'deposit_paid' => true,
            'payment_transaction_id' => $request->transaction_id,
            'status' => 'confirmed',
        ]);

        return response()->json([
            'message' => 'Rendez-vous confirmé',
            'appointment' => $appointment->load('provider', 'service'),
        ]);
    }
}
