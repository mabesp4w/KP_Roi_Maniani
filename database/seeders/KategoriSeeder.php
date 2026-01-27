<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class KategoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kategoris = [
            'Birthday Cake',
            'Wedding Cake',
            'Cupcake',
            'Brownies',
            'Cookies',
            'Tart',
            'Pudding',
            'Donat',
            'Roti',
            'Kue Kering',
            'Kue Basah',
            'Pastry',
            'Cheese Cake',
            'Red Velvet',
            'Chocolate Cake',
        ];

        foreach ($kategoris as $kategori) {
            DB::table('kategori')->insert([
                'id' => Str::uuid(),
                'nama_kategori' => $kategori,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
