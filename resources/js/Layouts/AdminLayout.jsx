import Avatar from '@/Components/ui/Avatar';
import Badge from '@/Components/ui/Badge';
import { Link, router, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    FileText,
    LayoutDashboard,
    LogOut,
    MapPin,
    Menu,
    Package,
    Settings,
    ShoppingCart,
    User,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ auth, header, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { url } = usePage();

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    // Debug: Log current URL
    console.log('Current URL:', url);
    console.log('Dashboard href:', '/admin/dashboard');

    const isActive = (path) => {
        try {
            const routePath = typeof path === 'function' ? path() : path;
            // Hapus query parameter dari URL saat membandingkan
            const currentPath = url.split('?')[0];
            return currentPath === routePath || currentPath.startsWith(routePath + '/');
        } catch {
            return false;
        }
    };

    const kecamatanPath = '/admin/kecamatan';
    const ongkirPath = '/admin/ongkir';
    const kategoriPath = '/admin/kategori';
    const produkPath = '/admin/produk';
    const varianProdukPath = '/admin/varian-produk';

    const kecamatanActive = isActive(kecamatanPath);
    const ongkirActive = isActive(ongkirPath);
    const kategoriActive = isActive(kategoriPath);
    const produkActive = isActive(produkPath);
    const varianProdukActive = isActive(varianProdukPath);

    const menuItems = [
        {
            name: 'Dashboard',
            icon: LayoutDashboard,
            href: '/admin/dashboard',
            active: isActive('/admin/dashboard'),
        },
        {
            name: 'Pembeli',
            icon: Users,
            href: '/admin/pembeli',
            active: isActive('/admin/pembeli'),
        },
        {
            name: 'Lokasi',
            icon: MapPin,
            href: '#',
            active: kecamatanActive || ongkirActive,
            children: [
                {
                    name: 'Kecamatan',
                    href: kecamatanPath,
                    active: kecamatanActive,
                },
                {
                    name: 'Ongkir',
                    href: ongkirPath,
                    active: ongkirActive,
                },
            ],
        },
        {
            name: 'Produk',
            icon: Package,
            href: '#',
            active: kategoriActive || produkActive || varianProdukActive,
            children: [
                { name: 'Daftar Produk', href: produkPath, active: produkActive },
                { name: 'Kategori', href: kategoriPath, active: kategoriActive },
                { name: 'Varian Produk', href: varianProdukPath, active: varianProdukActive },
            ],
        },
        {
            name: 'Pesanan',
            icon: ShoppingCart,
            href: '/admin/pesanan',
            active: isActive('/admin/pesanan'),
        },
        {
            name: 'Laporan',
            icon: FileText,
            href: '/admin/laporan',
            active: isActive('/admin/laporan'),
        },
    ];

    return (
        <div className="min-h-screen bg-base-200">
            {/* Mobile Menu Button */}
            <div className="navbar bg-base-100 shadow-lg lg:hidden">
                <div className="navbar-start">
                    <button className="btn btn-circle btn-ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                <div className="navbar-center">
                    <Link
                        href={(() => {
                            try {
                                return route('admin.dashboard');
                            } catch {
                                return '/admin/dashboard';
                            }
                        })()}
                        className="btn text-xl btn-ghost"
                    >
                        Admin Panel
                    </Link>
                </div>
                <div className="navbar-end">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn avatar btn-circle btn-ghost">
                            <Avatar src={null} alt={auth?.user?.name || 'Admin'} size="sm" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu z-[1] mt-3 w-52 menu-sm rounded-box bg-base-100 p-2 shadow">
                            <li className="menu-title">
                                <span>{auth?.user?.name || 'Admin'}</span>
                                <div className="mt-1">
                                    <Badge variant="error">Admin</Badge>
                                </div>
                            </li>
                            <li>
                                <Link href={(() => {
                                    try {
                                        return route('profile.edit');
                                    } catch {
                                        return '#';
                                    }
                                })()}>
                                    <User size={16} />
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <a onClick={handleLogout}>
                                    <LogOut size={16} />
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`bg-base-100 shadow-lg transition-all duration-300 ${
                        sidebarOpen ? 'w-64' : 'w-20'
                    } fixed top-0 left-0 z-40 h-screen lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className="flex h-full flex-col">
                        {/* Sidebar Header */}
                        <div className="flex h-16 items-center justify-between border-b border-base-300 px-4">
                            {sidebarOpen && (
                                <Link
                                    href={(() => {
                                        try {
                                            return route('admin.dashboard');
                                        } catch {
                                            return '/admin/dashboard';
                                        }
                                    })()}
                                    className="text-xl font-bold"
                                >
                                    Admin Panel
                                </Link>
                            )}
                            <button className="btn hidden btn-ghost btn-sm lg:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                            </button>
                            <button className="btn btn-ghost btn-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Sidebar Menu */}
                        <nav className="flex-1 overflow-y-auto p-4">
                            <ul className="menu space-y-1">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={item.name}>
                                            {item.children ? (
                                                <details open={item.active}>
                                                    <summary className={`${item.active ? 'text-primary-content' : ''}`}>
                                                        <Icon size={20} />
                                                        {sidebarOpen && <span>{item.name}</span>}
                                                    </summary>
                                                    <ul>
                                                        {item.children.map((child) => (
                                                            <li key={child.name}>
                                                                {child.disabled ? (
                                                                    <span
                                                                        className={`ml-4 cursor-not-allowed opacity-50 ${
                                                                            child.active ? 'bg-primary text-primary-content' : ''
                                                                        }`}
                                                                    >
                                                                        {sidebarOpen && child.name}
                                                                    </span>
                                                                ) : (
                                                                    <Link
                                                                        href={child.href}
                                                                        className={`ml-4 ${child.active ? 'bg-primary text-primary-content' : ''}`}
                                                                    >
                                                                        {sidebarOpen && child.name}
                                                                    </Link>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </details>
                                            ) : (
                                                <Link
                                                    href={typeof item.href === 'function' ? item.href() : item.href}
                                                    className={`${item.active ? 'bg-primary text-primary-content' : ''}`}
                                                >
                                                    <Icon size={20} />
                                                    {sidebarOpen && <span>{item.name}</span>}
                                                </Link>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        {/* Sidebar Footer */}
                        <div className="border-t border-base-300 p-4">
                            {sidebarOpen && (
                                <div className="mt-3 space-y-1">
                                    <button onClick={handleLogout} className="btn w-full justify-start text-error btn-ghost btn-sm">
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                    {/* Top Bar - Desktop */}
                    <div className="hidden lg:flex fixed top-0 right-0 h-16 items-center justify-between border-b border-base-300 bg-base-100 px-6 shadow-sm z-30" style={{ left: sidebarOpen ? '16rem' : '5rem' }}>
                        <div>{header && <h2 className="text-xl leading-tight font-semibold text-base-content">{header}</h2>}</div>
                        <div className="flex items-center gap-4">
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn avatar btn-circle btn-ghost">
                                    <Avatar src={null} alt={auth?.user?.name || 'Admin'} size="sm" />
                                </div>
                                <ul tabIndex={0} className="dropdown-content menu z-[1] mt-3 w-52 menu-sm rounded-box bg-base-100 p-2 shadow">
                                    <li className="menu-title">
                                        <span>{auth?.user?.name || 'Admin'}</span>
                                        <div className="mt-1">
                                            <Badge variant="error">Admin</Badge>
                                        </div>
                                    </li>
                                    <li>
                                        <Link href={(() => {
                                            try {
                                                return route('profile.edit');
                                            } catch {
                                                return '#';
                                            }
                                        })()}>
                                            <User size={16} />
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <a onClick={handleLogout}>
                                            <LogOut size={16} />
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Page Content */}
                    <main className="p-4 lg:p-6 lg:pt-20">{children}</main>
                </div>
            </div>

            {/* Mobile Overlay */}
            {mobileMenuOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />}
        </div>
    );
}
