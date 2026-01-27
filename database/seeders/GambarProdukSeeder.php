<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GambarProdukSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pastikan direktori storage ada
        if (!Storage::disk('public')->exists('produk')) {
            Storage::disk('public')->makeDirectory('produk');
        }

        // Ambil semua varian produk dengan informasi kategori dan produk
        $varianProduks = DB::table('varian_produk')
            ->join('produk', 'varian_produk.produk_id', '=', 'produk.id')
            ->join('kategori', 'produk.kategori_id', '=', 'kategori.id')
            ->select(
                'varian_produk.id as varian_id',
                'produk.nama_produk',
                'kategori.nama_kategori'
            )
            ->get();

        foreach ($varianProduks as $varian) {
            // Setiap varian akan memiliki 2-4 gambar
            $jumlahGambar = rand(2, 4);

            for ($i = 1; $i <= $jumlahGambar; $i++) {
                // Generate nama file unik
                $fileName = $this->generateImageFileName($varian->nama_produk, $varian->varian_id, $i);
                
                // Simpan path gambar (menggunakan placeholder URL)
                // Dalam production, ini akan diganti dengan gambar asli
                $imagePath = 'produk/' . $fileName;

                // Buat file placeholder (file kosong atau copy dari template)
                $this->createPlaceholderImage($imagePath, $varian->nama_kategori);

                // Insert ke database
                DB::table('gambar_produk')->insert([
                    'id' => Str::uuid(),
                    'varian_produk_id' => $varian->varian_id,
                    'posisi' => $i,
                    'gambar_produk' => $imagePath,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    /**
     * Generate unique image file name
     */
    private function generateImageFileName($namaProduk, $varianId, $posisi)
    {
        // Bersihkan nama produk untuk dijadikan nama file
        $cleanName = Str::slug($namaProduk);
        $shortId = substr($varianId, 0, 8);
        $timestamp = time();
        
        return "{$cleanName}_{$shortId}_{$posisi}_{$timestamp}.jpg";
    }

    /**
     * Create placeholder image file
     */
    private function createPlaceholderImage($path, $kategori)
    {
        // Untuk seeder, kita buat file placeholder sederhana
        // Dalam production, ini akan diganti dengan gambar asli
        
        // Gunakan gambar placeholder dari Unsplash berdasarkan kategori
        $placeholderUrls = [
            'Birthday Cake' => 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800',
            'Wedding Cake' => 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800',
            'Cupcake' => 'https://images.unsplash.com/photo-1426869981800-95ebf51ce900?w=800',
            'Brownies' => 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800',
            'Cookies' => 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800',
            'Tart' => 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800',
            'Pudding' => 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
            'Donat' => 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
            'Roti' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
            'Kue Kering' => 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800',
            'Kue Basah' => 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800',
            'Pastry' => 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',
            'Cheese Cake' => 'https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=800',
            'Red Velvet' => 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800',
            'Chocolate Cake' => 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
        ];

        $url = $placeholderUrls[$kategori] ?? 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800';

        try {
            // Download gambar dari URL
            $imageContent = @file_get_contents($url);
            
            if ($imageContent !== false) {
                Storage::disk('public')->put($path, $imageContent);
            } else {
                // Jika gagal download, buat file placeholder kosong
                Storage::disk('public')->put($path, '');
            }
        } catch (\Exception $e) {
            // Jika terjadi error, buat file placeholder kosong
            Storage::disk('public')->put($path, '');
        }
    }
}
