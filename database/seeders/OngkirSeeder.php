<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OngkirSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil semua kecamatan
        $kecamatans = DB::table('kecamatan')->get();

        // Data ongkir untuk setiap kecamatan
        $ongkirData = [
            'Jayapura Utara' => [
                ['nama_desa' => 'Gurabesi', 'ongkir' => 10000],
                ['nama_desa' => 'Bhayangkara', 'ongkir' => 12000],
                ['nama_desa' => 'Tanjung Ria', 'ongkir' => 15000],
                ['nama_desa' => 'Kayu Batu', 'ongkir' => 13000],
            ],
            'Jayapura Selatan' => [
                ['nama_desa' => 'Tobati', 'ongkir' => 18000],
                ['nama_desa' => 'Enggros', 'ongkir' => 12000],
                ['nama_desa' => 'Hamadi', 'ongkir' => 14000],
                ['nama_desa' => 'Vim', 'ongkir' => 16000],
            ],
            'Abepura' => [
                ['nama_desa' => 'Abepura', 'ongkir' => 15000],
                ['nama_desa' => 'Waena', 'ongkir' => 17000],
                ['nama_desa' => 'Yabansai', 'ongkir' => 16000],
                ['nama_desa' => 'Entrop', 'ongkir' => 18000],
            ],
            'Muara Tami' => [
                ['nama_desa' => 'Skouw Yambe', 'ongkir' => 25000],
                ['nama_desa' => 'Skouw Mabo', 'ongkir' => 27000],
                ['nama_desa' => 'Skouw Sae', 'ongkir' => 26000],
                ['nama_desa' => 'Muara Tami', 'ongkir' => 24000],
            ],
            'Heram' => [
                ['nama_desa' => 'Heram', 'ongkir' => 20000],
                ['nama_desa' => 'Nafri', 'ongkir' => 22000],
                ['nama_desa' => 'Ifar Besar', 'ongkir' => 21000],
                ['nama_desa' => 'Sentani Timur', 'ongkir' => 23000],
            ],
        ];

        // Insert data ongkir
        foreach ($kecamatans as $kecamatan) {
            if (isset($ongkirData[$kecamatan->nama_kecamatan])) {
                foreach ($ongkirData[$kecamatan->nama_kecamatan] as $desa) {
                    DB::table('ongkir')->insert([
                        'id' => Str::uuid(),
                        'kecamatan_id' => $kecamatan->id,
                        'nama_desa' => $desa['nama_desa'],
                        'ongkir' => $desa['ongkir'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
