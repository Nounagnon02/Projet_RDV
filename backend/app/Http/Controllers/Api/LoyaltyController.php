<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LoyaltyAccount;
use App\Models\LoyaltyTransaction;
use App\Models\Voucher;

class LoyaltyController extends Controller
{
    /**
     * Get user's loyalty account details
     */
    public function getAccount(Request $request)
    {
        $account = $request->user()->loyaltyAccount;

        if (!$account) {
            // Create account if not exists
            $account = LoyaltyAccount::create([
                'user_id' => $request->user()->id,
                'points' => 0,
                'tier' => 'regular',
                'total_visits' => 0
            ]);
        }

        return response()->json([
            'data' => $account
        ]);
    }

    /**
     * Get transaction history
     */
    public function getTransactions(Request $request)
    {
        $account = $request->user()->loyaltyAccount;

        if (!$account) {
            return response()->json(['data' => []]);
        }

        $transactions = $account->transactions()
            ->latest()
            ->paginate(10);

        return response()->json($transactions);
    }

    /**
     * Get available vouchers
     */
    public function getVouchers(Request $request)
    {
        // Vouchers assignés à l'utilisateur OU vouchers génériques
        $vouchers = Voucher::where('is_active', true)
            ->where(function ($query) use ($request) {
                $query->where('user_id', $request->user()->id)
                      ->orWhereNull('user_id');
            })
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->whereNull('used_at')
            ->get();

        return response()->json([
            'data' => $vouchers
        ]);
    }
}
