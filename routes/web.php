<?php

use App\Http\Controllers\GambarProdukController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\KecamatanController;
use App\Http\Controllers\OngkirController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\VarianProdukController;
use App\Models\Kategori;
use App\Models\VarianProduk;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Get categories with product count
    $categories = Kategori::withCount('produks')->get();
    
    // Get featured products (latest 6 with images)
    $featuredProducts = VarianProduk::with(['produk.kategori', 'gambarProduks'])
        ->latest()
        ->take(6)
        ->get()
        ->map(function ($varian) {
            return [
                'id' => $varian->id,
                'name' => $varian->produk->nama_produk . ' - ' . $varian->nama_varian,
                'price' => $varian->harga,
                'image' => $varian->gambarProduks->first()?->gambar_produk 
                    ? asset('storage/' . $varian->gambarProduks->first()->gambar_produk)
                    : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
                'category' => $varian->produk->kategori->nama_kategori ?? 'Uncategorized',
                'stock' => $varian->stok,
            ];
        });
    
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'categories' => $categories,
        'featuredProducts' => $featuredProducts,
    ]);
});

// Tentang (About) Page
Route::get('/tentang', function () {
    return Inertia::render('Tentang');
})->name('tentang');

// Kontak (Contact) Page
Route::get('/kontak', function () {
    return Inertia::render('Kontak');
})->name('kontak');

// Products Page
Route::get('/produk', function (Request $request) {
    $search = $request->input('search');
    $kategoriId = $request->input('kategori_id');
    
    // Get all categories for filter
    $categories = Kategori::withCount('produks')->get();
    
    // Build query
    $query = VarianProduk::with(['produk.kategori', 'gambarProduks']);
    
    // Apply search
    if ($search) {
        $query->where(function ($q) use ($search) {
            $q->where('nama_varian', 'like', "%{$search}%")
              ->orWhere('nama_atribut', 'like', "%{$search}%")
              ->orWhereHas('produk', function ($pq) use ($search) {
                  $pq->where('nama_produk', 'like', "%{$search}%");
              });
        });
    }
    
    // Apply category filter
    if ($kategoriId) {
        $query->whereHas('produk', function ($pq) use ($kategoriId) {
            $pq->where('kategori_id', $kategoriId);
        });
    }
    
    // Get paginated products
    $products = $query->latest()
        ->paginate(12)
        ->withQueryString()
        ->through(function ($varian) {
            return [
                'id' => $varian->id,
                'name' => $varian->produk->nama_produk . ' - ' . $varian->nama_varian,
                'price' => $varian->harga,
                'image' => $varian->gambarProduks->first()?->gambar_produk 
                    ? asset('storage/' . $varian->gambarProduks->first()->gambar_produk)
                    : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
                'category' => $varian->produk->kategori->nama_kategori ?? 'Uncategorized',
                'stock' => $varian->stok,
                'description' => $varian->deskripsi,
            ];
        });
    
    return Inertia::render('Produk', [
        'products' => $products,
        'categories' => $categories,
        'filters' => [
            'search' => $search,
            'kategori_id' => $kategoriId,
        ],
    ]);
})->name('produk');

