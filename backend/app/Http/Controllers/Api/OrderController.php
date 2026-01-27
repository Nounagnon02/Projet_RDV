<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmation;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->orders()->with('items.product')->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|array',
            'total' => 'required|numeric',
        ]);

        $order = $request->user()->orders()->create([
            'total' => $request->total,
            'status' => 'paid', // Simulating successful payment
            'shipping_address' => json_encode($request->shipping_address),
        ]);

        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            $order->items()->create([
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $product->price,
            ]);

            // Simple stock reduction
            $product->decrement('stock', $item['quantity']);
        }

        // Send premium order confirmation email
        try {
            Mail::to($request->user())->send(new OrderConfirmation($order));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Erreur envoi email order: ' . $e->getMessage());
        }

        return response()->json($order->load('items.product'), 201);
    }
}
