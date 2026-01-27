<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class KecamatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kecamatans = [
            'Jayapura Utara',
            'Jayapura Selatan',
            'Abepura',
            'Muara Tami',
            'Heram',
        ];

        foreach ($kecamatans as $kecamatan) {
            DB::table('kecamatan')->insert([
                'id' => Str::uuid(),
                'nama_kecamatan' => $kecamatan,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
