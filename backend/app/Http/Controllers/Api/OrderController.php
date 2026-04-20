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
            'full_name' => 'required|string|max:255',
            'delivery_location' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
        ]);

        $calculatedTotal = 0;
        foreach ($request->items as $item) {
            $product = Product::findOrFail($item['product_id']);
            $calculatedTotal += ((float) $product->price * (int) $item['quantity']);
        }

        $order = Order::create([
            'user_id' => $request->user()?->id,
            'total_amount' => $calculatedTotal,
            'status' => 'pending',
            'payment_status' => 'pending',
            'full_name' => $request->full_name,
            'delivery_location' => $request->delivery_location,
            'phone' => $request->phone,
            'email' => $request->email,
            'shipping_address' => [
                'delivery_location' => $request->delivery_location,
                'phone' => $request->phone,
            ],
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
        if (!empty($request->email)) {
            try {
                Mail::to($request->email)->send(new OrderConfirmation($order));
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Erreur envoi email order: ' . $e->getMessage());
            }
        }

        return response()->json($order->load('items.product'), 201);
    }
}
