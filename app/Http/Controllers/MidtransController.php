<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use Illuminate\Http\Request;

class MidtransController extends Controller
{
    /**
     * Handle Midtrans notification callback
     */
    public function notification(Request $request)
    {
        \Midtrans\Config::$serverKey = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = config('midtrans.is_production');
        
        try {
            $notification = new \Midtrans\Notification();
            
            $orderId = $notification->order_id;
            $transactionStatus = $notification->transaction_status;
            $fraudStatus = $notification->fraud_status;
            
            $pesanan = Pesanan::find($orderId);
            
            if (!$pesanan) {
                return response()->json(['status' => 'Order not found'], 404);
            }
            
            if ($transactionStatus == 'capture') {
                if ($fraudStatus == 'challenge') {
                    $pesanan->status = 'pending';
                } else if ($fraudStatus == 'accept') {
                    $pesanan->status = 'processing';
                }
            } else if ($transactionStatus == 'settlement') {
                $pesanan->status = 'processing';
            } else if ($transactionStatus == 'pending') {
                $pesanan->status = 'pending';
            } else if ($transactionStatus == 'deny') {
                $pesanan->status = 'cancelled';
                // Restore stock
                $this->restoreStock($pesanan);
            } else if ($transactionStatus == 'expire') {
                $pesanan->status = 'cancelled';
                // Restore stock
                $this->restoreStock($pesanan);
            } else if ($transactionStatus == 'cancel') {
                $pesanan->status = 'cancelled';
                // Restore stock
                $this->restoreStock($pesanan);
            }
            
            $pesanan->save();
            
            return response()->json(['status' => 'OK']);
            
        } catch (\Exception $e) {
            \Log::error('Midtrans Notification Error: ' . $e->getMessage());
            return response()->json(['status' => 'Error'], 500);
        }
    }

    /**
     * Update payment status after Snap redirect
     */
    public function updateStatus(Request $request, $id)
    {
        $pesanan = Pesanan::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();
        
        $status = $request->status;
        
        if ($status === 'success') {
            $pesanan->status = 'processing';
            $pesanan->save();
            return back()->with('success', 'Pembayaran berhasil!');
        } else if ($status === 'pending') {
            return back()->with('info', 'Menunggu pembayaran');
        } else {
            return back()->with('error', 'Pembayaran gagal');
        }
    }

    /**
     * Restore stock when order is cancelled
     */
    private function restoreStock(Pesanan $pesanan)
    {
        foreach ($pesanan->itemPesanan as $item) {
            $item->varianProduk->increment('stok', $item->kuantitas);
        }
    }
}
