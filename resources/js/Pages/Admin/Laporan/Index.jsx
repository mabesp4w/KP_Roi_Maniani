import { Head, Link, router } from '@inertiajs/react';
import { BarChart3, Download, ShoppingBag, DollarSign, Clock, CheckCircle, TrendingUp, Package } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Button from '@/Components/ui/Button';

export default function LaporanIndex({ summary, ordersByStatus, dailySales, topProducts, recentOrders, filters }) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const formatRupiah = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: { label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-100' },
            processing: { label: 'Diproses', color: 'text-blue-600', bg: 'bg-blue-100' },
            shipped: { label: 'Dikirim', color: 'text-pink-600', bg: 'bg-pink-100' },
            delivered: { label: 'Selesai', color: 'text-green-600', bg: 'bg-green-100' },
            cancelled: { label: 'Dibatalkan', color: 'text-red-600', bg: 'bg-red-100' },
        };
        return statusMap[status] || statusMap.pending;
    };

    const handleFilter = () => {
        router.get(route('admin.laporan.index'), {
            start_date: startDate,
            end_date: endDate,
        }, { preserveState: true });
    };

    const handleExport = () => {
        window.location.href = route('admin.laporan.export') + `?start_date=${startDate}&end_date=${endDate}`;
    };

    // Calculate max for chart
    const maxDailySale = Math.max(...dailySales.map(d => d.total), 1);

    return (
        <AdminLayout>
            <Head title="Laporan Penjualan - Admin" />

            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <BarChart3 className="w-7 h-7 text-pink-500" />
                            Laporan Penjualan
                        </h1>
                        <p className="text-gray-600 mt-1">Statistik dan laporan penjualan</p>
                    </div>
                    <Button variant="primary" onClick={handleExport}>
                        <Download className="w-5 h-5 mr-2" />
                        Export CSV
                    </Button>
                </div>

                {/* Date Filter */}
                <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="label">
                                <span className="label-text text-sm">Dari Tanggal</span>
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="input input-bordered"
                            />
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text text-sm">Sampai Tanggal</span>
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="input input-bordered"
                            />
                        </div>
                        <button onClick={handleFilter} className="btn btn-primary">
                            Terapkan Filter
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-pink-100">Total Pendapatan</p>
                                <h3 className="text-2xl font-bold mt-1">{formatRupiah(summary.totalRevenue)}</h3>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100">Total Pesanan</p>
                                <h3 className="text-2xl font-bold mt-1">{summary.totalOrders}</h3>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-100">Pending</p>
                                <h3 className="text-2xl font-bold mt-1">{summary.pendingOrders}</h3>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">Selesai</p>
                                <h3 className="text-2xl font-bold mt-1">{summary.completedOrders}</h3>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Daily Sales Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-pink-500" />
                            Penjualan Harian
                        </h3>
                        
                        {dailySales.length > 0 ? (
                            <div className="space-y-3">
                                {dailySales.slice(-7).map((day, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <span className="w-20 text-sm text-gray-500">{day.date}</span>
                                        <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
                                                style={{ width: `${(day.total / maxDailySale) * 100}%` }}
                                            />
                                        </div>
                                        <span className="w-32 text-sm font-semibold text-right">
                                            {formatRupiah(day.total)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">Tidak ada data penjualan</p>
                        )}
                    </div>

                    {/* Orders by Status */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-pink-500" />
                            Pesanan per Status
                        </h3>
                        
                        <div className="space-y-3">
                            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => {
                                const info = getStatusInfo(status);
                                const count = ordersByStatus[status] || 0;
                                return (
                                    <div key={status} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${info.bg}`} />
                                            <span>{info.label}</span>
                                        </div>
                                        <span className={`font-bold ${info.color}`}>{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Products */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="font-bold mb-4">🏆 Produk Terlaris</h3>
                        
                        {topProducts.length > 0 ? (
                            <div className="space-y-3">
                                {topProducts.map((product, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                            index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                            index === 1 ? 'bg-gray-100 text-gray-600' :
                                            index === 2 ? 'bg-orange-100 text-orange-600' :
                                            'bg-gray-50 text-gray-500'
                                        }`}>
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">
                                                {product.nama_produk} - {product.nama_varian}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {product.total_sold} terjual
                                            </p>
                                        </div>
                                        <span className="font-bold text-pink-500">
                                            {formatRupiah(product.total_revenue)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">Tidak ada data produk</p>
                        )}
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="font-bold mb-4">📦 Pesanan Terbaru</h3>
                        
                        {recentOrders.length > 0 ? (
                            <div className="space-y-3">
                                {recentOrders.map((order, index) => {
                                    const info = getStatusInfo(order.status);
                                    return (
                                        <Link
                                            key={index}
                                            href={route('admin.pesanan.show', order.id)}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <div>
                                                <p className="font-semibold">{order.customer}</p>
                                                <p className="text-sm text-gray-500">{order.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-pink-500">{formatRupiah(order.total)}</p>
                                                <span className={`text-xs ${info.color}`}>{info.label}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">Tidak ada pesanan terbaru</p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
