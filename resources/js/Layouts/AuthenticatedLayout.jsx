import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Button from '@/Components/ui/Button';
import Avatar from '@/Components/ui/Avatar';
import Badge from '@/Components/ui/Badge';

export default function AuthenticatedLayout({ auth, header, children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const getRoleBadge = (role) => {
        if (role === 'admin') {
            return <Badge variant="error">Admin</Badge>;
        } else if (role === 'petugas') {
            return <Badge variant="success">Petugas</Badge>;
        }
        return <Badge variant="info">User</Badge>;
    };

    return (
        <div className="min-h-screen bg-base-200">
            {/* Navbar */}
            <div className="navbar bg-base-100 shadow-lg">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <Link href={route('dashboard')}>Dashboard</Link>
                            </li>
                            {auth.user.role === 'admin' && (
                                <li>
                                    <Link href={route('admin.dashboard')}>Admin Dashboard</Link>
                                </li>
                            )}
                            {auth.user.role === 'petugas' && (
                                <li>
                                    <Link href={route('petugas.dashboard')}>Petugas Dashboard</Link>
                                </li>
                            )}
                            <li>
                                <Link href={route('profile.edit')}>Profile</Link>
                            </li>
                        </ul>
                    </div>
                    <Link href={route('dashboard')} className="btn btn-ghost text-xl">
                        Dashboard
                    </Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <Link href={route('dashboard')}>Dashboard</Link>
                        </li>
                        {auth.user.role === 'admin' && (
                            <li>
                                <Link href={route('admin.dashboard')}>Admin</Link>
                            </li>
                        )}
                        {auth.user.role === 'petugas' && (
                            <li>
                                <Link href={route('petugas.dashboard')}>Petugas</Link>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="navbar-end">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <Avatar src={null} alt={auth.user.name} size="sm" />
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                        >
                            <li className="menu-title">
                                <span>{auth.user.name}</span>
                                <div className="mt-1">{getRoleBadge(auth.user.role)}</div>
                            </li>
                            <li>
                                <Link href={route('profile.edit')}>Profile</Link>
                            </li>
                            <li>
                                <a onClick={handleLogout}>Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Page Heading */}
            {header && (
                <header className="bg-base-100 shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            {/* Page Content */}
            <main>{children}</main>
        </div>
    );
}

