<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PembeliController extends Controller
{
    /**
     * Display list of buyers (pembeli)
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        
        $pembeli = User::where('role', 'user')
            ->with(['infoPengguna' => function ($query) {
                $query->where('aktif', true)->first();
            }])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhereHas('infoPengguna', function ($iq) use ($search) {
                          $iq->where('nomor_telepon', 'like', "%{$search}%")
                            ->orWhere('nama_pengguna', 'like', "%{$search}%");
                      });
                });
            })
            ->withCount('pesanan')
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(function ($user) {
                $activeInfo = $user->infoPengguna->where('aktif', true)->first();
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $activeInfo?->nomor_telepon ?? '-',
                    'address' => $activeInfo?->alamat ?? '-',
                    'orders_count' => $user->pesanan_count,
                    'created_at' => $user->created_at->format('d M Y'),
                ];
            });
        
        return Inertia::render('Admin/Pembeli/Index', [
            'pembeli' => $pembeli,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show buyer detail with order history
     */
    public function show($id)
    {
        $user = User::where('id', $id)
            ->where('role', 'user')
            ->with(['infoPengguna' => function ($query) {
                $query->where('aktif', true);
            }])
            ->withCount('pesanan')
            ->firstOrFail();
        
        $activeInfo = $user->infoPengguna->first();
        
        $orders = $user->pesanan()
            ->with(['itemPesanan'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($pesanan) {
                return [
                    'id' => $pesanan->id,
                    'total_pembayaran' => $pesanan->total_pembayaran,
                    'status' => $pesanan->status,
                    'items_count' => $pesanan->itemPesanan->sum('kuantitas'),
                    'created_at' => $pesanan->created_at->format('d M Y'),
                ];
            });
        
        $pembeli = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $activeInfo?->nomor_telepon ?? '-',
            'address' => $activeInfo?->alamat ?? '-',
            'orders_count' => $user->pesanan_count,
            'created_at' => $user->created_at->format('d M Y'),
        ];
        
        return Inertia::render('Admin/Pembeli/Show', [
            'pembeli' => $pembeli,
            'orders' => $orders,
        ]);
    }
}
