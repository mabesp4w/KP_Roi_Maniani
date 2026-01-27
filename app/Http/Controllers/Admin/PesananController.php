<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pesanan;
use App\Models\ItemPesanan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PesananController extends Controller
{
    /**
     * Display list of all orders
     */
    public function index(Request $request)
    {
        $query = Pesanan::with(['user', 'itemPesanan'])
            ->latest();
        
        // Filter by status
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Search by order ID or customer name
        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhereHas('user', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        $orders = $query->paginate(15)->through(function ($pesanan) {
            return [
                'id' => $pesanan->id,
                'customer_name' => $pesanan->user->name ?? 'Unknown',
                'customer_email' => $pesanan->user->email ?? '',
                'total_pembayaran' => $pesanan->total_pembayaran,
                'status' => $pesanan->status,
                'items_count' => $pesanan->itemPesanan->sum('kuantitas'),
                'alamat' => $pesanan->alamat,
                'created_at' => $pesanan->created_at->format('d M Y H:i'),
            ];
        });
        
        return Inertia::render('Admin/Pesanan/Index', [
            'orders' => $orders,
            'filters' => [
                'status' => $request->status ?? 'all',
                'search' => $request->search ?? '',
            ],
        ]);
    }

    /**
     * Show order detail
     */
    public function show($id)
    {
        $pesanan = Pesanan::with([
            'user', 
            'itemPesanan.varianProduk.produk', 
            'itemPesanan.varianProduk.gambarProduks',
            'ongkirRelation.kecamatan'
        ])->findOrFail($id);
        
        $items = $pesanan->itemPesanan->map(function ($item) {
            $varian = $item->varianProduk;
            return [
                'id' => $item->id,
                'name' => $varian->produk->nama_produk . ' - ' . $varian->nama_varian,
                'price' => $varian->harga,
                'quantity' => $item->kuantitas,
                'subtotal' => $varian->harga * $item->kuantitas,
                'deskripsi' => $item->deskripsi,
                'image' => $varian->gambarProduks->first()?->gambar_produk 
                    ? asset('storage/' . $varian->gambarProduks->first()->gambar_produk)
                    : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
            ];
        });
        
        $order = [
            'id' => $pesanan->id,
            'customer_name' => $pesanan->user->name ?? 'Unknown',
            'customer_email' => $pesanan->user->email ?? '',
            'alamat' => $pesanan->alamat,
            'ongkir' => $pesanan->ongkir,
            'total_harga' => $pesanan->total_harga,
            'total_pembayaran' => $pesanan->total_pembayaran,
            'status' => $pesanan->status,
            'snap_token' => $pesanan->snap_token,
            'kecamatan' => $pesanan->ongkirRelation?->kecamatan?->nama_kecamatan ?? '',
            'created_at' => $pesanan->created_at->format('d M Y H:i'),
            'updated_at' => $pesanan->updated_at->format('d M Y H:i'),
        ];
        
        return Inertia::render('Admin/Pesanan/Show', [
            'order' => $order,
            'items' => $items,
        ]);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $pesanan = Pesanan::findOrFail($id);
        $oldStatus = $pesanan->status;
        $newStatus = $request->status;
        
        // If cancelling, restore stock
        if ($newStatus === 'cancelled' && $oldStatus !== 'cancelled') {
            foreach ($pesanan->itemPesanan as $item) {
                $item->varianProduk->increment('stok', $item->kuantitas);
            }
        }
        
        // If un-cancelling, reduce stock again
        if ($oldStatus === 'cancelled' && $newStatus !== 'cancelled') {
            foreach ($pesanan->itemPesanan as $item) {
                $item->varianProduk->decrement('stok', $item->kuantitas);
            }
        }
        
        $pesanan->update(['status' => $newStatus]);
        
        return back()->with('success', 'Status pesanan berhasil diperbarui');
    }
}
