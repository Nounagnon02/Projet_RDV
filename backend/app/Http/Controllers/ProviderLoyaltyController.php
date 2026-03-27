<?php

namespace App\Http\Controllers;

use App\Models\LoyaltyAccount;
use App\Models\LoyaltyTransaction;
use App\Models\Voucher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProviderLoyaltyController extends Controller
{
    /**
     * Get loyalty statistics for the provider
     */
    public function getStats(Request $request)
    {
        $provider = $request->user()->provider;
        if (!$provider) {
            return response()->json(['message' => 'Prestataire non trouvé'], 404);
        }

        // Clients who have appointments with this provider
        $clientIds = User::whereHas('appointments', function ($query) use ($provider) {
            $query->where('provider_id', $provider->id);
        })->pluck('id');

        $totalClients = count($clientIds);
        
        if ($totalClients === 0) {
            return response()->json([
                'engagementRate' => 0,
                'vipClients' => 0,
                'totalPoints' => 0,
                'pointsExpiring' => 0
            ]);
        }

        $vipClients = LoyaltyAccount::whereIn('user_id', $clientIds)
            ->whereIn('tier', ['gold', 'platinum'])
            ->count();

        $totalPoints = LoyaltyTransaction::whereIn('loyalty_account_id', function($query) use ($clientIds) {
            $query->select('id')->from('loyalty_accounts')->whereIn('user_id', $clientIds);
        })->where('type', 'earned')->sum('points');

        // Simple engagement rate logic: clients with more than 2 visits
        $engagedClients = LoyaltyAccount::whereIn('user_id', $clientIds)
            ->where('total_visits', '>', 2)
            ->count();
        
        $engagementRate = ($engagedClients / $totalClients) * 100;

        return response()->json([
            'engagementRate' => round($engagementRate, 1),
            'vipClients' => $vipClients,
            'totalPoints' => number_format($totalPoints / 1000, 1) . 'k',
            'pointsExpiring' => '0.5k' // Placeholder for now as we don't have expiration logic yet
        ]);
    }

    /**
     * Get active offers (generic vouchers)
     */
    public function getOffers(Request $request)
    {
        $offers = Voucher::whereNull('user_id')
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->get();

        return response()->json($offers->map(function ($offer) {
            return [
                'id' => $offer->id,
                'title' => 'Coupon ' . $offer->code,
                'status' => 'Active',
                'type' => $offer->discount_type === 'percentage' ? 'Promotion' : 'Récompense',
                'discount' => $offer->discount_type === 'percentage' ? $offer->discount_value . '%' : $offer->discount_value . '€',
                'validUntil' => $offer->expires_at ? $offer->expires_at->format('Y-m-d') : 'Permanent',
                'reach' => 0 // Would need order history to calculate actual reach
            ];
        }));
    }

    /**
     * Create a new offer
     */
    public function storeOffer(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:vouchers,code',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'expires_at' => 'nullable|date|after:today',
        ]);

        $voucher = Voucher::create([
                'code' => strtoupper($request->code),
                'discount_type' => $request->discount_type,
                'discount_value' => $request->discount_value,
                'is_active' => true,
                'expires_at' => $request->expires_at,
        ]);

        return response()->json($voucher, 201);
    }

    /**
     * Add bonus points to a specific client
     */
    public function addBonusPoints(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:users,id',
            'points' => 'required|integer|min:1',
            'description' => 'required|string|max:255',
        ]);

        $account = LoyaltyAccount::firstOrCreate(
            ['user_id' => $request->client_id],
            ['points' => 0, 'tier' => 'regular', 'total_visits' => 0]
        );

        $account->addPoints($request->points, $request->description);

        return response()->json(['message' => 'Points ajoutés avec succès', 'new_balance' => $account->points]);
    }
}
