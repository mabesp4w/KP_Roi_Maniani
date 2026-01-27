<?php

namespace App\Http\Controllers;

use App\Models\Ulasan;
use App\Models\Pesanan;
use App\Models\ItemPesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UlasanController extends Controller
{
    /**
     * Display user's reviews
     */
    public function index()
    {
        $user = auth()->user();
        
        $reviews = Ulasan::with(['varianProduk.produk', 'varianProduk.gambarProduks', 'pesanan'])
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(10)
            ->through(function ($ulasan) {
                return [
                    'id' => $ulasan->id,
                    'product_name' => $ulasan->varianProduk->produk->nama_produk . ' - ' . $ulasan->varianProduk->nama_varian,
                    'image' => $ulasan->varianProduk->gambarProduks->first()?->gambar_produk 
                        ? asset('storage/' . $ulasan->varianProduk->gambarProduks->first()->gambar_produk)
                        : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
                    'rating' => $ulasan->rating,
                    'komentar' => $ulasan->komentar,
                    'order_id' => $ulasan->pesanan_id,
                    'created_at' => $ulasan->created_at->format('d M Y'),
                ];
            });
        
        return Inertia::render('Ulasan/Index', [
            'reviews' => $reviews,
        ]);
    }

    /**
     * Show form to create review for an order
     */
    public function create(Request $request, $pesananId)
    {
        $user = auth()->user();
        
        $pesanan = Pesanan::with(['itemPesanan.varianProduk.produk', 'itemPesanan.varianProduk.gambarProduks'])
            ->where('id', $pesananId)
            ->where('user_id', $user->id)
            ->where('status', 'delivered')
            ->firstOrFail();
        
        // Get existing reviews for this order
        $existingReviews = Ulasan::where('pesanan_id', $pesananId)
            ->where('user_id', $user->id)
            ->pluck('varian_produk_id')
            ->toArray();
        
        // Items that can be reviewed
        $items = $pesanan->itemPesanan
            ->filter(function ($item) use ($existingReviews) {
                return !in_array($item->varian_produk_id, $existingReviews);
            })
            ->map(function ($item) {
                $varian = $item->varianProduk;
                return [
                    'id' => $item->id,
                    'varian_produk_id' => $item->varian_produk_id,
                    'name' => $varian->produk->nama_produk . ' - ' . $varian->nama_varian,
                    'image' => $varian->gambarProduks->first()?->gambar_produk 
                        ? asset('storage/' . $varian->gambarProduks->first()->gambar_produk)
                        : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
                ];
            })->values();
        
        if ($items->isEmpty()) {
            return redirect()->route('pesanan.detail', $pesananId)
                ->with('info', 'Semua produk dalam pesanan ini sudah diulas');
        }
        
        return Inertia::render('Ulasan/Create', [
            'pesanan' => [
                'id' => $pesanan->id,
                'created_at' => $pesanan->created_at->format('d M Y'),
            ],
            'items' => $items,
        ]);
    }

    /**
     * Store new review
     */
    public function store(Request $request)
    {
        $request->validate([
            'pesanan_id' => 'required|exists:pesanan,id',
            'reviews' => 'required|array|min:1',
            'reviews.*.varian_produk_id' => 'required|exists:varian_produk,id',
            'reviews.*.rating' => 'required|integer|min:1|max:5',
            'reviews.*.komentar' => 'nullable|string|max:500',
        ]);

        $user = auth()->user();
        
        // Verify order belongs to user and is delivered
        $pesanan = Pesanan::where('id', $request->pesanan_id)
            ->where('user_id', $user->id)
            ->where('status', 'delivered')
            ->firstOrFail();
        
        // Create reviews
        foreach ($request->reviews as $review) {
            // Check if already reviewed
            $exists = Ulasan::where('pesanan_id', $request->pesanan_id)
                ->where('varian_produk_id', $review['varian_produk_id'])
                ->where('user_id', $user->id)
                ->exists();
            
            if (!$exists) {
                Ulasan::create([
                    'id' => Str::uuid(),
                    'pesanan_id' => $request->pesanan_id,
                    'varian_produk_id' => $review['varian_produk_id'],
                    'user_id' => $user->id,
                    'rating' => $review['rating'],
                    'komentar' => $review['komentar'] ?? null,
                ]);
            }
        }
        
        return redirect()->route('ulasan.index')->with('success', 'Ulasan berhasil dikirim!');
    }

    /**
     * Get reviews for a product (public)
     */
    public function productReviews($varianProdukId)
    {
        $reviews = Ulasan::with('user')
            ->where('varian_produk_id', $varianProdukId)
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($ulasan) {
                return [
                    'id' => $ulasan->id,
                    'user_name' => $ulasan->user->name ?? 'Anonymous',
                    'rating' => $ulasan->rating,
                    'komentar' => $ulasan->komentar,
                    'created_at' => $ulasan->created_at->format('d M Y'),
                ];
            });
        
        $stats = [
            'total' => Ulasan::where('varian_produk_id', $varianProdukId)->count(),
            'average' => round(Ulasan::where('varian_produk_id', $varianProdukId)->avg('rating') ?? 0, 1),
        ];
        
        return response()->json([
            'reviews' => $reviews,
            'stats' => $stats,
        ]);
    }

    /**
     * Show form to edit a review
     */
    public function edit($id)
    {
        $user = auth()->user();
        
        $ulasan = Ulasan::with(['varianProduk.produk', 'varianProduk.gambarProduks'])
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();
        
        $review = [
            'id' => $ulasan->id,
            'product_name' => $ulasan->varianProduk->produk->nama_produk . ' - ' . $ulasan->varianProduk->nama_varian,
            'image' => $ulasan->varianProduk->gambarProduks->first()?->gambar_produk 
                ? asset('storage/' . $ulasan->varianProduk->gambarProduks->first()->gambar_produk)
                : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
            'rating' => $ulasan->rating,
            'komentar' => $ulasan->komentar,
        ];
        
        return Inertia::render('Ulasan/Edit', [
            'review' => $review,
        ]);
    }

    /**
     * Update an existing review
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string|max:500',
        ]);

        $user = auth()->user();
        
        $ulasan = Ulasan::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();
        
        $ulasan->update([
            'rating' => $request->rating,
            'komentar' => $request->komentar,
        ]);
        
        return redirect()->route('ulasan.index')->with('success', 'Ulasan berhasil diperbarui!');
    }
}
