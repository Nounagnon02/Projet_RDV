<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    private function getFedaPaySettings()
    {
        $settings = SiteSetting::whereIn('key', ['fedapay_mode', 'fedapay_public_key', 'fedapay_secret_key'])->get()->pluck('value', 'key');
        
        return [
            'mode' => $settings['fedapay_mode'] ?? env('FEDAPAY_MODE', 'sandbox'),
            'public_key' => $settings['fedapay_public_key'] ?? env('FEDAPAY_PUBLIC_KEY'),
            'secret_key' => $settings['fedapay_secret_key'] ?? env('FEDAPAY_SECRET_KEY'),
        ];
    }

    public function createPayment(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'callback_url' => 'required|url'
        ]);

        $order = Order::with('items.product')->findOrFail($request->order_id);

        if ($order->payment_status === 'paid') {
            return response()->json(['message' => 'Cette commande a déjà été payée'], 400);
        }

        $fedapay = $this->getFedaPaySettings();

        try {
            $response = Http::withBasicAuth($fedapay['secret_key'], '')
                ->post("https://{$fedapay['mode']}.fedapay.com/v1/transactions", [
                    'description' => "Commande #{$order->id}",
                    'amount' => $order->total_amount,
                    'currency' => ['iso' => 'XOF'],
                    'callback_url' => $request->callback_url,
                    'customer' => [
                        'firstname' => $order->full_name ?? $order->user?->name ?? 'Client',
                        'email' => $order->email ?? $order->user?->email,
                        'phone_number' => ['number' => $order->phone ?? $order->user?->phone, 'country' => 'bj']
                    ]
                ]);

            if ($response->successful()) {
                $transaction = $response->json();
                $payload = $transaction['v1/transaction'] ?? $transaction['transaction'] ?? null;
                $transactionId = $payload['id'] ?? null;
                $token = $payload['token'] ?? null;

                if (!$transactionId || !$token) {
                    return response()->json(['message' => 'Reponse paiement invalide'], 500);
                }

                $order->update(['fedapay_transaction_id' => $transactionId]);

                return response()->json([
                    'transaction_id' => $transactionId,
                    'token' => $token
                ]);
            }

            return response()->json(['message' => 'Erreur lors de la création du paiement'], 500);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function webhook(Request $request)
    {
        $transactionId = $request->input('id');
        $status = $request->input('status');

        $order = Order::where('fedapay_transaction_id', $transactionId)->first();

        if (!$order) {
            return response()->json(['message' => 'Commande introuvable'], 404);
        }

        if ($status === 'approved') {
            $order->update(['payment_status' => 'paid', 'status' => 'processing']);
        } elseif ($status === 'canceled' || $status === 'failed') {
            $order->update(['payment_status' => 'failed']);
        }

        return response()->json(['message' => 'Webhook traité']);
    }

    public function verifyPayment($transactionId)
    {
        $order = Order::where('fedapay_transaction_id', $transactionId)->first();

        if (!$order) {
            return response()->json(['message' => 'Commande introuvable'], 404);
        }

        $fedapay = $this->getFedaPaySettings();

        try {
            $response = Http::withBasicAuth($fedapay['secret_key'], '')
                ->get("https://{$fedapay['mode']}.fedapay.com/v1/transactions/{$transactionId}");

            if ($response->successful()) {
                $transaction = $response->json();
                $status = $transaction['v1/transaction']['status'];

                if ($status === 'approved') {
                    $order->update(['payment_status' => 'paid', 'status' => 'processing']);
                }

                return response()->json(['order' => $order, 'payment_status' => $status]);
            }

            return response()->json(['message' => 'Erreur lors de la vérification'], 500);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function getPublicKey()
    {
        $fedapay = $this->getFedaPaySettings();
        return response()->json(['public_key' => $fedapay['public_key'], 'mode' => $fedapay['mode']]);
    }
}
