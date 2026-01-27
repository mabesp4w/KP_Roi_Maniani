<?php

namespace App\Http\Controllers;

use App\Models\Kecamatan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KecamatanController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $sort = $request->input('sort', 'nama_kecamatan');
        $direction = $request->input('direction', 'asc');

        $kecamatan = Kecamatan::query()
            ->when($search, function ($query, $search) {
                $query->where('nama_kecamatan', 'like', "%{$search}%");
            })
            ->orderBy($sort, $direction)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Kecamatan/Index', [
            'kecamatan' => $kecamatan,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Kecamatan/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_kecamatan' => 'required|string|max:255|unique:kecamatan,nama_kecamatan',
        ], [
            'nama_kecamatan.required' => 'Nama kecamatan wajib diisi',
            'nama_kecamatan.unique' => 'Nama kecamatan sudah ada',
        ]);

        Kecamatan::create([
            'id' => Str::uuid(),
            'nama_kecamatan' => $request->nama_kecamatan,
        ]);

        return redirect()->route('admin.kecamatan.index')
            ->with('success', 'Kecamatan berhasil ditambahkan');
    }

    public function edit(Kecamatan $kecamatan)
    {
        return Inertia::render('Admin/Kecamatan/Edit', [
            'kecamatan' => $kecamatan,
        ]);
    }

    public function update(Request $request, Kecamatan $kecamatan)
    {
        $request->validate([
            'nama_kecamatan' => 'required|string|max:255|unique:kecamatan,nama_kecamatan,' . $kecamatan->id,
        ], [
            'nama_kecamatan.required' => 'Nama kecamatan wajib diisi',
            'nama_kecamatan.unique' => 'Nama kecamatan sudah ada',
        ]);

        $kecamatan->update([
            'nama_kecamatan' => $request->nama_kecamatan,
        ]);

        return redirect()->route('admin.kecamatan.index')
            ->with('success', 'Kecamatan berhasil diperbarui');
    }

    public function destroy($kecamatan)
    {
        $kec = Kecamatan::findOrFail($kecamatan);
        $kec->delete();

        return redirect()->route('admin.kecamatan.index')
            ->with('success', 'Kecamatan berhasil dihapus');
    }

    public function list()
    {
        $kecamatan = Kecamatan::orderBy('nama_kecamatan', 'asc')->get();

        return response()->json($kecamatan);
    }
}
