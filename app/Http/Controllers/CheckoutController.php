<?php

namespace App\Http\Controllers;

use App\Models\InfoPengguna;
use App\Models\ItemPesanan;
use App\Models\Keranjang;
use App\Models\Ongkir;
use App\Models\Pesanan;
use App\Models\VarianProduk;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Display checkout page
     */
    public function index()
    {
        $user = auth()->user();
        
        // Get user's info (addresses)
        $userAddresses = InfoPengguna::with('ongkir.kecamatan')
            ->where('user_id', $user->id)
            ->get()
            ->map(function ($info) {
                return [
                    'id' => $info->id,
                    'nama_pengguna' => $info->nama_pengguna,
                    'nomor_telepon' => $info->nomor_telepon,
                    'alamat' => $info->alamat,
                    'aktif' => $info->aktif,
                    'ongkir' => [
                        'id' => $info->ongkir->id,
                        'kecamatan' => $info->ongkir->kecamatan->nama_kecamatan ?? '',
                        'nama_desa' => $info->ongkir->nama_desa ?? '',
                        'harga' => $info->ongkir->ongkir,
                    ],
                ];
            });
        
        // Get cart items
        $cartItems = Keranjang::with(['varianProduk.produk.kategori', 'varianProduk.gambarProduks'])
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
                ];
            });
        
        $subtotal = $cartItems->sum('subtotal');
        $totalItems = $cartItems->sum('quantity');
        
        // Check if cart is empty
        if ($cartItems->isEmpty()) {
            return redirect()->route('keranjang.index')->with('error', 'Keranjang kosong');
        }
        
        // Check if user has addresses
        $hasAddress = $userAddresses->isNotEmpty();
        
        // Get active address or first address
        $activeAddress = $userAddresses->firstWhere('aktif', true) ?? $userAddresses->first();
        
        return Inertia::render('Checkout', [
            'cartItems' => $cartItems,
            'userAddresses' => $userAddresses,
            'activeAddress' => $activeAddress,
            'hasAddress' => $hasAddress,
            'subtotal' => $subtotal,
            'totalItems' => $totalItems,
        ]);
    }

    /**
     * Process checkout
     */
    public function store(Request $request)
    {
        $request->validate([
            'info_pengguna_id' => 'required|exists:info_pengguna,id',
            'catatan' => 'nullable|string|max:500',
        ]);

        $user = auth()->user();
        
        // Get selected address info
        $infoPengguna = InfoPengguna::with('ongkir')->findOrFail($request->info_pengguna_id);
        
        // Verify this belongs to user
        if ($infoPengguna->user_id !== $user->id) {
            return back()->with('error', 'Alamat tidak valid');
        }
        
        // Get cart items
        $cartItems = Keranjang::with('varianProduk')
            ->where('user_id', $user->id)
            ->get();
        
        if ($cartItems->isEmpty()) {
            return back()->with('error', 'Keranjang kosong');
        }
        
        // Calculate totals
        $totalHarga = 0;
        foreach ($cartItems as $item) {
            // Check stock
            if ($item->varianProduk->stok < $item->kuantitas) {
                return back()->with('error', 'Stok ' . $item->varianProduk->nama_varian . ' tidak mencukupi');
            }
            $totalHarga += $item->varianProduk->harga * $item->kuantitas;
        }
        
        $ongkir = $infoPengguna->ongkir->ongkir;
        $totalPembayaran = $totalHarga + $ongkir;
        
        // Create order
        $pesanan = Pesanan::create([
            'id' => Str::uuid(),
            'user_id' => $user->id,
            'ongkir_id' => $infoPengguna->ongkir_id,
            'alamat' => $infoPengguna->nama_pengguna . ' - ' . $infoPengguna->nomor_telepon . "\n" . $infoPengguna->alamat,
            'ongkir' => $ongkir,
            'total_harga' => $totalHarga,
            'total_pembayaran' => $totalPembayaran,
            'status' => 'pending',
        ]);
        
        // Create order items and reduce stock
        foreach ($cartItems as $item) {
            ItemPesanan::create([
                'id' => Str::uuid(),
                'pesanan_id' => $pesanan->id,
                'varian_produk_id' => $item->varian_produk_id,
                'user_id' => $user->id,
                'kuantitas' => $item->kuantitas,
                'deskripsi' => $request->catatan,
            ]);
            
            // Reduce stock
            $item->varianProduk->decrement('stok', $item->kuantitas);
        }
        
        // Generate Midtrans Snap Token
        try {
            \Midtrans\Config::$serverKey = config('midtrans.server_key');
            \Midtrans\Config::$isProduction = config('midtrans.is_production');
            \Midtrans\Config::$isSanitized = config('midtrans.is_sanitized');
            \Midtrans\Config::$is3ds = config('midtrans.is_3ds');
            
            $params = [
                'transaction_details' => [
                    'order_id' => $pesanan->id,
                    'gross_amount' => (int) $totalPembayaran,
                ],
                'customer_details' => [
                    'first_name' => $user->name,
                    'email' => $user->email,
                    'phone' => $infoPengguna->nomor_telepon,
                    'shipping_address' => [
                        'first_name' => $infoPengguna->nama_pengguna,
                        'phone' => $infoPengguna->nomor_telepon,
                        'address' => $infoPengguna->alamat,
                    ],
                ],
                'item_details' => [],
            ];
            
            // Add items to transaction
            foreach ($cartItems as $item) {
                $params['item_details'][] = [
                    'id' => $item->varian_produk_id,
                    'price' => (int) $item->varianProduk->harga,
                    'quantity' => (int) $item->kuantitas,
                    'name' => substr($item->varianProduk->produk->nama_produk . ' - ' . $item->varianProduk->nama_varian, 0, 50),
                ];
            }
            
            // Add ongkir as item
            $params['item_details'][] = [
                'id' => 'ONGKIR',
                'price' => (int) $ongkir,
                'quantity' => 1,
                'name' => 'Ongkos Kirim',
            ];
            
            $snapToken = \Midtrans\Snap::getSnapToken($params);
            
            // Update pesanan with snap token
            $pesanan->update(['snap_token' => $snapToken]);
            
        } catch (\Exception $e) {
            // Log error but don't fail the order
            \Log::error('Midtrans Error: ' . $e->getMessage());
        }
        
        // Clear cart
        Keranjang::where('user_id', $user->id)->delete();
        
        return redirect()->route('pesanan.detail', $pesanan->id)->with('success', 'Pesanan berhasil dibuat!');
    }

    /**
     * Show order detail/confirmation
     */
    public function show($id)
    {
        $user = auth()->user();
        
        $pesanan = Pesanan::with(['itemPesanan.varianProduk.produk', 'itemPesanan.varianProduk.gambarProduks', 'ongkirRelation.kecamatan'])
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();
        
        $items = $pesanan->itemPesanan->map(function ($item) {
            $varian = $item->varianProduk;
            return [
                'id' => $item->id,
                'name' => $varian->produk->nama_produk . ' - ' . $varian->nama_varian,
                'price' => $varian->harga,
                'quantity' => $item->kuantitas,
                'subtotal' => $varian->harga * $item->kuantitas,
                'image' => $varian->gambarProduks->first()?->gambar_produk 
                    ? asset('storage/' . $varian->gambarProduks->first()->gambar_produk)
                    : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
            ];
        });
        
        $order = [
            'id' => $pesanan->id,
            'alamat' => $pesanan->alamat,
            'ongkir' => $pesanan->ongkir,
            'total_harga' => $pesanan->total_harga,
            'total_pembayaran' => $pesanan->total_pembayaran,
            'status' => $pesanan->status,
            'snap_token' => $pesanan->snap_token,
            'kecamatan' => $pesanan->ongkirRelation?->kecamatan?->nama_kecamatan ?? '',
            'created_at' => $pesanan->created_at->format('d M Y H:i'),
        ];
        
        return Inertia::render('PesananDetail', [
            'order' => $order,
            'items' => $items,
            'midtransClientKey' => config('midtrans.client_key'),
        ]);
    }

    /**
     * Get user's orders
     */
    public function orders()
    {
        $user = auth()->user();
        
        $orders = Pesanan::with(['itemPesanan'])
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(10)
            ->through(function ($pesanan) {
                return [
                    'id' => $pesanan->id,
                    'total_pembayaran' => $pesanan->total_pembayaran,
                    'status' => $pesanan->status,
                    'items_count' => $pesanan->itemPesanan->sum('kuantitas'),
                    'created_at' => $pesanan->created_at->format('d M Y'),
                ];
            });
        
        return Inertia::render('Pesanan', [
            'orders' => $orders,
        ]);
    }

    /**
     * User confirms delivery - change status from shipped to delivered
     */
    public function confirmDelivery($id)
    {
        $user = auth()->user();
        
        $pesanan = Pesanan::where('id', $id)
            ->where('user_id', $user->id)
            ->where('status', 'shipped')
            ->firstOrFail();
        
        $pesanan->update(['status' => 'delivered']);
        
        return redirect()->route('pesanan.detail', $id)
            ->with('success', 'Pesanan berhasil dikonfirmasi. Terima kasih telah berbelanja!');
    }
}
