<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Consultation;
use App\Models\HairProfile;
use App\Models\Product;

class ConsultationController extends Controller
{
    /**
     * Store new consultation
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'porosity_result' => 'required|string',
            'curl_pattern_result' => 'nullable|string',
            'photos' => 'nullable|array',
        ]);

        // Create consultation
        $consultation = Consultation::create([
            'user_id' => $request->user()->id,
            'porosity_result' => $validated['porosity_result'],
            'curl_pattern_result' => $validated['curl_pattern_result'] ?? null,
            'photos' => $validated['photos'] ?? [],
            'status' => 'completed'
        ]);

        // Update user hair profile
        HairProfile::updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'porosity' => $validated['porosity_result'],
                'hair_type' => $validated['curl_pattern_result'] ?? 'unknown',
                'last_consultation_date' => now()
            ]
        );

        // Generate recommendations (Simulation pour l'instant)
        // Dans une version plus avancée, cela utiliserait un service dédié
        $recommendations = $this->generateRecommendations($consultation);
        $consultation->recommended_products = $recommendations;
        $consultation->save();

        return response()->json([
            'data' => $consultation,
            'message' => 'Consultation completed successfully'
        ]);
    }

    /**
     * Show consultation details
     */
    public function show($id, Request $request)
    {
        $consultation = Consultation::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json(['data' => $consultation]);
    }

    /**
     * Get recommendations for consultation
     */
    public function recommendations($id, Request $request)
    {
        $consultation = Consultation::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $products = Product::whereIn('id', $consultation->recommended_products ?? [])->get();

        return response()->json(['data' => $products]);
    }

    /**
     * Helper to generate simulated recommendations
     */
    private function generateRecommendations(Consultation $consultation)
    {
        $goal = 'hydration'; // Default goal
        if ($consultation->porosity_result === 'high') $goal = 'retention';
        if ($consultation->porosity_result === 'low') $goal = 'hydration';

        // Find matching products (limit 3)
        // Note: Assumes Product model has scope or we filter manually
        // Since we didn't migrate old products table fully, we might need adjustments here
        // For now returning simulated IDs
        return [1, 2, 3]; 
    }
}
