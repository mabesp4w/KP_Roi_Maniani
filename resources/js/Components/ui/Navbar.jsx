import { Link, usePage, router } from '@inertiajs/react';
import { Cake, Menu, X, ShoppingCart, User, LogOut, Heart, Package, Star, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar({ auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const { url } = usePage();

    // Redirect admin to admin panel
    useEffect(() => {
        if (auth?.user && auth.user.role === 'admin' && (url === '/' || url === '/produk')) {
            router.visit('/admin/dashboard');
        }
    }, [auth, url]);

    // Fetch cart and wishlist count
    useEffect(() => {
        const fetchCounts = async () => {
            if (auth?.user) {
                try {
                    const [cartRes, wishlistRes] = await Promise.all([
                        fetch('/api/keranjang/count'),
                        fetch('/api/wishlist/count')
                    ]);
                    const cartData = await cartRes.json();
                    const wishlistData = await wishlistRes.json();
                    setCartCount(cartData.count || 0);
                    setWishlistCount(wishlistData.count || 0);
                } catch (error) {
                    console.error('Failed to fetch counts:', error);
                }
            } else {
                setCartCount(0);
                setWishlistCount(0);
            }
        };
        
        fetchCounts();
    }, [auth, url]); // Refetch when auth or url changes

    const isActive = (path) => {
        if (path === '/') {
            return url === '/';
        }
        return url.startsWith(path);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const navLinks = [
        { name: 'Beranda', href: '/' },
        { name: 'Produk', href: '/produk' },
        { name: 'Tentang', href: '/tentang' },
        { name: 'Kontak', href: '/kontak' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Cake className="w-8 h-8 text-pink-500" />
                        <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                            Angel Cake'S
                        </span>
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            link.href.startsWith('#') ? (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-gray-700 hover:text-pink-500 transition-colors font-medium"
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`transition-colors font-medium ${
                                        isActive(link.href)
                                            ? 'text-pink-500 font-bold'
                                            : 'text-gray-700 hover:text-pink-500'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            )
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/wishlist" className="btn btn-circle btn-ghost relative">
                            <Heart className="w-5 h-5" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {wishlistCount > 99 ? '99+' : wishlistCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/keranjang" className="btn btn-circle btn-ghost relative">
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                        
                        {auth?.user ? (
                            <>
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-sm rounded-full gap-2">
                                        <User className="w-4 h-4" />
                                        {auth.user.name}
                                    </div>
                                    <ul tabIndex={0} className="dropdown-content menu z-[1] mt-3 w-52 menu-sm rounded-box bg-base-100 p-2 shadow">
                                        <li className="menu-title">
                                            <span>{auth.user.email}</span>
                                        </li>
                                        {auth.user.role === 'admin' && (
                                            <li>
                                                <Link href="/admin/dashboard">
                                                    Dashboard Admin
                                                </Link>
                                            </li>
                                        )}
                                        <li>
                                            <Link href="/pesanan">
                                                <Package className="w-4 h-4" />
                                                Pesanan Saya
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/profil/alamat">
                                                <MapPin className="w-4 h-4" />
                                                Alamat Saya
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/ulasan">
                                                <Star className="w-4 h-4" />
                                                Ulasan Saya
                                            </Link>
                                        </li>
                                        <li>
                                            <a onClick={handleLogout}>
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href={route('login')} className="btn btn-ghost btn-sm rounded-full">
                                    Login
                                </Link>
                                <Link href={route('register')} className="btn btn-primary btn-sm rounded-full">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden btn btn-circle btn-ghost"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
                        <div className="flex flex-col space-y-3">
                            {navLinks.map((link) => (
                                link.href.startsWith('#') ? (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className="text-gray-700 hover:text-pink-500 transition-colors font-medium px-4 py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`transition-colors font-medium px-4 py-2 ${
                                            isActive(link.href)
                                                ? 'text-pink-500 font-bold bg-pink-50 rounded-lg'
                                                : 'text-gray-700 hover:text-pink-500'
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                )
                            ))}
                            <div className="flex items-center gap-3 px-4 pt-3 border-t border-gray-200">
                                <Link href="/wishlist" className="btn btn-circle btn-ghost btn-sm relative" onClick={() => setMobileMenuOpen(false)}>
                                    <Heart className="w-5 h-5" />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {wishlistCount > 99 ? '99+' : wishlistCount}
                                        </span>
                                    )}
                                </Link>
                                <Link href="/keranjang" className="btn btn-circle btn-ghost btn-sm relative" onClick={() => setMobileMenuOpen(false)}>
                                    <ShoppingCart className="w-5 h-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </Link>
                                
                                {auth?.user ? (
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="text-sm font-semibold px-2">{auth.user.name}</div>
                                        {auth.user.role === 'admin' && (
                                            <Link href="/admin/dashboard" className="btn btn-outline btn-sm rounded-full" onClick={() => setMobileMenuOpen(false)}>
                                                Dashboard Admin
                                            </Link>
                                        )}
                                        <Link href="/pesanan" className="btn btn-ghost btn-sm rounded-full gap-2 justify-start" onClick={() => setMobileMenuOpen(false)}>
                                            <Package className="w-4 h-4" />
                                            Pesanan Saya
                                        </Link>
                                        <Link href="/profil/alamat" className="btn btn-ghost btn-sm rounded-full gap-2 justify-start" onClick={() => setMobileMenuOpen(false)}>
                                            <MapPin className="w-4 h-4" />
                                            Alamat Saya
                                        </Link>
                                        <Link href="/ulasan" className="btn btn-ghost btn-sm rounded-full gap-2 justify-start" onClick={() => setMobileMenuOpen(false)}>
                                            <Star className="w-4 h-4" />
                                            Ulasan Saya
                                        </Link>
                                        <button onClick={handleLogout} className="btn btn-ghost btn-sm rounded-full gap-2 justify-start">
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="btn btn-ghost btn-sm rounded-full flex-1">
                                            Login
                                        </Link>
                                        <Link href={route('register')} className="btn btn-primary btn-sm rounded-full flex-1">
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
