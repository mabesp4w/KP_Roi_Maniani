import { Head, Link } from '@inertiajs/react';
import { Package, Clock, Truck, CheckCircle, AlertCircle, ChevronRight, ShoppingBag } from 'lucide-react';
import UserLayout from '@/Layouts/UserLayout';
import Button from '@/Components/ui/Button';
import Pagination from '@/Components/ui/Pagination';

export default function Pesanan({ orders }) {
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

    return (
        <UserLayout>
            <Head title="Pesanan Saya - Angel Cake'S" />

            <section className="pt-28 pb-12 px-4 min-h-screen">
                <div className="container mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Package className="w-8 h-8 text-pink-500" />
                            Pesanan Saya
                        </h1>
                        <p className="text-gray-600 mt-1">Riwayat semua pesanan Anda</p>
                    </div>

                    {orders.data.length > 0 ? (
                        <>
                            <div className="space-y-4">
                                {orders.data.map((order) => {
                                    const statusInfo = getStatusInfo(order.status);
                                    const StatusIcon = statusInfo.icon;
                                    
                                    return (
                                        <Link
                                            key={order.id}
                                            href={`/pesanan/${order.id}`}
                                            className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                        order.status === 'delivered' ? 'bg-green-100' : 
                                                        order.status === 'cancelled' ? 'bg-red-100' : 'bg-yellow-100'
                                                    }`}>
                                                        <StatusIcon className={`w-6 h-6 ${
                                                            order.status === 'delivered' ? 'text-green-600' : 
                                                            order.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'
                                                        }`} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold">
                                                                #{order.id.slice(0, 8).toUpperCase()}
                                                            </span>
                                                            <span className={`badge ${statusInfo.color} badge-sm`}>
                                                                {statusInfo.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {order.created_at} • {order.items_count} item
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500">Total</p>
                                                        <p className="font-bold text-pink-500">
                                                            {formatRupiah(order.total_pembayaran)}
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            <div className="mt-8">
                                <Pagination links={orders.links} />
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <ShoppingBag className="w-12 h-12 text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Belum Ada Pesanan</h2>
                            <p className="text-gray-600 mb-8">
                                Anda belum memiliki riwayat pesanan
                            </p>
                            <Link href="/produk">
                                <Button variant="primary">
                                    Mulai Belanja
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </UserLayout>
    );
}
