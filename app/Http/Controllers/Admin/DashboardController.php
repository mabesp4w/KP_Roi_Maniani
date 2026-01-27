<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pesanan;
use App\Models\Produk;
use App\Models\Kategori;
use App\Models\VarianProduk;
use App\Models\User;
use App\Models\ItemPesanan;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Statistik Utama
        $totalPembeli = User::where('role', 'pelanggan')->count();
        $totalProduk = Produk::count();
        $totalVarianProduk = VarianProduk::count();
        $totalKategori = Kategori::count();
        
        // Statistik Pesanan
        $totalPesanan = Pesanan::count();
        $pesananPending = Pesanan::where('status', 'pending')->count();
        $pesananProcessing = Pesanan::where('status', 'processing')->count();
        $pesananShipped = Pesanan::where('status', 'shipped')->count();
        $pesananDelivered = Pesanan::where('status', 'delivered')->count();
        $pesananCancelled = Pesanan::where('status', 'cancelled')->count();
        
        // Pendapatan
        $totalPendapatan = Pesanan::where('status', '!=', 'cancelled')->sum('total_pembayaran');
        $pendapatanBulanIni = Pesanan::where('status', '!=', 'cancelled')
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->sum('total_pembayaran');
        $pendapatanHariIni = Pesanan::where('status', '!=', 'cancelled')
            ->whereDate('created_at', Carbon::today())
            ->sum('total_pembayaran');
        
        // Pesanan hari ini
        $pesananHariIni = Pesanan::whereDate('created_at', Carbon::today())->count();
        
        // Penjualan 7 hari terakhir untuk chart
        $penjualan7Hari = Pesanan::where('status', '!=', 'cancelled')
            ->whereBetween('created_at', [Carbon::now()->subDays(6)->startOfDay(), Carbon::now()->endOfDay()])
            ->select(
                DB::raw('DATE(created_at) as tanggal'),
                DB::raw('SUM(total_pembayaran) as total'),
                DB::raw('COUNT(*) as jumlah_pesanan')
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('tanggal')
            ->get();
        
        // Generate data untuk 7 hari (termasuk hari tanpa pesanan)
        $chartData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $dayData = $penjualan7Hari->firstWhere('tanggal', $date);
            $chartData[] = [
                'tanggal' => Carbon::parse($date)->format('d M'),
                'total' => $dayData ? (int) $dayData->total : 0,
                'jumlah_pesanan' => $dayData ? (int) $dayData->jumlah_pesanan : 0,
            ];
        }
        
        // Produk terlaris (top 5)
        $produkTerlaris = ItemPesanan::join('pesanan', 'item_pesanan.pesanan_id', '=', 'pesanan.id')
            ->join('varian_produk', 'item_pesanan.varian_produk_id', '=', 'varian_produk.id')
            ->join('produk', 'varian_produk.produk_id', '=', 'produk.id')
            ->where('pesanan.status', '!=', 'cancelled')
            ->select(
                'produk.nama_produk',
                'varian_produk.nama_varian',
                DB::raw('SUM(item_pesanan.kuantitas) as total_terjual'),
                DB::raw('SUM(item_pesanan.kuantitas * varian_produk.harga) as total_pendapatan')
            )
            ->groupBy('produk.nama_produk', 'varian_produk.nama_varian')
            ->orderByDesc('total_terjual')
            ->limit(5)
            ->get();
        
        // Pesanan terbaru
        $pesananTerbaru = Pesanan::with('user')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer' => $order->user->name ?? 'Guest',
                    'total' => $order->total_pembayaran,
                    'status' => $order->status,
                    'created_at' => $order->created_at->format('d M Y H:i'),
                ];
            });
        
        // Pembeli terbaru
        $pembeliTerbaru = User::where('role', 'pelanggan')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at->format('d M Y'),
                ];
            });
        
        // Stok menipis (stok < 10)
        $stokMenipis = VarianProduk::with('produk')
            ->where('stok', '<', 10)
            ->orderBy('stok')
            ->limit(5)
            ->get()
            ->map(function ($varian) {
                return [
                    'id' => $varian->id,
                    'produk' => $varian->produk->nama_produk,
                    'varian' => $varian->nama_varian,
                    'stok' => $varian->stok,
                ];
            });
        
        return Inertia::render('Admin/Dashboard', [
            'statistik' => [
                'totalPembeli' => $totalPembeli,
                'totalProduk' => $totalProduk,
                'totalVarianProduk' => $totalVarianProduk,
                'totalKategori' => $totalKategori,
                'totalPesanan' => $totalPesanan,
                'pesananPending' => $pesananPending,
                'pesananProcessing' => $pesananProcessing,
                'pesananShipped' => $pesananShipped,
                'pesananDelivered' => $pesananDelivered,
                'pesananCancelled' => $pesananCancelled,
                'totalPendapatan' => $totalPendapatan,
                'pendapatanBulanIni' => $pendapatanBulanIni,
                'pendapatanHariIni' => $pendapatanHariIni,
                'pesananHariIni' => $pesananHariIni,
            ],
            'chartData' => $chartData,
            'produkTerlaris' => $produkTerlaris,
            'pesananTerbaru' => $pesananTerbaru,
            'pembeliTerbaru' => $pembeliTerbaru,
            'stokMenipis' => $stokMenipis,
        ]);
    }
}
