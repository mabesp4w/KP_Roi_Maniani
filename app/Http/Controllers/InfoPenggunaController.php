<?php

namespace App\Http\Controllers;

use App\Models\InfoPengguna;
use App\Models\Kecamatan;
use App\Models\Ongkir;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class InfoPenggunaController extends Controller
{
    /**
     * Display address list page
     */
    public function index()
    {
        $user = auth()->user();
        
        $addresses = InfoPengguna::with('ongkir.kecamatan')
            ->where('user_id', $user->id)
            ->get()
            ->map(function ($info) {
                return [
                    'id' => $info->id,
                    'nama_pengguna' => $info->nama_pengguna,
                    'nomor_telepon' => $info->nomor_telepon,
                    'alamat' => $info->alamat,
                    'aktif' => $info->aktif,
                    'ongkir_id' => $info->ongkir_id,
                    'kecamatan_id' => $info->ongkir->kecamatan_id ?? null,
                    'ongkir' => [
                        'id' => $info->ongkir->id,
                        'nama_desa' => $info->ongkir->nama_desa ?? '',
                        'kecamatan' => $info->ongkir->kecamatan->nama_kecamatan ?? '',
                        'harga' => $info->ongkir->ongkir,
                    ],
                ];
            });
        
        // Get kecamatan list for dropdown
        $kecamatanOptions = Kecamatan::all()->map(function ($kecamatan) {
            return [
                'value' => $kecamatan->id,
                'label' => $kecamatan->nama_kecamatan,
            ];
        });
        
        // Get ongkir grouped by kecamatan
        $ongkirOptions = Ongkir::with('kecamatan')
            ->get()
            ->map(function ($ongkir) {
                return [
                    'value' => $ongkir->id,
                    'label' => $ongkir->nama_desa . ' - ' . number_format($ongkir->ongkir, 0, ',', '.'),
                    'kecamatan_id' => $ongkir->kecamatan_id,
                    'nama_desa' => $ongkir->nama_desa,
                    'harga' => $ongkir->ongkir,
                ];
            });
        
        return Inertia::render('Profil/Alamat', [
            'addresses' => $addresses,
            'kecamatanOptions' => $kecamatanOptions,
            'ongkirOptions' => $ongkirOptions,
        ]);
    }

    /**
     * Store new address
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_pengguna' => 'required|string|max:255',
            'nomor_telepon' => 'required|string|max:20',
            'alamat' => 'required|string|max:500',
            'ongkir_id' => 'required|exists:ongkir,id',
            'aktif' => 'boolean',
        ]);

        $user = auth()->user();
        
        // If setting as active, deactivate all other addresses
        if ($request->aktif) {
            InfoPengguna::where('user_id', $user->id)->update(['aktif' => false]);
        }
        
        // If this is the first address, set as active
        $isFirst = InfoPengguna::where('user_id', $user->id)->count() === 0;
        
        InfoPengguna::create([
            'id' => Str::uuid(),
            'user_id' => $user->id,
            'nama_pengguna' => $request->nama_pengguna,
            'nomor_telepon' => $request->nomor_telepon,
            'alamat' => $request->alamat,
            'ongkir_id' => $request->ongkir_id,
            'aktif' => $request->aktif || $isFirst,
        ]);
        
        return back()->with('success', 'Alamat berhasil ditambahkan');
    }

    /**
     * Update address
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_pengguna' => 'required|string|max:255',
            'nomor_telepon' => 'required|string|max:20',
            'alamat' => 'required|string|max:500',
            'ongkir_id' => 'required|exists:ongkir,id',
            'aktif' => 'boolean',
        ]);

        $user = auth()->user();
        $address = InfoPengguna::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();
        
        // If setting as active, deactivate all other addresses
        if ($request->aktif) {
            InfoPengguna::where('user_id', $user->id)
                ->where('id', '!=', $id)
                ->update(['aktif' => false]);
        }
        
        $address->update([
            'nama_pengguna' => $request->nama_pengguna,
            'nomor_telepon' => $request->nomor_telepon,
            'alamat' => $request->alamat,
            'ongkir_id' => $request->ongkir_id,
            'aktif' => $request->aktif,
        ]);
        
        return back()->with('success', 'Alamat berhasil diperbarui');
    }

    /**
     * Delete address
     */
    public function destroy($id)
    {
        $user = auth()->user();
        $address = InfoPengguna::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();
        
        $wasActive = $address->aktif;
        $address->delete();
        
        // If deleted address was active, set another as active
        if ($wasActive) {
            $firstAddress = InfoPengguna::where('user_id', $user->id)->first();
            if ($firstAddress) {
                $firstAddress->update(['aktif' => true]);
            }
        }
        
        return back()->with('success', 'Alamat berhasil dihapus');
    }

    /**
     * Set address as primary/active
     */
    public function setActive($id)
    {
        $user = auth()->user();
        
        // Deactivate all
        InfoPengguna::where('user_id', $user->id)->update(['aktif' => false]);
        
        // Activate selected
        InfoPengguna::where('id', $id)
            ->where('user_id', $user->id)
            ->update(['aktif' => true]);
        
        return back()->with('success', 'Alamat utama berhasil diubah');
    }
}