// Product Detail Page
Route::get('/produk/{id}', function ($id) {
    $varian = VarianProduk::with(['produk.kategori', 'gambarProduks'])->findOrFail($id);
    
    // Get all images
    $images = $varian->gambarProduks->map(function ($gambar) {
        return asset('storage/' . $gambar->gambar_produk);
    })->toArray();
    
    // Add fallback if no images
    if (empty($images)) {
        $images = ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop'];
    }
    
    // Get other variants of the same product
    $otherVariants = VarianProduk::with(['gambarProduks'])
        ->where('produk_id', $varian->produk_id)
        ->where('id', '!=', $id)
        ->get()
        ->map(function ($v) {
            return [
                'id' => $v->id,
                'name' => $v->nama_varian,
                'price' => $v->harga,
                'stock' => $v->stok,
                'image' => $v->gambarProduks->first()?->gambar_produk 
                    ? asset('storage/' . $v->gambarProduks->first()->gambar_produk)
                    : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
            ];
        });
    
    // Get related products (same category, different product)
    $relatedProducts = VarianProduk::with(['produk.kategori', 'gambarProduks'])
        ->whereHas('produk', function ($q) use ($varian) {
            $q->where('kategori_id', $varian->produk->kategori_id)
              ->where('id', '!=', $varian->produk_id);
        })
        ->take(4)
        ->get()
        ->map(function ($v) {
            return [
                'id' => $v->id,
                'name' => $v->produk->nama_produk . ' - ' . $v->nama_varian,
                'price' => $v->harga,
                'stock' => $v->stok,
                'category' => $v->produk->kategori->nama_kategori ?? 'Uncategorized',
                'image' => $v->gambarProduks->first()?->gambar_produk 
                    ? asset('storage/' . $v->gambarProduks->first()->gambar_produk)
                    : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
            ];
        });
    
    $product = [
        'id' => $varian->id,
        'name' => $varian->produk->nama_produk,
        'variant_name' => $varian->nama_varian,
        'full_name' => $varian->produk->nama_produk . ' - ' . $varian->nama_varian,
        'price' => $varian->harga,
        'stock' => $varian->stok,
        'description' => $varian->deskripsi ?? $varian->produk->deskripsi ?? '',
        'attribute' => $varian->nama_atribut,
        'category' => $varian->produk->kategori->nama_kategori ?? 'Uncategorized',
        'category_id' => $varian->produk->kategori_id,
        'images' => $images,
    ];
    
    return Inertia::render('ProdukDetail', [
        'product' => $product,
        'otherVariants' => $otherVariants,
        'relatedProducts' => $relatedProducts,
    ]);
})->name('produk.detail');

// Cart Routes - Only for authenticated users
Route::middleware(['auth'])->prefix('keranjang')->name('keranjang.')->group(function () {
    Route::get('/', [\App\Http\Controllers\KeranjangController::class, 'index'])->name('index');
    Route::post('/', [\App\Http\Controllers\KeranjangController::class, 'store'])->name('store');
    Route::put('/{id}', [\App\Http\Controllers\KeranjangController::class, 'update'])->name('update');
    Route::delete('/{id}', [\App\Http\Controllers\KeranjangController::class, 'destroy'])->name('destroy');
});

// API route for cart count (can be called from navbar)
Route::get('/api/keranjang/count', [\App\Http\Controllers\KeranjangController::class, 'getCount'])->name('keranjang.count');

// Wishlist Routes - Only for authenticated users
Route::middleware(['auth'])->prefix('wishlist')->name('wishlist.')->group(function () {
    Route::get('/', [\App\Http\Controllers\WishlistController::class, 'index'])->name('index');
    Route::post('/toggle', [\App\Http\Controllers\WishlistController::class, 'toggle'])->name('toggle');
    Route::delete('/{id}', [\App\Http\Controllers\WishlistController::class, 'destroy'])->name('destroy');
});

// API routes for wishlist
Route::get('/api/wishlist/count', [\App\Http\Controllers\WishlistController::class, 'getCount'])->name('wishlist.count');
Route::get('/api/wishlist/ids', [\App\Http\Controllers\WishlistController::class, 'getIds'])->name('wishlist.ids');
Route::get('/api/wishlist/check/{id}', [\App\Http\Controllers\WishlistController::class, 'check'])->name('wishlist.check');

