import { Head, Link, router } from '@inertiajs/react';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import Button from '@/Components/ui/Button';
import toast from 'react-hot-toast';

export default function Wishlist({ items, totalItems }) {
    const [deletingIds, setDeletingIds] = useState([]);
    const [addingToCartIds, setAddingToCartIds] = useState([]);

    // Format price to Rupiah
    const formatRupiah = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleDelete = (id) => {
        setDeletingIds([...deletingIds, id]);
        
        router.delete(route('wishlist.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Produk dihapus dari wishlist');
            },
            onError: () => {
                toast.error('Gagal menghapus produk');
            },
            onFinish: () => {
                setDeletingIds(deletingIds.filter(i => i !== id));
            },
        });
    };

    const handleAddToCart = (item) => {
        setAddingToCartIds([...addingToCartIds, item.varian_produk_id]);
        
        router.post(route('keranjang.store'), {
            varian_produk_id: item.varian_produk_id,
            kuantitas: 1,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Produk ditambahkan ke keranjang');
            },
            onError: (errors) => {
                toast.error(errors.error || 'Gagal menambahkan ke keranjang');
            },
            onFinish: () => {
                setAddingToCartIds(addingToCartIds.filter(i => i !== item.varian_produk_id));
            },
        });
    };

    return (
        <UserLayout>
            <Head title="Wishlist - Angel Cake'S" />

            <section className="pt-28 pb-12 px-4 min-h-screen">
                <div className="container mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/produk" className="btn btn-ghost btn-circle">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <Heart className="w-8 h-8 text-pink-500" />
                                Wishlist
                            </h1>
                            <p className="text-gray-600">{totalItems} produk tersimpan</p>
                        </div>
                    </div>

                    {items.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
                                        deletingIds.includes(item.id) ? 'opacity-50' : ''
                                    }`}
                                >
                                    <Link href={`/produk/${item.varian_produk_id}`} className="block relative overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {item.stock > 0 ? (
                                            <div className="absolute bottom-3 left-3 bg-green-500/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                                <span className="text-white font-semibold text-xs">Stok: {item.stock}</span>
                                            </div>
                                        ) : (
                                            <div className="absolute bottom-3 left-3 bg-red-500/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                                <span className="text-white font-semibold text-xs">Habis</span>
                                            </div>
                                        )}
                                        
                                        {/* Remove Button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleDelete(item.id);
                                            }}
                                            className="absolute top-3 right-3 btn btn-circle btn-sm bg-white/90 hover:bg-red-500 hover:text-white border-none transition-colors"
                                            disabled={deletingIds.includes(item.id)}
                                        >
                                            {deletingIds.includes(item.id) ? (
                                                <span className="loading loading-spinner loading-xs"></span>
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </Link>
                                    
                                    <div className="p-4">
                                        <div className="text-xs text-pink-500 font-semibold mb-1">{item.category}</div>
                                        <Link href={`/produk/${item.varian_produk_id}`}>
                                            <h3 className="font-bold mb-2 line-clamp-2 hover:text-pink-500 transition-colors">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <div className="text-lg font-bold text-pink-500 mb-3">
                                            {formatRupiah(item.price)}
                                        </div>
                                        <div className="text-xs text-gray-400 mb-3">
                                            Ditambahkan: {item.created_at}
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="btn btn-primary btn-sm w-full rounded-full gap-2"
                                            disabled={item.stock === 0 || addingToCartIds.includes(item.varian_produk_id)}
                                        >
                                            {addingToCartIds.includes(item.varian_produk_id) ? (
                                                <>
                                                    <span className="loading loading-spinner loading-xs"></span>
                                                    Menambahkan...
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="w-4 h-4" />
                                                    {item.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty Wishlist */
                        <div className="text-center py-20">
                            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <Heart className="w-12 h-12 text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Wishlist Kosong</h2>
                            <p className="text-gray-600 mb-8">
                                Anda belum menambahkan produk ke wishlist
                            </p>
                            <Link href="/produk">
                                <Button variant="primary">
                                    Jelajahi Produk
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </UserLayout>
    );
}
