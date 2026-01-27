<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProdukController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $kategoriId = $request->input('kategori_id');
        $sort = $request->input('sort', 'nama_produk');
        $direction = $request->input('direction', 'asc');

        $produk = Produk::query()
            ->with('kategori')
            ->withCount('varianProduks')
            ->when($search, function ($query, $search) {
                $query->where('nama_produk', 'like', "%{$search}%")
                    ->orWhereHas('kategori', function ($q) use ($search) {
                        $q->where('nama_kategori', 'like', "%{$search}%");
                    });
            })
            ->when($kategoriId, function ($query, $kategoriId) {
                $query->where('kategori_id', $kategoriId);
            })
            ->orderBy($sort, $direction)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Produk/Index', [
            'produk' => $produk,
            'filters' => [
                'search' => $search,
                'kategori_id' => $kategoriId,
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kategori_id' => 'required|exists:kategori,id',
            'nama_produk' => 'required|string|max:255',
        ], [
            'kategori_id.required' => 'Kategori wajib dipilih',
            'kategori_id.exists' => 'Kategori tidak ditemukan',
            'nama_produk.required' => 'Nama produk wajib diisi',
        ]);

        Produk::create([
            'id' => Str::uuid(),
            'kategori_id' => $request->kategori_id,
            'nama_produk' => $request->nama_produk,
        ]);

        return redirect()->route('admin.produk.index')
            ->with('success', 'Produk berhasil ditambahkan');
    }

    public function update(Request $request, Produk $produk)
    {
        $request->validate([
            'kategori_id' => 'required|exists:kategori,id',
            'nama_produk' => 'required|string|max:255',
        ], [
            'kategori_id.required' => 'Kategori wajib dipilih',
            'kategori_id.exists' => 'Kategori tidak ditemukan',
            'nama_produk.required' => 'Nama produk wajib diisi',
        ]);

        $produk->update([
            'kategori_id' => $request->kategori_id,
            'nama_produk' => $request->nama_produk,
        ]);

        return redirect()->route('admin.produk.index')
            ->with('success', 'Produk berhasil diperbarui');
    }

    public function destroy($produk)
    {
        $prod = Produk::findOrFail($produk);
        
        // Check if produk has varian
        if ($prod->varianProduks()->count() > 0) {
            return redirect()->route('admin.produk.index')
                ->with('error', 'Produk tidak dapat dihapus karena masih memiliki varian');
        }
        
        $prod->delete();

        return redirect()->route('admin.produk.index')
            ->with('success', 'Produk berhasil dihapus');
    }

    public function list()
    {
        $produk = Produk::with('kategori')->orderBy('nama_produk', 'asc')->get();

        return response()->json($produk);
    }
}
