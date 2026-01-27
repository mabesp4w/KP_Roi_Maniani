import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Package,
    Tag,
    ShoppingCart,
    Star,
    TrendingUp,
    DollarSign,
    Clock,
    CheckCircle,
    Truck,
    AlertCircle,
    Eye,
    Image as ImageIcon,
    Layers,
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import Card, { CardBody, CardHeader, CardTitle } from '@/Components/ui/Card';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import { useState } from 'react';

export default function Show({
    varianProduk,
    gambar,
    statistik,
    recentOrders,
    ulasans,
    otherVariants,
}) {
    const [selectedImage, setSelectedImage] = useState(gambar[0]?.url || null);

    const formatRupiah = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
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

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <AdminLayout header="Detail Varian Produk">
            <Head title={`${varianProduk.produk.nama_produk} - ${varianProduk.nama_varian}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('admin.varian-produk.index')} className="btn btn-ghost btn-circle">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{varianProduk.produk.nama_produk}</h1>
                        <p className="text-gray-500 flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            {varianProduk.nama_atribut}: {varianProduk.nama_varian}
                        </p>
                    </div>
                    <Badge variant={varianProduk.stok > 0 ? 'success' : 'error'} className="text-lg px-4 py-2">
                        Stok: {varianProduk.stok} unit
                    </Badge>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <CardBody className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-blue-600 font-medium">Harga</p>
                                    <p className="text-xl font-bold text-blue-700">
                                        {formatRupiah(varianProduk.harga)}
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                        <CardBody className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-emerald-600 font-medium">Total Terjual</p>
                                    <p className="text-xl font-bold text-emerald-700">
                                        {statistik.totalTerjual} unit
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                        <CardBody className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <ShoppingCart className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-purple-600 font-medium">Total Pendapatan</p>
                                    <p className="text-xl font-bold text-purple-700">
                                        {formatRupiah(statistik.totalPendapatan)}
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                        <CardBody className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <Star className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-amber-600 font-medium">Rating</p>
                                    <p className="text-xl font-bold text-amber-700">
                                        {statistik.averageRating} / 5
                                        <span className="text-sm font-normal ml-1">
                                            ({statistik.totalReviews} ulasan)
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Images & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Images */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-pink-500" />
                                    Gambar Produk
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                {gambar.length > 0 ? (
                                    <div className="space-y-4">
                                        {/* Main Image */}
                                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                                            <img
                                                src={selectedImage}
                                                alt={varianProduk.nama_varian}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* Thumbnail Gallery */}
                                        {gambar.length > 1 && (
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {gambar.map((img) => (
                                                    <button
                                                        key={img.id}
                                                        onClick={() => setSelectedImage(img.url)}
                                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                            selectedImage === img.url
                                                                ? 'border-pink-500 ring-2 ring-pink-200'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <img
                                                            src={img.url}
                                                            alt={`Thumbnail ${img.posisi}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center">
                                        <div className="text-center text-gray-400">
                                            <ImageIcon className="w-16 h-16 mx-auto mb-2" />
                                            <p>Tidak ada gambar</p>
                                        </div>
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        {/* Product Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="w-5 h-5 text-pink-500" />
                                    Deskripsi Produk
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                {varianProduk.deskripsi ? (
                                    <p className="text-gray-700 whitespace-pre-line">{varianProduk.deskripsi}</p>
                                ) : (
                                    <p className="text-gray-400 italic">Tidak ada deskripsi</p>
                                )}
                            </CardBody>
                        </Card>

                        {/* Recent Orders */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-blue-500" />
                                    Pesanan Terbaru
                                </CardTitle>
                            </CardHeader>
                            <CardBody className="p-0">
                                {recentOrders.length > 0 ? (
                                    <div className="divide-y">
                                        {recentOrders.map((order) => {
                                            const status = getStatusBadge(order.status);
                                            return (
                                                <Link
                                                    key={order.id}
                                                    href={route('admin.pesanan.show', order.id)}
                                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                                >
                                                    <div>
                                                        <p className="font-medium">{order.customer}</p>
                                                        <p className="text-sm text-gray-500">{order.date}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">
                                                            {order.quantity} x {formatRupiah(varianProduk.harga)}
                                                        </p>
                                                        <Badge variant={status.variant}>{status.label}</Badge>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p>Belum ada pesanan</p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </div>

                    {/* Right Column - Info & Other Variants */}
                    <div className="space-y-6">
                        {/* Product Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Produk</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-4">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-500">Produk</span>
                                        <span className="font-medium">{varianProduk.produk.nama_produk}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-500">Kategori</span>
                                        <Badge variant="primary">{varianProduk.produk.kategori}</Badge>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-500">Atribut</span>
                                        <span className="font-medium">{varianProduk.nama_atribut}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-500">Varian</span>
                                        <span className="font-medium">{varianProduk.nama_varian}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-500">Harga</span>
                                        <span className="font-bold text-pink-500">{formatRupiah(varianProduk.harga)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-500">Stok</span>
                                        <Badge variant={varianProduk.stok > 10 ? 'success' : varianProduk.stok > 0 ? 'warning' : 'error'}>
                                            {varianProduk.stok} unit
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-500">Dibuat</span>
                                        <span className="text-sm">{varianProduk.created_at}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-500">Diperbarui</span>
                                        <span className="text-sm">{varianProduk.updated_at}</span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Other Variants */}
                        {otherVariants.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Layers className="w-5 h-5 text-teal-500" />
                                        Varian Lain
                                    </CardTitle>
                                </CardHeader>
                                <CardBody className="p-0">
                                    <div className="divide-y">
                                        {otherVariants.map((variant) => (
                                            <Link
                                                key={variant.id}
                                                href={route('admin.varian-produk.show', variant.id)}
                                                className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                    {variant.image ? (
                                                        <img
                                                            src={variant.image}
                                                            alt={variant.nama_varian}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-gray-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{variant.nama_varian}</p>
                                                    <p className="text-sm text-gray-500">{variant.nama_atribut}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-pink-500">
                                                        {formatRupiah(variant.harga)}
                                                    </p>
                                                    <Badge variant={variant.stok > 0 ? 'success' : 'error'} className="text-xs">
                                                        {variant.stok} unit
                                                    </Badge>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </CardBody>
                            </Card>
                        )}

                        {/* Reviews */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500" />
                                    Ulasan Terbaru
                                </CardTitle>
                            </CardHeader>
                            <CardBody className="p-0">
                                {ulasans.length > 0 ? (
                                    <div className="divide-y">
                                        {ulasans.map((ulasan) => (
                                            <div key={ulasan.id} className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium">{ulasan.user}</span>
                                                    <span className="text-xs text-gray-400">{ulasan.date}</span>
                                                </div>
                                                <div className="flex items-center gap-1 mb-2">
                                                    {renderStars(ulasan.rating)}
                                                </div>
                                                {ulasan.komentar && (
                                                    <p className="text-sm text-gray-600">{ulasan.komentar}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <p>Belum ada ulasan</p>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>

                {/* Back Button */}
                <div className="flex justify-start">
                    <Link href={route('admin.varian-produk.index')}>
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Daftar
                        </Button>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
