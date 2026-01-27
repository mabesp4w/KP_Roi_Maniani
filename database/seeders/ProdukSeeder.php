<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProdukSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil semua kategori
        $kategoris = DB::table('kategori')->get()->keyBy('nama_kategori');

        // Data produk untuk setiap kategori
        $produkData = [
            'Birthday Cake' => [
                'Rainbow Cake',
                'Unicorn Cake',
                'Princess Cake',
                'Superhero Cake',
            ],
            'Wedding Cake' => [
                'Classic White Wedding Cake',
                'Floral Wedding Cake',
                'Modern Minimalist Wedding Cake',
            ],
            'Cupcake' => [
                'Vanilla Cupcake',
                'Chocolate Cupcake',
                'Red Velvet Cupcake',
                'Strawberry Cupcake',
            ],
            'Brownies' => [
                'Fudgy Brownies',
                'Brownies Kukus',
                'Brownies Panggang',
            ],
            'Cookies' => [
                'Chocolate Chip Cookies',
                'Oatmeal Cookies',
                'Sugar Cookies',
            ],
            'Tart' => [
                'Fruit Tart',
                'Cheese Tart',
                'Egg Tart',
            ],
            'Pudding' => [
                'Caramel Pudding',
                'Chocolate Pudding',
                'Fruit Pudding',
            ],
            'Donat' => [
                'Glazed Donut',
                'Chocolate Donut',
                'Sprinkle Donut',
            ],
            'Roti' => [
                'Roti Tawar',
                'Roti Sobek',
                'Roti Sisir',
            ],
            'Kue Kering' => [
                'Nastar',
                'Kastengel',
                'Putri Salju',
            ],
            'Kue Basah' => [
                'Bolu Kukus',
                'Lapis Legit',
                'Kue Lumpur',
            ],
            'Pastry' => [
                'Croissant',
                'Danish Pastry',
                'Puff Pastry',
            ],
            'Cheese Cake' => [
                'New York Cheese Cake',
                'Japanese Cheese Cake',
                'Oreo Cheese Cake',
            ],
            'Red Velvet' => [
                'Classic Red Velvet',
                'Red Velvet Lapis',
                'Red Velvet Roll',
            ],
            'Chocolate Cake' => [
                'Dark Chocolate Cake',
                'Milk Chocolate Cake',
                'Triple Chocolate Cake',
            ],
        ];

        // Insert data produk
        foreach ($produkData as $kategoriNama => $produks) {
            if (isset($kategoris[$kategoriNama])) {
                foreach ($produks as $produk) {
                    DB::table('produk')->insert([
                        'id' => Str::uuid(),
                        'kategori_id' => $kategoris[$kategoriNama]->id,
                        'nama_produk' => $produk,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
