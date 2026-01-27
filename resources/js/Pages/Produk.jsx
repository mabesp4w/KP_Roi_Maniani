import { Head, Link, router, usePage } from '@inertiajs/react';
import { ShoppingCart, Heart, Search, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Pagination from '@/Components/ui/Pagination';
import UserLayout from '@/Layouts/UserLayout';
import toast from 'react-hot-toast';

export default function Produk({ products, categories, filters }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.kategori_id || '');
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [wishlistIds, setWishlistIds] = useState([]);
    const [togglingIds, setTogglingIds] = useState([]);

    // Format price to Rupiah
    const formatRupiah = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/produk', {
            search: search,
            kategori_id: selectedCategory,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleCategoryFilter = (kategoriId) => {
        setSelectedCategory(kategoriId);
        router.get('/produk', {
            search: search,
            kategori_id: kategoriId,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setSelectedCategory('');
        router.get('/produk', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Fetch wishlist IDs
    useEffect(() => {
        const fetchWishlistIds = async () => {
            if (auth?.user) {
                try {
                    const response = await fetch('/api/wishlist/ids');
                    const data = await response.json();
                    setWishlistIds(data.ids || []);
                } catch (error) {
                    console.error('Failed to fetch wishlist:', error);
                }
            }
        };
        
        fetchWishlistIds();
    }, [auth]);

    const handleToggleWishlist = (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!auth?.user) {
            toast.error('Silakan login terlebih dahulu');
            router.visit(route('login'));
            return;
        }

        setTogglingIds([...togglingIds, productId]);
        
        router.post(route('wishlist.toggle'), {
            varian_produk_id: productId,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                if (wishlistIds.includes(productId)) {
                    setWishlistIds(wishlistIds.filter(id => id !== productId));
                    toast.success('Dihapus dari wishlist');
                } else {
                    setWishlistIds([...wishlistIds, productId]);
                    toast.success('Ditambahkan ke wishlist');
                }
            },
            onError: () => {
                toast.error('Gagal mengubah wishlist');
            },
            onFinish: () => {
                setTogglingIds(togglingIds.filter(id => id !== productId));
            },
        });
    };

    return (
        <UserLayout>
            <Head title="Produk - Angel Cake'S" />
            
            {/* Hero Section */}
            <section className="pt-32 pb-12 px-4">
                <div className="container mx-auto text-center" data-aos="fade-down">
                    <h1 className="text-5xl font-bold mb-4">
                        Semua <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Produk Kami</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Temukan kue favorit Anda dari koleksi lengkap kami
                    </p>
                </div>
            </section>

                {/* Main Content */}
                <section className="pb-20 px-4">
                    <div className="container mx-auto">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Sidebar - Desktop */}
                            <aside className="hidden lg:block w-64 flex-shrink-0">
                                <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24" data-aos="fade-right">
                                    <h3 className="text-xl font-bold mb-4">Filter</h3>
                                    
                                    {/* Search */}
                                    <form onSubmit={handleSearch} className="mb-6">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                placeholder="Cari produk..."
                                                className="input input-bordered w-full pr-10"
                                            />
                                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <Search className="w-5 h-5 text-gray-400" />
                                            </button>
                                        </div>
                                    </form>

                                    {/* Categories */}
                                    <div>
                                        <h4 className="font-semibold mb-3">Kategori</h4>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => handleCategoryFilter('')}
                                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                                    !selectedCategory ? 'bg-pink-500 text-white' : 'hover:bg-gray-100'
                                                }`}
                                            >
                                                Semua Kategori
                                            </button>
                                            {categories.map((category) => (
                                                <button
                                                    key={category.id}
                                                    onClick={() => handleCategoryFilter(category.id)}
                                                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                                        selectedCategory == category.id ? 'bg-pink-500 text-white' : 'hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {category.nama_kategori} ({category.produks_count})
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Clear Filters */}
                                    {(search || selectedCategory) && (
                                        <button
                                            onClick={handleClearFilters}
                                            className="btn btn-outline btn-sm w-full mt-6"
                                        >
                                            <X className="w-4 h-4" />
                                            Hapus Filter
                                        </button>
                                    )}
                                </div>
                            </aside>

                            {/* Mobile Filter Button */}
                            <button
                                onClick={() => setShowMobileFilter(true)}
                                className="lg:hidden fixed bottom-6 right-6 z-40 btn btn-primary btn-circle btn-lg shadow-xl"
                            >
                                <Filter className="w-6 h-6" />
                            </button>

                            {/* Mobile Filter Modal */}
                            {showMobileFilter && (
                                <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileFilter(false)}>
                                    <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold">Filter</h3>
                                            <button onClick={() => setShowMobileFilter(false)} className="btn btn-circle btn-sm btn-ghost">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Search */}
                                        <form onSubmit={(e) => { handleSearch(e); setShowMobileFilter(false); }} className="mb-6">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    placeholder="Cari produk..."
                                                    className="input input-bordered w-full pr-10"
                                                />
                                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <Search className="w-5 h-5 text-gray-400" />
                                                </button>
                                            </div>
                                        </form>

                                        {/* Categories */}
                                        <div>
                                            <h4 className="font-semibold mb-3">Kategori</h4>
                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => { handleCategoryFilter(''); setShowMobileFilter(false); }}
                                                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                                        !selectedCategory ? 'bg-pink-500 text-white' : 'hover:bg-gray-100'
                                                    }`}
                                                >
                                                    Semua Kategori
                                                </button>
                                                {categories.map((category) => (
                                                    <button
                                                        key={category.id}
                                                        onClick={() => { handleCategoryFilter(category.id); setShowMobileFilter(false); }}
                                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                                            selectedCategory == category.id ? 'bg-pink-500 text-white' : 'hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {category.nama_kategori} ({category.produks_count})
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Clear Filters */}
                                        {(search || selectedCategory) && (
                                            <button
                                                onClick={() => { handleClearFilters(); setShowMobileFilter(false); }}
                                                className="btn btn-outline btn-sm w-full mt-6"
                                            >
                                                <X className="w-4 h-4" />
                                                Hapus Filter
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Products Grid */}
                            <div className="flex-1">
                                {/* Results Info */}
                                <div className="mb-6 flex items-center justify-between" data-aos="fade-left">
                                    <p className="text-gray-600">
                                        Menampilkan <span className="font-semibold">{products.data.length}</span> dari <span className="font-semibold">{products.total}</span> produk
                                    </p>
                                </div>

                                {/* Products */}
                                {products.data.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                            {products.data.map((product, index) => (
                                                <div
                                                    key={product.id}
                                                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                                                    data-aos="zoom-in"
                                                    data-aos-delay={index * 50}
                                                >
                                                    <Link href={`/produk/${product.id}`} className="block relative overflow-hidden">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                                            onError={(e) => {
                                                                e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop';
                                                            }}
                                                        />
                                                        <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
                                                            <button 
                                                                onClick={(e) => handleToggleWishlist(e, product.id)}
                                                                disabled={togglingIds.includes(product.id)}
                                                                className={`btn btn-circle btn-sm border-none transition-all ${
                                                                    wishlistIds.includes(product.id) 
                                                                        ? 'bg-pink-500 hover:bg-pink-600' 
                                                                        : 'bg-white/90 hover:bg-white'
                                                                }`}
                                                            >
                                                                {togglingIds.includes(product.id) ? (
                                                                    <span className="loading loading-spinner loading-xs"></span>
                                                                ) : (
                                                                    <Heart className={`w-4 h-4 ${wishlistIds.includes(product.id) ? 'text-white fill-current' : 'text-pink-500'}`} />
                                                                )}
                                                            </button>
                                                        </div>
                                                        {product.stock > 0 ? (
                                                            <div className="absolute bottom-4 left-4 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                                                <span className="text-white font-semibold text-sm">Stok: {product.stock}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="absolute bottom-4 left-4 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                                                <span className="text-white font-semibold text-sm">Habis</span>
                                                            </div>
                                                        )}
                                                    </Link>
                                                    <div className="p-6">
                                                        <div className="text-xs text-pink-500 font-semibold mb-2">{product.category}</div>
                                                        <Link href={`/produk/${product.id}`}>
                                                            <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-pink-500 transition-colors">{product.name}</h3>
                                                        </Link>
                                                        {product.description && (
                                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                                                        )}
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-2xl font-bold text-pink-500">{formatRupiah(product.price)}</span>
                                                            <button className="btn btn-primary btn-sm rounded-full gap-2" disabled={product.stock === 0}>
                                                                <ShoppingCart className="w-4 h-4" />
                                                                Pesan
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        <div data-aos="fade-up">
                                            <Pagination links={products.links} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-20" data-aos="fade-up">
                                        <div className="text-6xl mb-4">🔍</div>
                                        <h3 className="text-2xl font-bold mb-2">Produk Tidak Ditemukan</h3>
                                        <p className="text-gray-600 mb-6">Coba ubah filter atau kata kunci pencarian Anda</p>
                                        <button onClick={handleClearFilters} className="btn btn-primary">
                                            Lihat Semua Produk
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
        </UserLayout>
    );
}