// Checkout Routes - Only for authenticated users
Route::middleware(['auth'])->group(function () {
    Route::get('/checkout', [\App\Http\Controllers\CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [\App\Http\Controllers\CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/pesanan', [\App\Http\Controllers\CheckoutController::class, 'orders'])->name('pesanan.index');
    Route::get('/pesanan/{id}', [\App\Http\Controllers\CheckoutController::class, 'show'])->name('pesanan.detail');
    Route::post('/pesanan/{id}/confirm', [\App\Http\Controllers\CheckoutController::class, 'confirmDelivery'])->name('pesanan.confirm');
    
    // Profile/Address Routes
    Route::get('/profil/alamat', [\App\Http\Controllers\InfoPenggunaController::class, 'index'])->name('profil.alamat');
    Route::post('/profil/alamat', [\App\Http\Controllers\InfoPenggunaController::class, 'store'])->name('profil.alamat.store');
    Route::put('/profil/alamat/{id}', [\App\Http\Controllers\InfoPenggunaController::class, 'update'])->name('profil.alamat.update');
    Route::delete('/profil/alamat/{id}', [\App\Http\Controllers\InfoPenggunaController::class, 'destroy'])->name('profil.alamat.destroy');
    Route::post('/profil/alamat/{id}/aktif', [\App\Http\Controllers\InfoPenggunaController::class, 'setActive'])->name('profil.alamat.aktif');
    
    // Midtrans payment status update
    Route::post('/payment/update/{id}', [\App\Http\Controllers\MidtransController::class, 'updateStatus'])->name('payment.update');
    
    // Ulasan Routes
    Route::get('/ulasan', [\App\Http\Controllers\UlasanController::class, 'index'])->name('ulasan.index');
    Route::get('/ulasan/create/{pesananId}', [\App\Http\Controllers\UlasanController::class, 'create'])->name('ulasan.create');
    Route::post('/ulasan', [\App\Http\Controllers\UlasanController::class, 'store'])->name('ulasan.store');
    Route::get('/ulasan/{id}/edit', [\App\Http\Controllers\UlasanController::class, 'edit'])->name('ulasan.edit');
    Route::put('/ulasan/{id}', [\App\Http\Controllers\UlasanController::class, 'update'])->name('ulasan.update');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Admin Routes - Hanya bisa diakses oleh admin
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    // Kecamatan Routes - List route must come before resource route
    Route::get('/kecamatan/list', [KecamatanController::class, 'list'])->name('kecamatan.list');
    Route::resource('kecamatan', KecamatanController::class);

    // Ongkir Routes - Complete resource route
    Route::resource('ongkir', OngkirController::class);

    // Kategori Routes - List route must come before resource route
    Route::get('/kategori/list', [KategoriController::class, 'list'])->name('kategori.list');
    Route::resource('kategori', KategoriController::class)->except(['show', 'create', 'edit']);

    // Produk Routes - List route must come before resource route
    Route::get('/produk/list', [ProdukController::class, 'list'])->name('produk.list');
    Route::resource('produk', ProdukController::class)->except(['show', 'create', 'edit']);

    // Varian Produk Routes - List route must come before resource route
    Route::get('/varian-produk/list', [VarianProdukController::class, 'list'])->name('varian-produk.list');
    Route::get('/varian-produk/{id}', [VarianProdukController::class, 'show'])->name('varian-produk.show');
    Route::resource('varian-produk', VarianProdukController::class)->except(['show', 'create', 'edit']);

    // Gambar Produk Routes - Delete only
    Route::delete('/gambar-produk/{id}', [GambarProdukController::class, 'destroy'])->name('gambar-produk.destroy');
    
    // Pesanan Routes
    Route::get('/pesanan', [\App\Http\Controllers\Admin\PesananController::class, 'index'])->name('pesanan.index');
    Route::get('/pesanan/{id}', [\App\Http\Controllers\Admin\PesananController::class, 'show'])->name('pesanan.show');
    Route::put('/pesanan/{id}/status', [\App\Http\Controllers\Admin\PesananController::class, 'updateStatus'])->name('pesanan.updateStatus');
    
    // Laporan Routes
    Route::get('/laporan', [\App\Http\Controllers\Admin\LaporanController::class, 'index'])->name('laporan.index');
    Route::get('/laporan/export', [\App\Http\Controllers\Admin\LaporanController::class, 'export'])->name('laporan.export');
    
    // Pembeli Routes
    Route::get('/pembeli', [\App\Http\Controllers\Admin\PembeliController::class, 'index'])->name('pembeli.index');
    Route::get('/pembeli/{id}', [\App\Http\Controllers\Admin\PembeliController::class, 'show'])->name('pembeli.show');
});

require __DIR__.'/auth.php';
