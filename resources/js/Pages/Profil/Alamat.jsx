import { Head, Link, router, useForm } from '@inertiajs/react';
import { MapPin, Plus, Edit2, Trash2, Star, ArrowLeft, Truck, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import Button from '@/Components/ui/Button';
import TextInput from '@/Components/forms/TextInput';
import toast from 'react-hot-toast';

export default function Alamat({ addresses, kecamatanOptions, ongkirOptions }) {
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [selectedKecamatan, setSelectedKecamatan] = useState('');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama_pengguna: '',
        nomor_telepon: '',
        alamat: '',
        ongkir_id: '',
        aktif: false,
    });

    // Format price to Rupiah
    const formatRupiah = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Filter ongkir by selected kecamatan
    const filteredOngkir = useMemo(() => {
        if (!selectedKecamatan) return [];
        return ongkirOptions.filter(o => o.kecamatan_id === selectedKecamatan);
    }, [selectedKecamatan, ongkirOptions]);

    const openAddModal = () => {
        reset();
        setSelectedKecamatan('');
        setEditingAddress(null);
        setShowModal(true);
    };

    const openEditModal = (address) => {
        setSelectedKecamatan(address.kecamatan_id || '');
        setData({
            nama_pengguna: address.nama_pengguna,
            nomor_telepon: address.nomor_telepon,
            alamat: address.alamat,
            ongkir_id: address.ongkir_id,
            aktif: address.aktif,
        });
        setEditingAddress(address);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingAddress(null);
        setSelectedKecamatan('');
        reset();
    };

    const handleKecamatanChange = (kecamatanId) => {
        setSelectedKecamatan(kecamatanId);
        setData('ongkir_id', ''); // Reset kelurahan when kecamatan changes
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingAddress) {
            put(route('profil.alamat.update', editingAddress.id), {
                onSuccess: () => {
                    toast.success('Alamat berhasil diperbarui');
                    closeModal();
                },
                onError: () => {
                    toast.error('Gagal memperbarui alamat');
                },
            });
        } else {
            post(route('profil.alamat.store'), {
                onSuccess: () => {
                    toast.success('Alamat berhasil ditambahkan');
                    closeModal();
                },
                onError: () => {
                    toast.error('Gagal menambahkan alamat');
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus alamat ini?')) return;
        
        setDeletingId(id);
        router.delete(route('profil.alamat.destroy', id), {
            onSuccess: () => {
                toast.success('Alamat berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus alamat');
            },
            onFinish: () => {
                setDeletingId(null);
            },
        });
    };

    const handleSetActive = (id) => {
        router.post(route('profil.alamat.aktif', id), {}, {
            onSuccess: () => {
                toast.success('Alamat utama berhasil diubah');
            },
            onError: () => {
                toast.error('Gagal mengubah alamat utama');
            },
        });
    };

    // Get selected ongkir info for display
    const getSelectedOngkirInfo = () => {
        if (!data.ongkir_id) return null;
        return ongkirOptions.find(o => o.value === data.ongkir_id);
    };

    return (
        <UserLayout>
            <Head title="Alamat Saya - Angel Cake'S" />

            <section className="pt-28 pb-12 px-4 min-h-screen">
                <div className="container mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <Link href="/checkout" className="btn btn-ghost btn-circle">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold flex items-center gap-3">
                                    <MapPin className="w-8 h-8 text-pink-500" />
                                    Alamat Saya
                                </h1>
                                <p className="text-gray-600 mt-1">Kelola alamat pengiriman</p>
                            </div>
                        </div>
                        <Button variant="primary" onClick={openAddModal}>
                            <Plus className="w-5 h-5 mr-2" />
                            Tambah Alamat
                        </Button>
                    </div>

                    {addresses.length > 0 ? (
                        <div className="space-y-4">
                            {addresses.map((address) => (
                                <div
                                    key={address.id}
                                    className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all ${
                                        address.aktif ? 'border-pink-500' : 'border-transparent'
                                    } ${deletingId === address.id ? 'opacity-50' : ''}`}
                                >
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="flex-1 min-w-[200px]">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className="font-bold text-lg">{address.nama_pengguna}</span>
                                                {address.aktif && (
                                                    <span className="badge badge-primary gap-1">
                                                        <Star className="w-3 h-3" />
                                                        Utama
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600">{address.nomor_telepon}</p>
                                            <p className="text-gray-700 mt-2">{address.alamat}</p>
                                            <div className="flex items-center gap-2 mt-3 text-sm flex-wrap">
                                                <Truck className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-500">
                                                    {address.ongkir.kecamatan} - {address.ongkir.nama_desa}
                                                </span>
                                                <span className="text-pink-500 font-semibold">
                                                    {formatRupiah(address.ongkir.harga)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {!address.aktif && (
                                                <button
                                                    onClick={() => handleSetActive(address.id)}
                                                    className="btn btn-ghost btn-sm text-pink-500"
                                                >
                                                    <Star className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Jadikan Utama</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => openEditModal(address)}
                                                className="btn btn-ghost btn-sm"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(address.id)}
                                                className="btn btn-ghost btn-sm text-red-500"
                                                disabled={deletingId === address.id}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <MapPin className="w-12 h-12 text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Belum Ada Alamat</h2>
                            <p className="text-gray-600 mb-8">
                                Tambahkan alamat pengiriman untuk melanjutkan checkout
                            </p>
                            <Button variant="primary" onClick={openAddModal}>
                                <Plus className="w-5 h-5 mr-2" />
                                Tambah Alamat
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold">
                                {editingAddress ? 'Edit Alamat' : 'Tambah Alamat Baru'}
                            </h2>
                            <button onClick={closeModal} className="btn btn-ghost btn-circle btn-sm">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <TextInput
                                label="Nama Penerima"
                                name="nama_pengguna"
                                value={data.nama_pengguna}
                                onChange={(e) => setData('nama_pengguna', e.target.value)}
                                placeholder="Masukkan nama penerima"
                                error={errors.nama_pengguna}
                                required
                            />

                            <TextInput
                                label="Nomor Telepon"
                                name="nomor_telepon"
                                value={data.nomor_telepon}
                                onChange={(e) => setData('nomor_telepon', e.target.value)}
                                placeholder="Contoh: 081234567890"
                                error={errors.nomor_telepon}
                                required
                            />

                            {/* Kecamatan Dropdown */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Kecamatan
                                        <span className="text-error ml-1">*</span>
                                    </span>
                                </label>
                                <select
                                    value={selectedKecamatan}
                                    onChange={(e) => handleKecamatanChange(e.target.value)}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Pilih Kecamatan</option>
                                    {kecamatanOptions.map((kec) => (
                                        <option key={kec.value} value={kec.value}>
                                            {kec.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Kelurahan/Desa Dropdown (Chain dari Kecamatan) */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Kelurahan/Desa
                                        <span className="text-error ml-1">*</span>
                                    </span>
                                </label>
                                <select
                                    value={data.ongkir_id}
                                    onChange={(e) => setData('ongkir_id', e.target.value)}
                                    className={`select select-bordered w-full ${errors.ongkir_id ? 'select-error' : ''}`}
                                    disabled={!selectedKecamatan}
                                >
                                    <option value="">
                                        {selectedKecamatan ? 'Pilih Kelurahan/Desa' : 'Pilih Kecamatan terlebih dahulu'}
                                    </option>
                                    {filteredOngkir.map((ongkir) => (
                                        <option key={ongkir.value} value={ongkir.value}>
                                            {ongkir.nama_desa} - {formatRupiah(ongkir.harga)}
                                        </option>
                                    ))}
                                </select>
                                {errors.ongkir_id && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.ongkir_id}</span>
                                    </label>
                                )}
                                {data.ongkir_id && getSelectedOngkirInfo() && (
                                    <div className="mt-2 p-3 bg-pink-50 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Ongkos Kirim:</span>
                                            <span className="font-bold text-pink-500">
                                                {formatRupiah(getSelectedOngkirInfo().harga)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Alamat Lengkap */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Alamat Lengkap
                                        <span className="text-error ml-1">*</span>
                                    </span>
                                </label>
                                <textarea
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    className={`textarea textarea-bordered w-full h-24 ${errors.alamat ? 'textarea-error' : ''}`}
                                    placeholder="Masukkan alamat lengkap (jalan, RT/RW, patokan, dll)"
                                />
                                {errors.alamat && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.alamat}</span>
                                    </label>
                                )}
                            </div>

                            {/* Jadikan Utama Checkbox */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={data.aktif}
                                    onChange={(e) => setData('aktif', e.target.checked)}
                                    className="checkbox checkbox-primary"
                                    id="aktif"
                                />
                                <label htmlFor="aktif" className="label-text cursor-pointer">
                                    Jadikan alamat utama
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn btn-outline flex-1"
                                >
                                    Batal
                                </button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="flex-1"
                                    loading={processing}
                                    disabled={processing}
                                >
                                    {editingAddress ? 'Simpan Perubahan' : 'Tambah Alamat'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
