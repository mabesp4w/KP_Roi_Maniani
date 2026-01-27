import { Head, Link, router } from '@inertiajs/react';
import { ShoppingCart, Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import Button from '@/Components/ui/Button';
import toast from 'react-hot-toast';

export default function Keranjang({ items, total, totalItems }) {
    const [updatingIds, setUpdatingIds] = useState([]);
    const [deletingIds, setDeletingIds] = useState([]);

    // Format price to Rupiah
    const formatRupiah = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleUpdateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        
        setUpdatingIds([...updatingIds, id]);
        
        router.put(route('keranjang.update', id), {
            kuantitas: newQuantity,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Keranjang diperbarui');
            },
            onError: (errors) => {
                toast.error(errors.error || 'Gagal memperbarui keranjang');
            },
            onFinish: () => {
                setUpdatingIds(updatingIds.filter(i => i !== id));
            },
        });
    };

    const handleDelete = (id) => {
        setDeletingIds([...deletingIds, id]);
        
        router.delete(route('keranjang.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Produk dihapus dari keranjang');
            },
            onError: () => {
                toast.error('Gagal menghapus produk');
            },
            onFinish: () => {
                setDeletingIds(deletingIds.filter(i => i !== id));
            },
        });
    };

    return (
        <UserLayout>
            <Head title="Keranjang - Angel Cake'S" />

            <section className="pt-28 pb-12 px-4 min-h-screen">
                <div className="container mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/produk" className="btn btn-ghost btn-circle">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Keranjang Belanja</h1>
                            <p className="text-gray-600">{totalItems} item dalam keranjang</p>
                        </div>
                    </div>

                    {items.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`bg-white rounded-2xl shadow-lg p-6 ${
                                            deletingIds.includes(item.id) ? 'opacity-50' : ''
                                        }`}
                                    >
                                        <div className="flex gap-4">
                                            {/* Image */}
                                            <Link 
                                                href={`/produk/${item.varian_produk_id}`}
                                                className="flex-shrink-0"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-24 h-24 object-cover rounded-lg"
                                                />
                                            </Link>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-pink-500 font-semibold mb-1">
                                                    {item.category}
                                                </div>
                                                <Link 
                                                    href={`/produk/${item.varian_produk_id}`}
                                                    className="font-bold text-lg hover:text-pink-500 transition-colors line-clamp-2"
                                                >
                                                    {item.name}
                                                </Link>
                                                <div className="text-pink-500 font-bold mt-1">
                                                    {formatRupiah(item.price)}
                                                </div>
                                                {item.stock < 10 && (
                                                    <div className="text-xs text-orange-500 mt-1">
                                                        Stok tersisa: {item.stock}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Quantity & Actions */}
                                            <div className="flex flex-col items-end gap-4">
                                                {/* Quantity */}
                                                <div className="flex items-center border rounded-lg">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                        className="btn btn-ghost btn-xs"
                                                        disabled={item.quantity <= 1 || updatingIds.includes(item.id)}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-10 text-center font-semibold">
                                                        {updatingIds.includes(item.id) ? '...' : item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                        className="btn btn-ghost btn-xs"
                                                        disabled={item.quantity >= item.stock || updatingIds.includes(item.id)}
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50"
                                                    disabled={deletingIds.includes(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    {deletingIds.includes(item.id) ? 'Menghapus...' : 'Hapus'}
                                                </button>

                                                {/* Subtotal */}
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-500">Subtotal</div>
                                                    <div className="font-bold text-lg">
                                                        {formatRupiah(item.subtotal)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
                                    <h2 className="text-xl font-bold mb-6">Ringkasan Pesanan</h2>
                                    
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal ({totalItems} item)</span>
                                            <span>{formatRupiah(total)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Ongkos Kirim</span>
                                            <span className="text-sm">Dihitung saat checkout</span>
                                        </div>
                                        <div className="divider my-2"></div>
                                        <div className="flex justify-between text-xl font-bold">
                                            <span>Total</span>
                                            <span className="text-pink-500">{formatRupiah(total)}</span>
                                        </div>
                                    </div>

                                    <Link href="/checkout" className="w-full">
                                        <Button variant="primary" className="w-full" disabled={items.length === 0}>
                                            <ShoppingBag className="w-5 h-5 mr-2" />
                                            Checkout
                                        </Button>
                                    </Link>

                                    <Link 
                                        href="/produk" 
                                        className="btn btn-outline w-full mt-3"
                                    >
                                        Lanjut Belanja
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Empty Cart */
                        <div className="text-center py-20">
                            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <ShoppingCart className="w-12 h-12 text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Keranjang Kosong</h2>
                            <p className="text-gray-600 mb-8">
                                Anda belum menambahkan produk ke keranjang
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
