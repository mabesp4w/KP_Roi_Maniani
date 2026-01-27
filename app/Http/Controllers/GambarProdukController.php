<?php

namespace App\Http\Controllers;

use App\Models\GambarProduk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GambarProdukController extends Controller
{
    public function destroy($id)
    {
        $gambar = GambarProduk::findOrFail($id);
        
        // Delete file from storage
        if (Storage::disk('public')->exists($gambar->gambar_produk)) {
            Storage::disk('public')->delete($gambar->gambar_produk);
        }
        
        // Delete database record
        $gambar->delete();

        return redirect()->back()
            ->with('success', 'Gambar berhasil dihapus');
    }
}
