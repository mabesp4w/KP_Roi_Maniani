import { Head, Link, router } from '@inertiajs/react';
import { Package, ArrowLeft, MapPin, Truck, Clock, CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/ui/Button';
import toast from 'react-hot-toast';

export default function PesananShow({ order, items }) {
    const [selectedStatus, setSelectedStatus] = useState(order.status);
    const [isUpdating, setIsUpdating] = useState(false);

    const formatRupiah = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: { label: 'Menunggu Pembayaran', color: 'badge-warning', icon: Clock, bg: 'bg-yellow-100', text: 'text-yellow-600' },
            processing: { label: 'Diproses', color: 'badge-info', icon: Package, bg: 'bg-blue-100', text: 'text-blue-600' },
            shipped: { label: 'Dikirim', color: 'badge-primary', icon: Truck, bg: 'bg-pink-100', text: 'text-pink-600' },
            delivered: { label: 'Selesai', color: 'badge-success', icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-600' },
            cancelled: { label: 'Dibatalkan', color: 'badge-error', icon: AlertCircle, bg: 'bg-red-100', text: 'text-red-600' },
        };
        return statusMap[status] || statusMap.pending;
    };

    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;

    const handleUpdateStatus = () => {
        if (selectedStatus === order.status) {
            toast.info('Status tidak berubah');
            return;
        }

        setIsUpdating(true);
        router.put(route('admin.pesanan.updateStatus', order.id), {
            status: selectedStatus,
        }, {
            onSuccess: () => {
                toast.success('Status pesanan berhasil diperbarui');
            },
            onError: () => {
                toast.error('Gagal memperbarui status');
            },
            onFinish: () => {
                setIsUpdating(false);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title={`Detail Pesanan - Admin`} />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href={route('admin.pesanan.index')} className="btn btn-ghost btn-circle">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Detail Pesanan</h1>
                        <p className="text-gray-600">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${statusInfo.bg}`}>
                        <div className="flex items-center gap-2">
                            <StatusIcon className={`w-5 h-5 ${statusInfo.text}`} />
                            <span className={`font-semibold ${statusInfo.text}`}>{statusInfo.label}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left - Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Info */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="font-bold mb-4">Informasi Pelanggan</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Nama</p>
                                    <p className="font-semibold">{order.customer_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold">{order.customer_email}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-500">Tanggal Pesanan</p>
                                    <p className="font-semibold">{order.created_at}</p>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
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

                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
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
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold">{item.name}</h4>
                                            <p className="text-sm text-gray-500">
                                                {formatRupiah(item.price)} x {item.quantity}
                                            </p>
                                            {item.deskripsi && (
                                                <p className="text-sm text-gray-400 mt-1">
                                                    Catatan: {item.deskripsi}
                                                </p>
                                            )}
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
                    </div>

                    {/* Right - Summary & Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Payment Summary */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
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
                        </div>

                        {/* Update Status */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="font-bold mb-4">Update Status</h3>
                            
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="select select-bordered w-full mb-4"
                            >
                                <option value="pending">Menunggu Pembayaran</option>
                                <option value="processing">Diproses</option>
                                <option value="shipped">Dikirim</option>
                                <option value="delivered">Selesai</option>
                                <option value="cancelled">Dibatalkan</option>
                            </select>
                            
                            <Button
                                variant="primary"
                                className="w-full"
                                onClick={handleUpdateStatus}
                                disabled={isUpdating || selectedStatus === order.status}
                                loading={isUpdating}
                            >
                                Update Status
                            </Button>

                            {selectedStatus === 'cancelled' && order.status !== 'cancelled' && (
                                <p className="text-xs text-red-500 mt-2">
                                    ⚠️ Membatalkan pesanan akan mengembalikan stok produk
                                </p>
                            )}
                        </div>

                        {/* Order Info */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="font-bold mb-4">Info Pesanan</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">ID Pesanan</span>
                                    <span className="font-mono">{order.id.slice(0, 8).toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Dibuat</span>
                                    <span>{order.created_at}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Terakhir Update</span>
                                    <span>{order.updated_at}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Snap Token</span>
                                    <span className="font-mono text-xs">
                                        {order.snap_token ? order.snap_token.slice(0, 10) + '...' : '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
