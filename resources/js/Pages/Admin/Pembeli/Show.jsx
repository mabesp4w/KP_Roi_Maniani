import { Head, Link } from '@inertiajs/react';
import { User, ArrowLeft, Mail, Phone, MapPin, ShoppingBag, Calendar, Package, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function PembeliShow({ auth, pembeli, orders }) {
    const formatRupiah = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: { label: 'Menunggu', color: 'badge-warning', icon: Clock },
            processing: { label: 'Diproses', color: 'badge-info', icon: Package },
            shipped: { label: 'Dikirim', color: 'badge-primary', icon: Truck },
            delivered: { label: 'Selesai', color: 'badge-success', icon: CheckCircle },
            cancelled: { label: 'Dibatalkan', color: 'badge-error', icon: AlertCircle },
        };
        return statusMap[status] || statusMap.pending;
    };

    return (
        <AdminLayout auth={auth} header="Detail Pembeli">
            <Head title={`${pembeli.name} - Admin Panel`} />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href={route('admin.pembeli.index')} className="btn btn-ghost btn-circle">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Detail Pembeli</h1>
                        <p className="text-gray-500 text-sm">Informasi lengkap pembeli</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="text-center mb-6">
                                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-3xl font-bold text-white">
                                        {pembeli.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold">{pembeli.name}</h2>
                                <p className="text-gray-500 text-sm">Pembeli</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm">{pembeli.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm">{pembeli.phone}</span>
                                </div>
                                <div className="flex items-start gap-3 text-gray-600">
                                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">{pembeli.address}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm">Bergabung {pembeli.created_at}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Total Pesanan</span>
                                    <div className="flex items-center gap-2">
                                        <ShoppingBag className="w-5 h-5 text-pink-500" />
                                        <span className="text-xl font-bold">{pembeli.orders_count}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-6 border-b">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-pink-500" />
                                    Riwayat Pesanan
                                </h3>
                            </div>

                            {orders.length > 0 ? (
                                <div className="divide-y">
                                    {orders.map((order) => {
                                        const statusInfo = getStatusInfo(order.status);
                                        const StatusIcon = statusInfo.icon;
                                        
                                        return (
                                            <div key={order.id} className="p-4 hover:bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-semibold">
                                                            #{order.id.slice(0, 8).toUpperCase()}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {order.items_count} item • {order.created_at}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-pink-500">
                                                            {formatRupiah(order.total_pembayaran)}
                                                        </p>
                                                        <span className={`badge ${statusInfo.color} gap-1`}>
                                                            <StatusIcon className="w-3 h-3" />
                                                            {statusInfo.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">Belum ada pesanan</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
