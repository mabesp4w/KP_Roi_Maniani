<?php

namespace App\Http\Controllers;

use App\Models\Keranjang;
use App\Models\VarianProduk;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KeranjangController extends Controller
{
    /**
     * Display cart page
     */
    public function index()
    {
        $user = auth()->user();
        
        $items = Keranjang::with(['varianProduk.produk.kategori', 'varianProduk.gambarProduks'])
            ->where('user_id', $user->id)
            ->get()
            ->map(function ($item) {
                $varian = $item->varianProduk;
                return [
                    'id' => $item->id,
                    'varian_produk_id' => $varian->id,
                    'name' => $varian->produk->nama_produk . ' - ' . $varian->nama_varian,
                    'price' => $varian->harga,
                    'quantity' => $item->kuantitas,
                    'stock' => $varian->stok,
                    'subtotal' => $varian->harga * $item->kuantitas,
                    'image' => $varian->gambarProduks->first()?->gambar_produk 
                        ? asset('storage/' . $varian->gambarProduks->first()->gambar_produk)
                        : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
                    'category' => $varian->produk->kategori->nama_kategori ?? 'Uncategorized',
                ];
            });
        
        $total = $items->sum('subtotal');
        $totalItems = $items->sum('quantity');
        
        return Inertia::render('Keranjang', [
            'items' => $items,
            'total' => $total,
            'totalItems' => $totalItems,
        ]);
    }

    /**
     * Add item to cart
     */
    public function store(Request $request)
    {
        $request->validate([
            'varian_produk_id' => 'required|exists:varian_produk,id',
            'kuantitas' => 'required|integer|min:1',
        ]);

        $user = auth()->user();
        $varianProduk = VarianProduk::findOrFail($request->varian_produk_id);
        
        // Check stock
        if ($varianProduk->stok < $request->kuantitas) {
            return back()->with('error', 'Stok tidak mencukupi');
        }
        
        // Check if item already in cart
        $existingItem = Keranjang::where('user_id', $user->id)
            ->where('varian_produk_id', $request->varian_produk_id)
            ->first();
            
        if ($existingItem) {
            // Update quantity
            $newQuantity = $existingItem->kuantitas + $request->kuantitas;
            
            if ($newQuantity > $varianProduk->stok) {
                return back()->with('error', 'Jumlah melebihi stok tersedia');
            }
            
            $existingItem->update(['kuantitas' => $newQuantity]);
            return back()->with('success', 'Jumlah produk diperbarui di keranjang');
        }
        
        // Create new cart item
        Keranjang::create([
            'id' => Str::uuid(),
            'user_id' => $user->id,
            'varian_produk_id' => $request->varian_produk_id,
            'kuantitas' => $request->kuantitas,
        ]);
        
        return back()->with('success', 'Produk berhasil ditambahkan ke keranjang');
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'kuantitas' => 'required|integer|min:1',
        ]);

        $user = auth()->user();
        $item = Keranjang::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();
            
        $varianProduk = $item->varianProduk;
        
        if ($request->kuantitas > $varianProduk->stok) {
            return back()->with('error', 'Jumlah melebihi stok tersedia');
        }
        
        $item->update(['kuantitas' => $request->kuantitas]);
        
        return back()->with('success', 'Keranjang diperbarui');
    }

    /**
     * Remove item from cart
     */
    public function destroy($id)
    {
        $user = auth()->user();
        $item = Keranjang::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();
            
        $item->delete();
        
        return back()->with('success', 'Produk dihapus dari keranjang');
    }

    /**
     * Get cart count for navbar
     */
    public function getCount()
    {
        $user = auth()->user();
        
        if (!$user) {
            return response()->json(['count' => 0]);
        }
        
        $count = Keranjang::where('user_id', $user->id)->sum('kuantitas');
        
        return response()->json(['count' => $count]);
    }
}
