<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pesanan;
use App\Models\ItemPesanan;
use App\Models\User;
use App\Models\VarianProduk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class LaporanController extends Controller
{
    /**
     * Display sales report
     */
    public function index(Request $request)
    {
        // Date range filter
        $startDate = $request->start_date 
            ? Carbon::parse($request->start_date)->startOfDay()
            : Carbon::now()->startOfMonth();
        $endDate = $request->end_date 
            ? Carbon::parse($request->end_date)->endOfDay()
            : Carbon::now()->endOfDay();
        
        // Summary statistics
        $totalOrders = Pesanan::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', '!=', 'cancelled')
            ->count();
        
        $totalRevenue = Pesanan::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', '!=', 'cancelled')
            ->sum('total_pembayaran');
        
        $pendingOrders = Pesanan::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'pending')
            ->count();
        
        $completedOrders = Pesanan::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', 'delivered')
            ->count();
        
        // Orders by status
        $ordersByStatus = Pesanan::whereBetween('created_at', [$startDate, $endDate])
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->status => $item->total];
            });
        
        // Daily sales for chart
        $dailySales = Pesanan::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', '!=', 'cancelled')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_pembayaran) as total'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();
        
        // Top selling products
        $topProducts = ItemPesanan::join('pesanan', 'item_pesanan.pesanan_id', '=', 'pesanan.id')
            ->join('varian_produk', 'item_pesanan.varian_produk_id', '=', 'varian_produk.id')
            ->join('produk', 'varian_produk.produk_id', '=', 'produk.id')
            ->whereBetween('pesanan.created_at', [$startDate, $endDate])
            ->where('pesanan.status', '!=', 'cancelled')
            ->select(
                'produk.nama_produk',
                'varian_produk.nama_varian',
                DB::raw('SUM(item_pesanan.kuantitas) as total_sold'),
                DB::raw('SUM(item_pesanan.kuantitas * varian_produk.harga) as total_revenue')
            )
            ->groupBy('produk.nama_produk', 'varian_produk.nama_varian')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();
        
        // Recent orders
        $recentOrders = Pesanan::with('user')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer' => $order->user->name ?? 'Unknown',
                    'total' => $order->total_pembayaran,
                    'status' => $order->status,
                    'date' => $order->created_at->format('d M Y H:i'),
                ];
            });
        
        return Inertia::render('Admin/Laporan/Index', [
            'summary' => [
                'totalOrders' => $totalOrders,
                'totalRevenue' => $totalRevenue,
                'pendingOrders' => $pendingOrders,
                'completedOrders' => $completedOrders,
            ],
            'ordersByStatus' => $ordersByStatus,
            'dailySales' => $dailySales,
            'topProducts' => $topProducts,
            'recentOrders' => $recentOrders,
            'filters' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * Export report to CSV/Excel format
     */
    public function export(Request $request)
    {
        $startDate = $request->start_date 
            ? Carbon::parse($request->start_date)->startOfDay()
            : Carbon::now()->startOfMonth();
        $endDate = $request->end_date 
            ? Carbon::parse($request->end_date)->endOfDay()
            : Carbon::now()->endOfDay();
        
        $orders = Pesanan::with(['user', 'itemPesanan.varianProduk.produk'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at', 'desc')
            ->get();
        
        $filename = 'laporan_penjualan_' . $startDate->format('Y-m-d') . '_' . $endDate->format('Y-m-d') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];
        
        $callback = function() use ($orders) {
            $file = fopen('php://output', 'w');
            
            // Header
            fputcsv($file, [
                'ID Pesanan',
                'Tanggal',
                'Pelanggan',
                'Email',
                'Alamat',
                'Status',
                'Total Harga',
                'Ongkir',
                'Total Pembayaran',
            ]);
            
            // Data
            foreach ($orders as $order) {
                fputcsv($file, [
                    $order->id,
                    $order->created_at->format('Y-m-d H:i:s'),
                    $order->user->name ?? 'Unknown',
                    $order->user->email ?? '',
                    str_replace(["\n", "\r"], ' ', $order->alamat),
                    $order->status,
                    $order->total_harga,
                    $order->ongkir,
                    $order->total_pembayaran,
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
}
