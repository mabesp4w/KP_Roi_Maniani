<?php

namespace App\Http\Controllers;

use App\Models\Ongkir;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OngkirController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $kecamatanId = $request->input('kecamatan_id');
        $sort = $request->input('sort', 'nama_desa');
        $direction = $request->input('direction', 'asc');

        $ongkir = Ongkir::query()
            ->with('kecamatan')
            ->when($search, function ($query, $search) {
                $query->where('nama_desa', 'like', "%{$search}%")
                    ->orWhereHas('kecamatan', function ($q) use ($search) {
                        $q->where('nama_kecamatan', 'like', "%{$search}%");
                    });
            })
            ->when($kecamatanId, function ($query, $kecamatanId) {
                $query->where('kecamatan_id', $kecamatanId);
            })
            ->orderBy($sort, $direction)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Ongkir/Index', [
            'ongkir' => $ongkir,
            'filters' => [
                'search' => $search,
                'kecamatan_id' => $kecamatanId,
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Ongkir/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'kecamatan_id' => 'required|exists:kecamatan,id',
            'nama_desa' => 'required|string|max:255',
            'ongkir' => 'required|integer|min:0',
        ], [
            'kecamatan_id.required' => 'Kecamatan wajib dipilih',
            'kecamatan_id.exists' => 'Kecamatan tidak ditemukan',
            'nama_desa.required' => 'Nama desa/kelurahan wajib diisi',
            'ongkir.required' => 'Ongkir wajib diisi',
            'ongkir.integer' => 'Ongkir harus berupa angka',
            'ongkir.min' => 'Ongkir tidak boleh negatif',
        ]);

        Ongkir::create([
            'id' => Str::uuid(),
            'kecamatan_id' => $request->kecamatan_id,
            'nama_desa' => $request->nama_desa,
            'ongkir' => $request->ongkir,
        ]);

        return redirect()->route('admin.ongkir.index')
            ->with('success', 'Ongkir berhasil ditambahkan');
    }

    public function edit(Ongkir $ongkir)
    {
        return Inertia::render('Admin/Ongkir/Edit', [
            'ongkir' => $ongkir->load('kecamatan'),
        ]);
    }

    public function update(Request $request, Ongkir $ongkir)
    {
        $request->validate([
            'kecamatan_id' => 'required|exists:kecamatan,id',
            'nama_desa' => 'required|string|max:255',
            'ongkir' => 'required|integer|min:0',
        ], [
            'kecamatan_id.required' => 'Kecamatan wajib dipilih',
            'kecamatan_id.exists' => 'Kecamatan tidak ditemukan',
            'nama_desa.required' => 'Nama desa/kelurahan wajib diisi',
            'ongkir.required' => 'Ongkir wajib diisi',
            'ongkir.integer' => 'Ongkir harus berupa angka',
            'ongkir.min' => 'Ongkir tidak boleh negatif',
        ]);

        $ongkir->update([
            'kecamatan_id' => $request->kecamatan_id,
            'nama_desa' => $request->nama_desa,
            'ongkir' => $request->ongkir,
        ]);

        return redirect()->route('admin.ongkir.index')
            ->with('success', 'Ongkir berhasil diperbarui');
    }

    public function destroy($ongkir)
    {
        $ong = Ongkir::findOrFail($ongkir);
        $ong->delete();

        return redirect()->route('admin.ongkir.index')
            ->with('success', 'Ongkir berhasil dihapus');
    }
}
