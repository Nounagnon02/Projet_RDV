<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    /**
     * List products with filters
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Filters
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('hair_goal')) {
            $query->where('hair_goal', $request->hair_goal);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $products = $query->paginate(12);

        return response()->json($products);
    }

    /**
     * Show single product
     */
    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json(['data' => $product]);
    }

    /**
     * Get recommended products based on user profile
     */
    public function recommended(Request $request)
    {
        $user = $request->user();
        if (!$user || !$user->hairProfile) {
            // Return featured products if no profile
            $products = Product::where('is_featured', true)->take(4)->get();
            return response()->json(['data' => $products]);
        }

        $profile = $user->hairProfile;
        
        $query = Product::query();

        // Filter based on porosity (simplified logic)
        if ($profile->porosity === 'high') {
            $query->whereIn('hair_goal', ['retention', 'scalp_health']);
        } elseif ($profile->porosity === 'low') {
            $query->whereIn('hair_goal', ['hydration', 'clarifying']);
        }

        $products = $query->take(4)->get();

        return response()->json(['data' => $products]);
    }
}
