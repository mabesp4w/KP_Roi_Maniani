import { Head, Link, router, usePage } from '@inertiajs/react';
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, Minus, Plus, Share2, Check, Star, MessageCircle, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import Button from '@/Components/ui/Button';
import toast from 'react-hot-toast';

export default function ProdukDetail({ product, otherVariants, relatedProducts }) {
    const { auth } = usePage().props;
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
    
    // Reviews state
    const [reviews, setReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState({ total: 0, average: 0 });
    const [isLoadingReviews, setIsLoadingReviews] = useState(true);

    // Format price to Rupiah
    const formatRupiah = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleQuantityChange = (action) => {
        if (action === 'increase' && quantity < product.stock) {
            setQuantity(quantity + 1);
        } else if (action === 'decrease' && quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    const handleAddToCart = () => {
        // Check if user is logged in
        if (!auth?.user) {
            toast.error('Silakan login terlebih dahulu');
            router.visit(route('login'));
            return;
        }

        setIsAddingToCart(true);
        
        router.post(route('keranjang.store'), {
            varian_produk_id: product.id,
            kuantitas: quantity,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Produk berhasil ditambahkan ke keranjang');
                setQuantity(1);
            },
            onError: (errors) => {
                toast.error(errors.error || 'Gagal menambahkan ke keranjang');
            },
            onFinish: () => {
                setIsAddingToCart(false);
            },
        });
    };

    // Check if product is in wishlist
    useEffect(() => {
        const checkWishlist = async () => {
            if (auth?.user) {
                try {
                    const response = await fetch(`/api/wishlist/check/${product.id}`);
                    const data = await response.json();
                    setIsInWishlist(data.inWishlist);
                } catch (error) {
                    console.error('Failed to check wishlist:', error);
                }
            }
        };
        
        checkWishlist();
    }, [auth, product.id]);

    // Fetch product reviews
    useEffect(() => {
        const fetchReviews = async () => {
            setIsLoadingReviews(true);
            try {
                const response = await fetch(`/api/produk/${product.id}/reviews`);
                const data = await response.json();
                setReviews(data.reviews || []);
                setReviewStats(data.stats || { total: 0, average: 0 });
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setIsLoadingReviews(false);
            }
        };
        
        fetchReviews();
    }, [product.id]);

    // Render star rating
    const renderStars = (rating, size = 'w-4 h-4') => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${size} ${
                            star <= rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    const handleToggleWishlist = () => {
        // Check if user is logged in
        if (!auth?.user) {
            toast.error('Silakan login terlebih dahulu');
            router.visit(route('login'));
            return;
        }

        setIsTogglingWishlist(true);
        
        router.post(route('wishlist.toggle'), {
            varian_produk_id: product.id,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsInWishlist(!isInWishlist);
                toast.success(isInWishlist ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist');
            },
            onError: () => {
                toast.error('Gagal mengubah wishlist');
            },
            onFinish: () => {
                setIsTogglingWishlist(false);
            },
        });
    };

    return (
        <UserLayout>
            <Head title={`${product.full_name} - Angel Cake'S`} />

            {/* Breadcrumb */}
            <section className="pt-28 pb-4 px-4">
                <div className="container mx-auto">
                    <nav className="text-sm">
                        <ol className="flex items-center gap-2 text-gray-600">
                            <li><Link href="/" className="hover:text-pink-500">Beranda</Link></li>
                            <li>/</li>
                            <li><Link href="/produk" className="hover:text-pink-500">Produk</Link></li>
                            <li>/</li>
                            <li>
                                <Link 
                                    href={`/produk?kategori_id=${product.category_id}`} 
                                    className="hover:text-pink-500"
                                >
                                    {product.category}
                                </Link>
                            </li>
                            <li>/</li>
                            <li className="text-pink-500 font-medium truncate max-w-[200px]">{product.full_name}</li>
                        </ol>
                    </nav>
                </div>
            </section>

            {/* Product Detail */}
            <section className="pb-12 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Product Images */}
                        <div>
                            {/* Main Image */}
                            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
                                <img
                                    src={product.images[selectedImage]}
                                    alt={product.full_name}
                                    className="w-full h-[400px] lg:h-[500px] object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop';
                                    }}
                                />
                                
                                {/* Image Navigation */}
                                {product.images.length > 1 && (
                                    <>
                                        <button 
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-white/90 hover:bg-white border-none"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-white/90 hover:bg-white border-none"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}

                                {/* Stock Badge */}
                                {product.stock > 0 ? (
                                    <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <span className="text-white font-semibold text-sm">Stok: {product.stock}</span>
                                    </div>
                                ) : (
                                    <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <span className="text-white font-semibold text-sm">Habis</span>
                                    </div>
                                )}

                                {/* Wishlist Button */}
                                <button 
                                    onClick={handleToggleWishlist}
                                    disabled={isTogglingWishlist}
                                    className={`absolute top-4 right-4 btn btn-circle btn-sm border-none transition-all ${
                                        isInWishlist 
                                            ? 'bg-pink-500 hover:bg-pink-600' 
                                            : 'bg-white/90 hover:bg-white'
                                    }`}
                                >
                                    {isTogglingWishlist ? (
                                        <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                        <Heart className={`w-4 h-4 ${isInWishlist ? 'text-white fill-current' : 'text-pink-500'}`} />
                                    )}
                                </button>
                            </div>

                            {/* Thumbnail Images */}
                            {product.images.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === index 
                                                    ? 'border-pink-500 shadow-lg' 
                                                    : 'border-transparent hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.full_name} - ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            {/* Category */}
                            <Link 
                                href={`/produk?kategori_id=${product.category_id}`}
                                className="inline-block text-sm text-pink-500 font-semibold mb-2 hover:text-pink-600"
                            >
                                {product.category}
                            </Link>

                            {/* Name */}
                            <h1 className="text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
                            <p className="text-xl text-gray-600 mb-4">{product.variant_name}</p>

                            {/* Price */}
                            <div className="text-4xl font-bold text-pink-500 mb-6">
                                {formatRupiah(product.price)}
                            </div>

                            {/* Attribute */}
                            {product.attribute && (
                                <div className="mb-6">
                                    <span className="text-gray-600">Varian:</span>
                                    <span className="ml-2 font-semibold">{product.attribute}</span>
                                </div>
                            )}

                            {/* Other Variants */}
                            {otherVariants.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-gray-600 mb-3">Varian lainnya:</p>
                                    <div className="flex flex-wrap gap-3">
                                        {otherVariants.map((variant) => (
                                            <Link
                                                key={variant.id}
                                                href={`/produk/${variant.id}`}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-pink-100 rounded-lg transition-colors"
                                            >
                                                <img
                                                    src={variant.image}
                                                    alt={variant.name}
                                                    className="w-8 h-8 rounded object-cover"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium">{variant.name}</p>
                                                    <p className="text-xs text-gray-500">{formatRupiah(variant.price)}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {product.description && (
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-2">Deskripsi</h3>
                                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-6">
                                <p className="text-gray-600 mb-3">Jumlah:</p>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange('decrease')}
                                            className="btn btn-ghost btn-sm"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center font-semibold">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange('increase')}
                                            className="btn btn-ghost btn-sm"
                                            disabled={quantity >= product.stock || product.stock === 0}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {product.stock > 0 && (
                                        <span className="text-sm text-gray-500">
                                            Tersedia {product.stock} item
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 mb-6">
                                <Button
                                    variant="primary"
                                    className="flex-1 min-w-[200px]"
                                    disabled={product.stock === 0 || isAddingToCart}
                                    onClick={handleAddToCart}
                                    loading={isAddingToCart}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    {isAddingToCart ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                                </Button>
                                <button 
                                    onClick={handleToggleWishlist}
                                    disabled={isTogglingWishlist}
                                    className={`btn rounded-lg ${isInWishlist ? 'btn-primary' : 'btn-outline'}`}
                                >
                                    {isTogglingWishlist ? (
                                        <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                        <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                                    )}
                                </button>
                                <button className="btn btn-outline rounded-lg">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Features */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <Check className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Kualitas Terjamin</p>
                                            <p className="text-xs text-gray-500">Bahan premium</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Check className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Fresh Baked</p>
                                            <p className="text-xs text-gray-500">Dipanggang segar</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                            <Check className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Pengiriman Cepat</p>
                                            <p className="text-xs text-gray-500">Same day delivery</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                            <Check className="w-5 h-5 text-pink-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Kemasan Aman</p>
                                            <p className="text-xs text-gray-500">Packaging premium</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="py-12 px-4 bg-gray-50">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <MessageCircle className="w-6 h-6 text-pink-500" />
                            <h2 className="text-2xl font-bold">Ulasan Produk</h2>
                        </div>
                        {reviewStats.total > 0 && (
                            <div className="flex items-center gap-2">
                                {renderStars(Math.round(reviewStats.average), 'w-5 h-5')}
                                <span className="font-bold text-lg">{reviewStats.average}</span>
                                <span className="text-gray-500">({reviewStats.total} ulasan)</span>
                            </div>
                        )}
                    </div>

                    {isLoadingReviews ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500"></div>
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {reviews.map((review) => (
                                <div 
                                    key={review.id} 
                                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-gray-900 truncate">
                                                    {review.user_name}
                                                </h4>
                                                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                                                    {review.created_at}
                                                </span>
                                            </div>
                                            <div className="mb-3">
                                                {renderStars(review.rating)}
                                            </div>
                                            {review.komentar && (
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {review.komentar}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl">
                            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                Belum Ada Ulasan
                            </h3>
                            <p className="text-gray-400">
                                Jadilah yang pertama memberikan ulasan untuk produk ini
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="py-12 px-4 bg-white">
                    <div className="container mx-auto">
                        <h2 className="text-2xl font-bold mb-8" data-aos="fade-up" data-aos-once="true">Produk Serupa</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((item, index) => (
                                <Link
                                    key={item.id}
                                    href={`/produk/${item.id}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                                    data-aos="zoom-in"
                                    data-aos-delay={index * 100}
                                    data-aos-once="true"
                                >
                                    <div className="relative overflow-hidden">
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
                                    </div>
                                    <div className="p-4">
                                        <p className="text-xs text-pink-500 font-semibold mb-1">{item.category}</p>
                                        <h3 className="font-bold mb-2 line-clamp-2">{item.name}</h3>
                                        <p className="text-lg font-bold text-pink-500">{formatRupiah(item.price)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </UserLayout>
    );
}
