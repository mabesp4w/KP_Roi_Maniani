<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VarianProdukSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil semua produk
        $produks = DB::table('produk')
            ->join('kategori', 'produk.kategori_id', '=', 'kategori.id')
            ->select('produk.*', 'kategori.nama_kategori')
            ->get();

        foreach ($produks as $produk) {
            // Tentukan varian berdasarkan kategori
            $varians = $this->getVariansByKategori($produk->nama_kategori);

            foreach ($varians as $varian) {
                DB::table('varian_produk')->insert([
                    'id' => Str::uuid(),
                    'produk_id' => $produk->id,
                    'nama_atribut' => $varian['atribut'],
                    'nama_varian' => $varian['nama'],
                    'harga' => $varian['harga'],
                    'stok' => rand(10, 50),
                    'deskripsi' => $varian['deskripsi'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    /**
     * Get varians based on kategori
     */
    private function getVariansByKategori($kategori)
    {
        // Varian untuk cake besar (Birthday, Wedding, dll)
        if (in_array($kategori, ['Birthday Cake', 'Wedding Cake', 'Cheese Cake', 'Red Velvet', 'Chocolate Cake'])) {
            return [
                [
                    'atribut' => 'Ukuran',
                    'nama' => 'Small (15cm)',
                    'harga' => 150000,
                    'deskripsi' => 'Ukuran kecil, cocok untuk 4-6 orang',
                ],
                [
                    'atribut' => 'Ukuran',
                    'nama' => 'Medium (20cm)',
                    'harga' => 250000,
                    'deskripsi' => 'Ukuran sedang, cocok untuk 8-12 orang',
                ],
                [
                    'atribut' => 'Ukuran',
                    'nama' => 'Large (25cm)',
                    'harga' => 350000,
                    'deskripsi' => 'Ukuran besar, cocok untuk 15-20 orang',
                ],
            ];
        }

        // Varian untuk cupcake
        if ($kategori === 'Cupcake') {
            return [
                [
                    'atribut' => 'Paket',
                    'nama' => '6 Pcs',
                    'harga' => 60000,
                    'deskripsi' => 'Paket 6 cupcake dengan topping premium',
                ],
                [
                    'atribut' => 'Paket',
                    'nama' => '12 Pcs',
                    'harga' => 110000,
                    'deskripsi' => 'Paket 12 cupcake dengan topping premium',
                ],
                [
                    'atribut' => 'Paket',
                    'nama' => '24 Pcs',
                    'harga' => 200000,
                    'deskripsi' => 'Paket 24 cupcake dengan topping premium',
                ],
            ];
        }

        // Varian untuk brownies
        if ($kategori === 'Brownies') {
            return [
                [
                    'atribut' => 'Ukuran',
                    'nama' => 'Loyang 20x20',
                    'harga' => 75000,
                    'deskripsi' => 'Brownies loyang ukuran 20x20 cm',
                ],
                [
                    'atribut' => 'Ukuran',
                    'nama' => 'Loyang 30x30',
                    'harga' => 150000,
                    'deskripsi' => 'Brownies loyang ukuran 30x30 cm',
                ],
            ];
        }

        // Varian untuk cookies
        if ($kategori === 'Cookies') {
            return [
                [
                    'atribut' => 'Paket',
                    'nama' => '250 gram',
                    'harga' => 50000,
                    'deskripsi' => 'Cookies premium dalam toples 250 gram',
                ],
                [
                    'atribut' => 'Paket',
                    'nama' => '500 gram',
                    'harga' => 90000,
                    'deskripsi' => 'Cookies premium dalam toples 500 gram',
                ],
            ];
        }

        // Varian untuk tart
        if ($kategori === 'Tart') {
            return [
                [
                    'atribut' => 'Ukuran',
                    'nama' => 'Mini (6 pcs)',
                    'harga' => 45000,
                    'deskripsi' => 'Tart mini isi 6 pieces',
                ],
                [
                    'atribut' => 'Ukuran',
                    'nama' => 'Regular (12 pcs)',
                    'harga' => 80000,
                    'deskripsi' => 'Tart regular isi 12 pieces',
                ],
            ];
        }

        // Varian untuk pudding
        if ($kategori === 'Pudding') {
            return [
                [
                    'atribut' => 'Ukuran',
                    'nama' => 'Cup (6 pcs)',
                    'harga' => 35000,
                    'deskripsi' => 'Pudding cup isi 6 pieces',
                ],
                [
                    'atribut' => 'Ukuran',
                    'nama' => 'Loyang Medium',
                    'harga' => 65000,
                    'deskripsi' => 'Pudding loyang ukuran medium',
                ],
            ];
        }

        // Varian untuk donat
        if ($kategori === 'Donat') {
            return [
                [
                    'atribut' => 'Paket',
                    'nama' => '6 Pcs',
                    'harga' => 30000,
                    'deskripsi' => 'Paket 6 donat dengan topping beragam',
                ],
                [
                    'atribut' => 'Paket',
                    'nama' => '12 Pcs',
                    'harga' => 55000,
                    'deskripsi' => 'Paket 12 donat dengan topping beragam',
                ],
            ];
        }

        // Varian untuk roti
        if ($kategori === 'Roti') {
            return [
                [
                    'atribut' => 'Ukuran',
                    'nama' => 'Regular',
                    'harga' => 25000,
                    'deskripsi' => 'Roti ukuran regular, lembut dan empuk',
                ],
                [
                    'atribut' => 'Ukuran',
                    'nama' => 'Jumbo',
                    'harga' => 45000,
                    'deskripsi' => 'Roti ukuran jumbo, lembut dan empuk',
                ],
            ];
        }

        // Varian untuk kue kering
        if ($kategori === 'Kue Kering') {
            return [
                [
                    'atribut' => 'Paket',
                    'nama' => '250 gram',
                    'harga' => 55000,
                    'deskripsi' => 'Kue kering premium dalam toples 250 gram',
                ],
                [
                    'atribut' => 'Paket',
                    'nama' => '500 gram',
                    'harga' => 100000,
                    'deskripsi' => 'Kue kering premium dalam toples 500 gram',
                ],
            ];
        }

        // Varian untuk kue basah
        if ($kategori === 'Kue Basah') {
            return [
                [
                    'atribut' => 'Ukuran',
                    'nama' => 'Loyang 20x20',
                    'harga' => 80000,
                    'deskripsi' => 'Kue basah loyang ukuran 20x20 cm',
                ],
                [
                    'atribut' => 'Ukuran',
                    'nama' => 'Loyang 30x30',
                    'harga' => 150000,
                    'deskripsi' => 'Kue basah loyang ukuran 30x30 cm',
                ],
            ];
        }

        // Varian untuk pastry
        if ($kategori === 'Pastry') {
            return [
                [
                    'atribut' => 'Paket',
                    'nama' => '4 Pcs',
                    'harga' => 40000,
                    'deskripsi' => 'Paket 4 pastry fresh dari oven',
                ],
                [
                    'atribut' => 'Paket',
                    'nama' => '8 Pcs',
                    'harga' => 75000,
                    'deskripsi' => 'Paket 8 pastry fresh dari oven',
                ],
            ];
        }

        // Default varian jika kategori tidak cocok
        return [
            [
                'atribut' => 'Ukuran',
                'nama' => 'Regular',
                'harga' => 50000,
                'deskripsi' => 'Ukuran regular',
            ],
        ];
    }
}
