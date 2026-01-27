<?php

namespace App\Http\Controllers;

use App\Models\DaftarKeinginan;
use App\Models\VarianProduk;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Display wishlist page
     */
    public function index()
    {
        $user = auth()->user();
        
        $items = DaftarKeinginan::with(['varianProduk.produk.kategori', 'varianProduk.gambarProduks'])
            ->where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(function ($item) {
                $varian = $item->varianProduk;
                return [
                    'id' => $item->id,
                    'varian_produk_id' => $varian->id,
                    'name' => $varian->produk->nama_produk . ' - ' . $varian->nama_varian,
                    'price' => $varian->harga,
                    'stock' => $varian->stok,
                    'image' => $varian->gambarProduks->first()?->gambar_produk 
                        ? asset('storage/' . $varian->gambarProduks->first()->gambar_produk)
                        : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
                    'category' => $varian->produk->kategori->nama_kategori ?? 'Uncategorized',
                    'created_at' => $item->created_at->format('d M Y'),
                ];
            });
        
        return Inertia::render('Wishlist', [
            'items' => $items,
            'totalItems' => $items->count(),
        ]);
    }

    /**
     * Toggle wishlist (add or remove)
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'varian_produk_id' => 'required|exists:varian_produk,id',
        ]);

        $user = auth()->user();
        
        // Check if already in wishlist
        $existingItem = DaftarKeinginan::where('user_id', $user->id)
            ->where('varian_produk_id', $request->varian_produk_id)
            ->first();
            
        if ($existingItem) {
            // Remove from wishlist
            $existingItem->delete();
            return back()->with('success', 'Produk dihapus dari wishlist');
        }
        
        // Add to wishlist
        DaftarKeinginan::create([
            'id' => Str::uuid(),
            'user_id' => $user->id,
            'varian_produk_id' => $request->varian_produk_id,
        ]);
        
        return back()->with('success', 'Produk ditambahkan ke wishlist');
    }

    /**
     * Remove item from wishlist
     */
    public function destroy($id)
    {
        $user = auth()->user();
        $item = DaftarKeinginan::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();
            
        $item->delete();
        
        return back()->with('success', 'Produk dihapus dari wishlist');
    }

    /**
     * Check if product is in wishlist
     */
    public function check($varianProdukId)
    {
        $user = auth()->user();
        
        if (!$user) {
            return response()->json(['inWishlist' => false]);
        }
        
        $exists = DaftarKeinginan::where('user_id', $user->id)
            ->where('varian_produk_id', $varianProdukId)
            ->exists();
        
        return response()->json(['inWishlist' => $exists]);
    }

    /**
     * Get wishlist count for navbar
     */
    public function getCount()
    {
        $user = auth()->user();
        
        if (!$user) {
            return response()->json(['count' => 0]);
        }
        
        $count = DaftarKeinginan::where('user_id', $user->id)->count();
        
        return response()->json(['count' => $count]);
    }

    /**
     * Get user's wishlist IDs (for checking on product pages)
     */
    public function getIds()
    {
        $user = auth()->user();
        
        if (!$user) {
            return response()->json(['ids' => []]);
        }
        
        $ids = DaftarKeinginan::where('user_id', $user->id)
            ->pluck('varian_produk_id')
            ->toArray();
        
        return response()->json(['ids' => $ids]);
    }
}
