<?php

namespace App\Http\Controllers;

use App\Models\VarianProduk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class VarianProdukController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $produkId = $request->input('produk_id');
        $sort = $request->input('sort', 'nama_varian');
        $direction = $request->input('direction', 'asc');

        $varianProduk = VarianProduk::query()
            ->with(['produk.kategori', 'gambarProduks'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_atribut', 'like', "%{$search}%")
                        ->orWhere('nama_varian', 'like', "%{$search}%")
                        ->orWhereHas('produk', function ($pq) use ($search) {
                            $pq->where('nama_produk', 'like', "%{$search}%");
                        });
                });
            })
            ->when($produkId, function ($query, $produkId) {
                $query->where('produk_id', $produkId);
            })
            ->orderBy($sort, $direction)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/VarianProduk/Index', [
            'varianProduk' => $varianProduk,
            'filters' => [
                'search' => $search,
                'produk_id' => $produkId,
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'produk_id' => 'required|exists:produk,id',
            'nama_atribut' => 'required|string|max:255',
            'nama_varian' => 'required|string|max:255',
            'harga' => 'required|integer|min:0',
            'stok' => 'required|integer|min:0',
            'deskripsi' => 'nullable|string',
            'gambar.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ], [
            'produk_id.required' => 'Produk wajib dipilih',
            'produk_id.exists' => 'Produk tidak ditemukan',
            'nama_atribut.required' => 'Nama atribut wajib diisi',
            'nama_varian.required' => 'Nama varian wajib diisi',
            'harga.required' => 'Harga wajib diisi',
            'harga.integer' => 'Harga harus berupa angka',
            'harga.min' => 'Harga tidak boleh negatif',
            'stok.required' => 'Stok wajib diisi',
            'stok.integer' => 'Stok harus berupa angka',
            'stok.min' => 'Stok tidak boleh negatif',
            'gambar.*.image' => 'File harus berupa gambar',
            'gambar.*.mimes' => 'Format gambar harus jpeg, png, jpg, atau webp',
            'gambar.*.max' => 'Ukuran gambar maksimal 2MB',
        ]);

        $varianProduk = VarianProduk::create([
            'id' => Str::uuid(),
            'produk_id' => $request->produk_id,
            'nama_atribut' => $request->nama_atribut,
            'nama_varian' => $request->nama_varian,
            'harga' => $request->harga,
            'stok' => $request->stok,
            'deskripsi' => $request->deskripsi,
        ]);

        // Handle image uploads
        if ($request->hasFile('gambar')) {
            foreach ($request->file('gambar') as $index => $file) {
                $filename = time() . '_' . $index . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('produk', $filename, 'public');

                \App\Models\GambarProduk::create([
                    'id' => Str::uuid(),
                    'varian_produk_id' => $varianProduk->id,
                    'posisi' => $index + 1,
                    'gambar_produk' => $path,
                ]);
            }
        }

        return redirect()->route('admin.varian-produk.index')
            ->with('success', 'Varian produk berhasil ditambahkan');
    }

    public function update(Request $request, VarianProduk $varianProduk)
    {
        $request->validate([
            'produk_id' => 'required|exists:produk,id',
            'nama_atribut' => 'required|string|max:255',
            'nama_varian' => 'required|string|max:255',
            'harga' => 'required|integer|min:0',
            'stok' => 'required|integer|min:0',
            'deskripsi' => 'nullable|string',
            'gambar.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ], [
            'produk_id.required' => 'Produk wajib dipilih',
            'produk_id.exists' => 'Produk tidak ditemukan',
            'nama_atribut.required' => 'Nama atribut wajib diisi',
            'nama_varian.required' => 'Nama varian wajib diisi',
            'harga.required' => 'Harga wajib diisi',
            'harga.integer' => 'Harga harus berupa angka',
            'harga.min' => 'Harga tidak boleh negatif',
            'stok.required' => 'Stok wajib diisi',
            'stok.integer' => 'Stok harus berupa angka',
            'stok.min' => 'Stok tidak boleh negatif',
            'gambar.*.image' => 'File harus berupa gambar',
            'gambar.*.mimes' => 'Format gambar harus jpeg, png, jpg, atau webp',
            'gambar.*.max' => 'Ukuran gambar maksimal 2MB',
        ]);

        $varianProduk->update([
            'produk_id' => $request->produk_id,
            'nama_atribut' => $request->nama_atribut,
            'nama_varian' => $request->nama_varian,
            'harga' => $request->harga,
            'stok' => $request->stok,
            'deskripsi' => $request->deskripsi,
        ]);

        // Handle new image uploads
        if ($request->hasFile('gambar')) {
            // Get current max position
            $maxPosition = $varianProduk->gambarProduks()->max('posisi') ?? 0;

            foreach ($request->file('gambar') as $index => $file) {
                $filename = time() . '_' . $index . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('produk', $filename, 'public');

                \App\Models\GambarProduk::create([
                    'id' => Str::uuid(),
                    'varian_produk_id' => $varianProduk->id,
                    'posisi' => $maxPosition + $index + 1,
                    'gambar_produk' => $path,
                ]);
            }
        }

        return redirect()->route('admin.varian-produk.index')
            ->with('success', 'Varian produk berhasil diperbarui');
    }

    public function destroy($varianProduk)
    {
        $varian = VarianProduk::findOrFail($varianProduk);
        
        // Check if varian has related data
        $hasOrders = $varian->itemPesanan()->count() > 0;
        $hasCart = $varian->keranjang()->count() > 0;
        $hasWishlist = $varian->daftarKeinginan()->count() > 0;
        
        if ($hasOrders || $hasCart || $hasWishlist) {
            return redirect()->route('admin.varian-produk.index')
                ->with('error', 'Varian produk tidak dapat dihapus karena masih terkait dengan pesanan, keranjang, atau wishlist');
        }
        
        $varian->delete();

        return redirect()->route('admin.varian-produk.index')
            ->with('success', 'Varian produk berhasil dihapus');
    }

    public function list()
    {
        $varianProduk = VarianProduk::with('produk')->orderBy('nama_varian', 'asc')->get();

        return response()->json($varianProduk);
    }
}
