import { Head, Link, router } from '@inertiajs/react';
import { Package, Search, Eye, ChevronLeft, ChevronRight, Clock, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function PesananIndex({ orders, filters }) {
    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);

    const formatRupiah = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: { label: 'Pending', color: 'badge-warning', icon: Clock },
            processing: { label: 'Diproses', color: 'badge-info', icon: Package },
            shipped: { label: 'Dikirim', color: 'badge-primary', icon: Truck },
            delivered: { label: 'Selesai', color: 'badge-success', icon: CheckCircle },
            cancelled: { label: 'Dibatalkan', color: 'badge-error', icon: AlertCircle },
        };
        return statusMap[status] || statusMap.pending;
    };

    const handleFilter = () => {
        router.get(route('admin.pesanan.index'), {
            search: search,
            status: status,
        }, { preserveState: true });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleFilter();
        }
    };

    return (
        <AdminLayout>
            <Head title="Kelola Pesanan - Admin" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Package className="w-7 h-7 text-pink-500" />
                            Kelola Pesanan
                        </h1>
                        <p className="text-gray-600 mt-1">Kelola semua pesanan pelanggan</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[200px]">
                            <label className="label">
                                <span className="label-text text-sm">Cari Pesanan</span>
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Cari ID atau nama pelanggan..."
                                    className="input input-bordered w-full pl-10"
                                />
                            </div>
                        </div>
                        <div className="w-48">
                            <label className="label">
                                <span className="label-text text-sm">Status</span>
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="select select-bordered w-full"
                            >
                                <option value="all">Semua Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Diproses</option>
                                <option value="shipped">Dikirim</option>
                                <option value="delivered">Selesai</option>
                                <option value="cancelled">Dibatalkan</option>
                            </select>
                        </div>
                        <button onClick={handleFilter} className="btn btn-primary">
                            <Search className="w-4 h-4" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th>ID Pesanan</th>
                                    <th>Pelanggan</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Tanggal</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.data.length > 0 ? (
                                    orders.data.map((order) => {
                                        const statusInfo = getStatusInfo(order.status);
                                        return (
                                            <tr key={order.id} className="hover">
                                                <td className="font-mono text-sm">
                                                    #{order.id.slice(0, 8).toUpperCase()}
                                                </td>
                                                <td>
                                                    <div>
                                                        <div className="font-semibold">{order.customer_name}</div>
                                                        <div className="text-sm text-gray-500">{order.customer_email}</div>
                                                    </div>
                                                </td>
                                                <td>{order.items_count} item</td>
                                                <td className="font-semibold text-pink-500">
                                                    {formatRupiah(order.total_pembayaran)}
                                                </td>
                                                <td>
                                                    <span className={`badge ${statusInfo.color} gap-1`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </td>
                                                <td className="text-sm">{order.created_at}</td>
                                                <td>
                                                    <Link
                                                        href={route('admin.pesanan.show', order.id)}
                                                        className="btn btn-ghost btn-sm"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-gray-500">
                                            Tidak ada pesanan ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {orders.last_page > 1 && (
                        <div className="flex justify-center items-center gap-2 p-4 border-t">
                            {orders.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`btn btn-sm ${link.active ? 'btn-primary' : 'btn-ghost'} ${!link.url ? 'btn-disabled' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
