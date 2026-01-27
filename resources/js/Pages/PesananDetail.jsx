import { Head, Link, router } from '@inertiajs/react';
import { Package, MapPin, Truck, CheckCircle, Clock, AlertCircle, ArrowLeft, ShoppingBag, CreditCard, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import Button from '@/Components/ui/Button';
import toast from 'react-hot-toast';

export default function PesananDetail({ order, items, midtransClientKey }) {
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const [isSnapReady, setIsSnapReady] = useState(false);
    const [isConfirmingDelivery, setIsConfirmingDelivery] = useState(false);

    // Format price to Rupiah
    const formatRupiah = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: { label: 'Menunggu Pembayaran', color: 'badge-warning', icon: Clock },
            processing: { label: 'Diproses', color: 'badge-info', icon: Package },
            shipped: { label: 'Dikirim', color: 'badge-primary', icon: Truck },
            delivered: { label: 'Selesai', color: 'badge-success', icon: CheckCircle },
            cancelled: { label: 'Dibatalkan', color: 'badge-error', icon: AlertCircle },
        };
        return statusMap[status] || statusMap.pending;
    };

    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;

    // Load Midtrans Snap script
    useEffect(() => {
        if (order.snap_token && order.status === 'pending' && midtransClientKey) {
            // Check if script already exists
            const existingScript = document.querySelector('script[src*="midtrans"]');
            if (existingScript) {
                setIsSnapReady(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
            script.setAttribute('data-client-key', midtransClientKey);
            script.async = true;
            
            script.onload = () => {
                setIsSnapReady(true);
            };
            
            script.onerror = () => {
                console.error('Failed to load Midtrans Snap script');
                toast.error('Gagal memuat sistem pembayaran');
            };

            document.head.appendChild(script);

            return () => {
                // Don't remove script on cleanup as it might still be needed
            };
        }
    }, [order.snap_token, midtransClientKey, order.status]);

    const handlePayment = () => {
        if (!order.snap_token) {
            toast.error('Token pembayaran tidak tersedia');
            return;
        }

        if (!window.snap) {
            toast.error('Sistem pembayaran belum siap, silakan refresh halaman');
            return;
        }

        setIsPaymentLoading(true);

        window.snap.pay(order.snap_token, {
            onSuccess: function(result) {
                console.log('Payment success:', result);
                toast.success('Pembayaran berhasil!');
                // Reload page to get updated status
                window.location.reload();
            },
            onPending: function(result) {
                console.log('Payment pending:', result);
                toast.info('Menunggu pembayaran...');
                setIsPaymentLoading(false);
            },
            onError: function(result) {
                console.log('Payment error:', result);
                toast.error('Pembayaran gagal');
                setIsPaymentLoading(false);
            },
            onClose: function() {
                console.log('Payment popup closed');
                setIsPaymentLoading(false);
            }
        });
    };

    // Handle confirm delivery - user confirms order received
    const handleConfirmDelivery = () => {
        setIsConfirmingDelivery(true);
        
        router.post(route('pesanan.confirm', order.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Pesanan berhasil dikonfirmasi!');
            },
            onError: () => {
                toast.error('Gagal mengonfirmasi pesanan');
            },
            onFinish: () => {
                setIsConfirmingDelivery(false);
            },
        });
    };

    return (
        <UserLayout>
            <Head title={`Detail Pesanan - Angel Cake'S`} />

            <section className="pt-28 pb-12 px-4 min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/pesanan" className="btn btn-ghost btn-circle">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Detail Pesanan</h1>
                            <p className="text-gray-600 text-sm">ID: {order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                    </div>

                    {/* Success/Pending Banner */}
                    {order.status === 'pending' ? (
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold">Menunggu Pembayaran</h2>
                                    <p className="opacity-90">Silakan selesaikan pembayaran Anda</p>
                                </div>
                                {order.snap_token && (
                                    <Button
                                        variant="secondary"
                                        onClick={handlePayment}
                                        disabled={isPaymentLoading}
                                        loading={isPaymentLoading}
                                        className="bg-white text-orange-600 hover:bg-gray-100"
                                    >
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        {isPaymentLoading ? 'Memproses...' : 'Bayar Sekarang'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : order.status === 'processing' ? (
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6 text-white mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                    <Package className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Pembayaran Berhasil!</h2>
                                    <p className="opacity-90">Pesanan sedang diproses</p>
                                </div>
                            </div>
                        </div>
                    ) : order.status === 'shipped' ? (
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-8">
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                    <Truck className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold">Pesanan Sedang Dikirim!</h2>
                                    <p className="opacity-90">Konfirmasi jika pesanan sudah diterima</p>
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={handleConfirmDelivery}
                                    disabled={isConfirmingDelivery}
                                    loading={isConfirmingDelivery}
                                    className="bg-white text-purple-600 hover:bg-gray-100"
                                >
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    {isConfirmingDelivery ? 'Memproses...' : 'Konfirmasi Diterima'}
                                </Button>
                            </div>
                        </div>
                    ) : order.status === 'delivered' ? (
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white mb-8">
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold">Pesanan Selesai!</h2>
                                    <p className="opacity-90">{order.created_at}</p>
                                </div>
                                <Link href={route('ulasan.create', order.id)}>
                                    <Button
                                        variant="secondary"
                                        className="bg-white text-green-600 hover:bg-gray-100"
                                    >
                                        <Star className="w-5 h-5 mr-2" />
                                        Beri Ulasan
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : null}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left - Order Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Status */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="font-bold mb-4">Status Pesanan</h3>
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        order.status === 'delivered' ? 'bg-green-100' : 
                                        order.status === 'cancelled' ? 'bg-red-100' : 
                                        order.status === 'processing' ? 'bg-blue-100' : 'bg-yellow-100'
                                    }`}>
                                        <StatusIcon className={`w-6 h-6 ${
                                            order.status === 'delivered' ? 'text-green-600' : 
                                            order.status === 'cancelled' ? 'text-red-600' : 
                                            order.status === 'processing' ? 'text-blue-600' : 'text-yellow-600'
                                        }`} />
                                    </div>
                                    <div>
                                        <span className={`badge ${statusInfo.color}`}>{statusInfo.label}</span>
                                        <p className="text-sm text-gray-500 mt-1">Dibuat: {order.created_at}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-pink-500" />
                                    Daftar Pesanan
                                </h3>
                                
                                <div className="divide-y">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold line-clamp-2">{item.name}</h4>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {formatRupiah(item.price)} x {item.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-pink-500">
                                                    {formatRupiah(item.subtotal)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-pink-500" />
                                    Alamat Pengiriman
                                </h3>
                                <p className="text-gray-700 whitespace-pre-line">{order.alamat}</p>
                                {order.kecamatan && (
                                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                                        <Truck className="w-4 h-4" />
                                        <span>Pengiriman ke {order.kecamatan}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right - Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
                                <h3 className="font-bold mb-4">Ringkasan Pembayaran</h3>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span>{formatRupiah(order.total_harga)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Ongkos Kirim</span>
                                        <span>{formatRupiah(order.ongkir)}</span>
                                    </div>
                                    <div className="divider my-2"></div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-pink-500">{formatRupiah(order.total_pembayaran)}</span>
                                    </div>
                                </div>

                                {/* Payment Button for Pending Orders */}
                                {order.status === 'pending' && order.snap_token && (
                                    <Button
                                        variant="primary"
                                        className="w-full mt-6"
                                        onClick={handlePayment}
                                        disabled={isPaymentLoading}
                                        loading={isPaymentLoading}
                                    >
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        {isPaymentLoading ? 'Memproses...' : 'Bayar Sekarang'}
                                    </Button>
                                )}

                                <div className="mt-6 space-y-3">
                                    <Link href="/pesanan" className="btn btn-outline w-full">
                                        Lihat Semua Pesanan
                                    </Link>
                                    <Link href="/produk">
                                        <Button variant="ghost" className="w-full">
                                            Belanja Lagi
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </UserLayout>
    );
}
