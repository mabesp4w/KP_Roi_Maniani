import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import Card, { CardBody, CardHeader, CardTitle } from '@/Components/ui/Card';
import Badge from '@/Components/ui/Badge';
import {
    Users,
    Package,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    AlertTriangle,
    ArrowRight,
    BarChart3,
    Layers,
    Tag,
} from 'lucide-react';

export default function AdminDashboard({
    auth,
    statistik,
    chartData,
    produkTerlaris,
    pesananTerbaru,
    pembeliTerbaru,
    stokMenipis,
}) {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            pending: { label: 'Pending', variant: 'warning' },
            processing: { label: 'Diproses', variant: 'info' },
            shipped: { label: 'Dikirim', variant: 'primary' },
            delivered: { label: 'Selesai', variant: 'success' },
            cancelled: { label: 'Dibatalkan', variant: 'error' },
        };
        return statusMap[status] || statusMap.pending;
    };

    // Calculate max value for chart scaling
    const maxChartValue = Math.max(...chartData.map((d) => d.total), 1);

    return (
        <AdminLayout auth={auth} header="Dashboard Admin">
            <Head title="Dashboard Admin" />

            <div className="space-y-6">
                {/* Welcome Message */}
                <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Selamat datang, {auth.user.name}! 👋</h1>
                            <p className="text-pink-100 mt-1">
                                Berikut ringkasan aktivitas toko hari ini
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="text-right">
                                <p className="text-pink-100 text-sm">Pendapatan Hari Ini</p>
                                <p className="text-3xl font-bold">
                                    {formatRupiah(statistik.pendapatanHariIni)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards - Primary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Pendapatan */}
                    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-emerald-600 font-medium">Total Pendapatan</p>
                                    <p className="text-2xl font-bold text-emerald-700 mt-1">
                                        {formatRupiah(statistik.totalPendapatan)}
                                    </p>
                                    <p className="text-xs text-emerald-500 mt-1">
                                        Bulan ini: {formatRupiah(statistik.pendapatanBulanIni)}
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                                    <DollarSign className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Total Pesanan */}
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-600 font-medium">Total Pesanan</p>
                                    <p className="text-2xl font-bold text-blue-700 mt-1">
                                        {statistik.totalPesanan}
                                    </p>
                                    <p className="text-xs text-blue-500 mt-1">
                                        Hari ini: {statistik.pesananHariIni} pesanan
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                                    <ShoppingCart className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Total Pembeli */}
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-600 font-medium">Total Pembeli</p>
                                    <p className="text-2xl font-bold text-purple-700 mt-1">
                                        {statistik.totalPembeli}
                                    </p>
                                    <p className="text-xs text-purple-500 mt-1">
                                        Pelanggan terdaftar
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                                    <Users className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Total Produk */}
                    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                        <CardBody>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-orange-600 font-medium">Total Produk</p>
                                    <p className="text-2xl font-bold text-orange-700 mt-1">
                                        {statistik.totalProduk}
                                    </p>
                                    <p className="text-xs text-orange-500 mt-1">
                                        {statistik.totalVarianProduk} varian • {statistik.totalKategori} kategori
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                                    <Package className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Order Status Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardBody className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-yellow-600">{statistik.pesananPending}</p>
                                    <p className="text-xs text-gray-500">Pending</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardBody className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-blue-600">{statistik.pesananProcessing}</p>
                                    <p className="text-xs text-gray-500">Diproses</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardBody className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <Truck className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-indigo-600">{statistik.pesananShipped}</p>
                                    <p className="text-xs text-gray-500">Dikirim</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardBody className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-green-600">{statistik.pesananDelivered}</p>
                                    <p className="text-xs text-gray-500">Selesai</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardBody className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-red-600">{statistik.pesananCancelled}</p>
                                    <p className="text-xs text-gray-500">Dibatalkan</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Charts and Tables Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sales Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-pink-500" />
                                Penjualan 7 Hari Terakhir
                            </CardTitle>
                        </CardHeader>
                        <CardBody>
                            <div className="h-64 flex items-end gap-2">
                                {chartData.map((data, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full flex flex-col items-center">
                                            <span className="text-xs font-medium text-gray-600 mb-1">
                                                {data.jumlah_pesanan > 0 ? data.jumlah_pesanan : ''}
                                            </span>
                                            <div
                                                className="w-full bg-gradient-to-t from-pink-500 to-purple-500 rounded-t-lg transition-all duration-500 hover:from-pink-600 hover:to-purple-600"
                                                style={{
                                                    height: `${Math.max((data.total / maxChartValue) * 180, 4)}px`,
                                                }}
                                                title={`${formatRupiah(data.total)} (${data.jumlah_pesanan} pesanan)`}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">{data.tanggal}</span>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Top Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                Produk Terlaris
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="p-0">
                            <div className="divide-y">
                                {produkTerlaris.length > 0 ? (
                                    produkTerlaris.map((produk, index) => (
                                        <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">
                                                        {produk.nama_produk}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {produk.nama_varian}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-sm text-pink-600">
                                                        {produk.total_terjual} terjual
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatRupiah(produk.total_pendapatan)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                        <p className="text-sm">Belum ada data penjualan</p>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Orders */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-blue-500" />
                                Pesanan Terbaru
                            </CardTitle>
                            <Link
                                href={route('admin.pesanan.index')}
                                className="text-sm text-pink-500 hover:text-pink-600 flex items-center gap-1"
                            >
                                Lihat Semua <ArrowRight className="w-4 h-4" />
                            </Link>
                        </CardHeader>
                        <CardBody className="p-0">
                            <div className="divide-y">
                                {pesananTerbaru.length > 0 ? (
                                    pesananTerbaru.map((order) => {
                                        const status = getStatusBadge(order.status);
                                        return (
                                            <Link
                                                key={order.id}
                                                href={route('admin.pesanan.show', order.id)}
                                                className="block p-4 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-sm">{order.customer}</p>
                                                        <p className="text-xs text-gray-500">{order.created_at}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-sm">{formatRupiah(order.total)}</p>
                                                        <Badge variant={status.variant} className="text-xs">
                                                            {status.label}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                        <p className="text-sm">Belum ada pesanan</p>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>

                    {/* New Customers */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-500" />
                                Pembeli Baru
                            </CardTitle>
                            <Link
                                href={route('admin.pembeli.index')}
                                className="text-sm text-pink-500 hover:text-pink-600 flex items-center gap-1"
                            >
                                Lihat Semua <ArrowRight className="w-4 h-4" />
                            </Link>
                        </CardHeader>
                        <CardBody className="p-0">
                            <div className="divide-y">
                                {pembeliTerbaru.length > 0 ? (
                                    pembeliTerbaru.map((user) => (
                                        <Link
                                            key={user.id}
                                            href={route('admin.pembeli.show', user.id)}
                                            className="block p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                </div>
                                                <p className="text-xs text-gray-400">{user.created_at}</p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                        <p className="text-sm">Belum ada pembeli</p>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Low Stock Alert */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                Stok Menipis
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="p-0">
                            <div className="divide-y">
                                {stokMenipis.length > 0 ? (
                                    stokMenipis.map((item) => (
                                        <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{item.produk}</p>
                                                    <p className="text-xs text-gray-500 truncate">{item.varian}</p>
                                                </div>
                                                <Badge
                                                    variant={item.stok === 0 ? 'error' : 'warning'}
                                                    className="ml-2"
                                                >
                                                    {item.stok} unit
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-300" />
                                        <p className="text-sm">Semua stok aman</p>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Quick Links */}
                <Card>
                    <CardHeader>
                        <CardTitle>Akses Cepat</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            <Link
                                href={route('admin.pesanan.index')}
                                className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all hover:-translate-y-1"
                            >
                                <ShoppingCart className="w-8 h-8 text-blue-500 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Pesanan</span>
                            </Link>

                            <Link
                                href={route('admin.produk.index')}
                                className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl hover:shadow-md transition-all hover:-translate-y-1"
                            >
                                <Package className="w-8 h-8 text-orange-500 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Produk</span>
                            </Link>

                            <Link
                                href={route('admin.kategori.index')}
                                className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all hover:-translate-y-1"
                            >
                                <Tag className="w-8 h-8 text-purple-500 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Kategori</span>
                            </Link>

                            <Link
                                href={route('admin.varian-produk.index')}
                                className="flex flex-col items-center p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl hover:shadow-md transition-all hover:-translate-y-1"
                            >
                                <Layers className="w-8 h-8 text-teal-500 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Varian</span>
                            </Link>

                            <Link
                                href={route('admin.pembeli.index')}
                                className="flex flex-col items-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl hover:shadow-md transition-all hover:-translate-y-1"
                            >
                                <Users className="w-8 h-8 text-pink-500 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Pembeli</span>
                            </Link>

                            <Link
                                href={route('admin.laporan.index')}
                                className="flex flex-col items-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl hover:shadow-md transition-all hover:-translate-y-1"
                            >
                                <BarChart3 className="w-8 h-8 text-emerald-500 mb-2" />
                                <span className="text-sm font-medium text-gray-700">Laporan</span>
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </AdminLayout>
    );
}
