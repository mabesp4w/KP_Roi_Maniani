import { Head, Link, router } from '@inertiajs/react';
import { Users, Search, Eye, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/ui/Pagination';

export default function PembeliIndex({ auth, pembeli, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.pembeli.index'), { search }, {
            preserveState: true,
            replace: true,
        });
    };

    const formatRupiah = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AdminLayout auth={auth} header="Daftar Pembeli">
            <Head title="Pembeli - Admin Panel" />

            <div className="p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Daftar Pembeli</h1>
                            <p className="text-gray-500 text-sm">Kelola data pembeli toko</p>
                        </div>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                            <input
                                type="text"
                                placeholder="Cari pembeli..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input input-bordered pl-10 w-64"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Cari
                        </button>
                    </form>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Pembeli</p>
                                <p className="text-2xl font-bold">{pembeli.total || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="font-semibold">Pembeli</th>
                                    <th className="font-semibold">Kontak</th>
                                    <th className="font-semibold">Alamat</th>
                                    <th className="font-semibold text-center">Pesanan</th>
                                    <th className="font-semibold">Terdaftar</th>
                                    <th className="font-semibold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pembeli.data.length > 0 ? (
                                    pembeli.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar placeholder">
                                                        <div className="bg-gradient-to-br from-pink-400 to-purple-500 text-white rounded-full w-10">
                                                            <span className="text-sm font-bold">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-sm">
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <Phone className="w-3 h-3" />
                                                        {user.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1 text-sm text-gray-600 max-w-[200px] truncate">
                                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                                    {user.address}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <ShoppingBag className="w-4 h-4 text-pink-500" />
                                                    <span className="font-semibold">{user.orders_count}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-sm text-gray-600">{user.created_at}</span>
                                            </td>
                                            <td className="text-center">
                                                <Link
                                                    href={route('admin.pembeli.show', user.id)}
                                                    className="btn btn-ghost btn-sm gap-1 text-blue-600"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12">
                                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500">Belum ada pembeli</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pembeli.data.length > 0 && (
                        <div className="p-4 border-t">
                            <Pagination links={pembeli.links} />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
