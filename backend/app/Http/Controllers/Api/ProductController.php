<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

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

    /**
     * Store a new product
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category' => 'nullable|string',
            'hair_goal' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:20480',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . Str::random(5),
            'price' => $request->price,
            'stock' => $request->stock,
            'category' => $request->category,
            'hair_goal' => $request->hair_goal,
            'description' => $request->description,
            'is_featured' => $request->boolean('is_featured', false),
            'images' => $imagePath ? [$imagePath] : null,
        ]);

        return response()->json($product, 201);
    }

    /**
     * Update product
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:20480',
        ]);

        $data = $request->except('image');
        if ($request->has('name')) {
            $data['slug'] = Str::slug($request->name) . '-' . Str::random(5);
        }

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->images && count($product->images) > 0) {
                Storage::disk('public')->delete($product->images[0]);
            }
            $imagePath = $request->file('image')->store('products', 'public');
            $data['images'] = [$imagePath];
        }

        $product->update($data);

        return response()->json($product);
    }

    /**
     * Delete product
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Produit supprimé']);
    }
}
