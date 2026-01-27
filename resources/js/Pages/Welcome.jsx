import { Head, Link, router, usePage } from '@inertiajs/react';
import { ShoppingCart, Heart, Star, ChevronRight, ChevronLeft, MapPin, Phone, Mail } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import toast from 'react-hot-toast';

export default function Welcome({ auth, categories = [], featuredProducts = [] }) {
    const [wishlistIds, setWishlistIds] = useState([]);
    const [togglingIds, setTogglingIds] = useState([]);
    const [isPaused, setIsPaused] = useState(false);
    
    // Drag to scroll state
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Format price to Rupiah
    const formatRupiah = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Carousel auto-scroll
    useEffect(() => {
        if (categories.length <= 4 || isPaused || isDragging) return;
        
        const carousel = carouselRef.current;
        if (!carousel) return;
        
        const interval = setInterval(() => {
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            if (carousel.scrollLeft >= maxScroll - 10) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: 300, behavior: 'smooth' });
            }
        }, 3000);
        
        return () => clearInterval(interval);
    }, [categories.length, isPaused, isDragging]);

    // Drag handlers
    const handleMouseDown = (e) => {
        const carousel = carouselRef.current;
        if (!carousel) return;
        
        setIsDragging(true);
        setStartX(e.pageX - carousel.offsetLeft);
        setScrollLeft(carousel.scrollLeft);
        carousel.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const carousel = carouselRef.current;
        if (!carousel) return;
        
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2; // Multiply by 2 for faster scrolling
        carousel.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (carouselRef.current) {
            carouselRef.current.style.cursor = 'grab';
        }
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            if (carouselRef.current) {
                carouselRef.current.style.cursor = 'grab';
            }
        }
    };

    // Navigation buttons
    const scrollPrev = () => {
        carouselRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollNext = () => {
        carouselRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
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
            <Head title="Angel Cake'S - Toko Kue Terbaik" />
            
            {/* Hero Section */}
            <section id="home" className="pt-32 pb-20 px-4 overflow-hidden">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6" data-aos="fade-right">
                            <div className="inline-block px-4 py-2 bg-pink-100 rounded-full">
                                <span className="text-pink-600 font-semibold text-sm">🎂 Kue Terbaik di Kota</span>
                            </div>
                                
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                    Kue Istimewa untuk
                                    <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"> Momen Spesial</span> Anda
                                </h1>
                                
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Dibuat dengan cinta dan bahan berkualitas tinggi. Setiap kue adalah karya seni yang siap memeriahkan acara Anda.
                                </p>
                                
                                <div className="flex flex-wrap gap-4">
                                    <Link href="/produk" className="btn btn-primary btn-lg rounded-full gap-2 shadow-lg hover:shadow-xl transition-all">
                                        <ShoppingCart className="w-5 h-5" />
                                        Pesan Sekarang
                                    </Link>
                                    <Link href="/tentang" className="btn btn-outline btn-lg rounded-full gap-2">
                                        Pelajari Lebih Lanjut
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-4">
                                    <div>
                                        <div className="text-3xl font-bold text-pink-500">500+</div>
                                        <div className="text-gray-600">Pelanggan Puas</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-purple-500">50+</div>
                                        <div className="text-gray-600">Varian Kue</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-blue-500">4.9</div>
                                        <div className="text-gray-600">Rating</div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative" data-aos="fade-left" data-aos-delay="200">
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
                                <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop"
                                        alt="Delicious Cake"
                                        className="w-full h-96 object-cover rounded-2xl"
                                    />
                                    <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-6 bg-white rounded-2xl p-4 sm:p-6 shadow-xl">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                                            <div>
                                                <div className="font-bold text-2xl">4.9</div>
                                                <div className="text-sm text-gray-600">Rating</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section - Carousel */}
                <section id="products" className="py-20 px-4 bg-white/50 overflow-hidden">
                    <div className="container mx-auto">
                        <div className="text-center mb-16" data-aos="fade-up">
                            <h2 className="text-4xl font-bold mb-4">Kategori Kue Kami</h2>
                            <p className="text-xl text-gray-600">Pilih dari berbagai kategori kue favorit Anda</p>
                        </div>

                        {categories.length > 0 ? (
                            <div 
                                className="relative"
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => { setIsPaused(false); handleMouseLeave(); }}
                            >
                                {/* Navigation Arrows */}
                                <button
                                    onClick={scrollPrev}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-50 transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6 text-pink-500" />
                                </button>
                                <button
                                    onClick={scrollNext}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-50 transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6 text-pink-500" />
                                </button>

                                {/* Carousel Container with Drag */}
                                <div 
                                    ref={carouselRef}
                                    className="flex gap-6 overflow-x-auto scrollbar-hide mx-12 pb-4 select-none"
                                    style={{ 
                                        cursor: isDragging ? 'grabbing' : 'grab',
                                        scrollBehavior: isDragging ? 'auto' : 'smooth',
                                        scrollbarWidth: 'none',
                                        msOverflowStyle: 'none',
                                    }}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {categories.map((category, index) => {
                                        const icons = ['🎂', '💒', '🍰', '🍪', '🧁', '🎉', '🍩', '🥐'];
                                        const colors = [
                                            'from-pink-400 to-pink-600',
                                            'from-purple-400 to-purple-600',
                                            'from-blue-400 to-blue-600',
                                            'from-orange-400 to-orange-600',
                                            'from-green-400 to-green-600',
                                            'from-red-400 to-red-600',
                                            'from-yellow-400 to-yellow-600',
                                            'from-indigo-400 to-indigo-600',
                                        ];
                                        
                                        return (
                                            <Link
                                                key={category.id}
                                                href={`/produk?kategori_id=${category.id}`}
                                                className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden block flex-shrink-0 ${isDragging ? 'pointer-events-none' : ''}`}
                                                style={{ width: '280px', minWidth: '280px' }}
                                                draggable={false}
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-br ${colors[index % colors.length]} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                                                <div className="relative z-10">
                                                    <div className="text-6xl mb-4">{icons[index % icons.length]}</div>
                                                    <h3 className="text-xl font-bold mb-2">{category.nama_kategori}</h3>
                                                    <p className="text-gray-600 mb-4">{category.produks_count} Produk</p>
                                                    <div className="flex items-center text-pink-500 font-semibold group-hover:gap-2 transition-all">
                                                        Lihat Produk
                                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Scroll Hint */}
                                <p className="text-center text-gray-400 text-sm mt-4">
                                    ← Geser atau drag untuk melihat lebih banyak →
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <p>Belum ada kategori tersedia</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Featured Products */}
                <section className="py-20 px-4 overflow-hidden">
                    <div className="container mx-auto">
                        <div className="text-center mb-16" data-aos="fade-up">
                            <h2 className="text-4xl font-bold mb-4">Produk Unggulan</h2>
                            <p className="text-xl text-gray-600">Kue terlaris dan paling disukai pelanggan</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredProducts.length > 0 ? featuredProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                                    data-aos="zoom-in"
                                    data-aos-delay={index * 150}
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
                                            <h3 className="text-xl font-bold mb-2 line-clamp-2 hover:text-pink-500 transition-colors">{product.name}</h3>
                                        </Link>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-pink-500">{formatRupiah(product.price)}</span>
                                            <button className="btn btn-primary btn-sm rounded-full gap-2" disabled={product.stock === 0}>
                                                <ShoppingCart className="w-4 h-4" />
                                                Pesan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full text-center py-12 text-gray-500">
                                    <p>Belum ada produk tersedia</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-20 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white overflow-hidden">
                    <div className="container mx-auto">
                        <div className="text-center mb-16" data-aos="fade-up">
                            <h2 className="text-4xl font-bold mb-4">Apa Kata Pelanggan</h2>
                            <p className="text-xl opacity-90">Testimoni dari pelanggan yang puas</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: 'Sarah Johnson',
                                    role: 'Pelanggan Setia',
                                    text: 'Kue ulang tahun dari Angel Cake\'S selalu menjadi highlight di setiap perayaan keluarga kami. Rasanya luar biasa!',
                                    rating: 5
                                },
                                {
                                    name: 'Michael Chen',
                                    role: 'Event Organizer',
                                    text: 'Sudah berkali-kali order untuk event kantor. Selalu on-time dan kualitasnya konsisten. Highly recommended!',
                                    rating: 5
                                },
                                {
                                    name: 'Diana Putri',
                                    role: 'Ibu Rumah Tangga',
                                    text: 'Harga terjangkau dengan kualitas premium. Anak-anak saya sangat suka dengan kue-kue dari sini!',
                                    rating: 5
                                },
                            ].map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                                        ))}
                                    </div>
                                    <p className="text-lg mb-6 leading-relaxed">{testimonial.text}</p>
                                    <div>
                                        <div className="font-bold text-lg">{testimonial.name}</div>
                                        <div className="opacity-75">{testimonial.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-20 px-4 bg-white overflow-hidden">
                    <div className="container mx-auto">
                        <div className="max-w-2xl mx-auto text-center" data-aos="fade-up">
                            <h2 className="text-4xl font-bold mb-6">Hubungi Kami</h2>
                            <p className="text-xl text-gray-600 mb-12">
                                Punya pertanyaan atau ingin memesan kue custom? Jangan ragu untuk menghubungi kami!
                            </p>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="font-semibold text-lg mb-2">Alamat</div>
                                    <div className="text-gray-600">Jl. Raya Abepura No. 123, Jayapura, Papua</div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Phone className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="font-semibold text-lg mb-2">Telepon</div>
                                    <a href="tel:+6281234567890" className="text-gray-600 hover:text-purple-500 transition-colors">
                                        +62 812 3456 7890
                                    </a>
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="font-semibold text-lg mb-2">Email</div>
                                    <a href="mailto:info@angelcakes.com" className="text-gray-600 hover:text-blue-500 transition-colors">
                                        info@angelcakes.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
        </UserLayout>
    );
}
