import { Head, Link, router } from '@inertiajs/react';
import { ShoppingBag, MapPin, Truck, CreditCard, AlertCircle, Plus, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import Button from '@/Components/ui/Button';
import toast from 'react-hot-toast';

export default function Checkout({ cartItems, userAddresses, activeAddress, hasAddress, subtotal, totalItems }) {
    const [selectedAddress, setSelectedAddress] = useState(activeAddress?.id || null);
    const [catatan, setCatatan] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Format price to Rupiah
    const formatRupiah = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getSelectedAddressData = () => {
        return userAddresses.find(addr => addr.id === selectedAddress);
    };

    const selectedAddressData = getSelectedAddressData();
    const ongkir = selectedAddressData?.ongkir?.harga || 0;
    const total = subtotal + ongkir;

    const handleCheckout = () => {
        if (!selectedAddress) {
            toast.error('Pilih alamat pengiriman');
            return;
        }

        setIsProcessing(true);

        router.post(route('checkout.store'), {
            info_pengguna_id: selectedAddress,
            catatan: catatan,
        }, {
            onSuccess: () => {
                toast.success('Pesanan berhasil dibuat!');
            },
            onError: (errors) => {
                toast.error(errors.error || 'Gagal membuat pesanan');
            },
            onFinish: () => {
                setIsProcessing(false);
            },
        });
    };

    return (
        <UserLayout>
            <Head title="Checkout - Angel Cake'S" />

            <section className="pt-28 pb-12 px-4 min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <ShoppingBag className="w-8 h-8 text-pink-500" />
                            Checkout
                        </h1>
                        <p className="text-gray-600 mt-1">{totalItems} item dalam pesanan</p>
                    </div>

                    {!hasAddress ? (
                        /* No Address Warning */
                        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                            <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-10 h-10 text-yellow-500" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Alamat Belum Tersedia</h2>
                            <p className="text-gray-600 mb-6">
                                Silakan tambahkan alamat pengiriman terlebih dahulu untuk melanjutkan checkout
                            </p>
                            <Link href="/profil/alamat">
                                <Button variant="primary">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Tambah Alamat
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Address & Items */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Shipping Address */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-pink-500" />
                                        Alamat Pengiriman
                                    </h2>
                                    
                                    <div className="space-y-3">
                                        {userAddresses.map((address) => (
                                            <label
                                                key={address.id}
                                                className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                    selectedAddress === address.id
                                                        ? 'border-pink-500 bg-pink-50'
                                                        : 'border-gray-200 hover:border-pink-300'
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <input
                                                        type="radio"
                                                        name="address"
                                                        value={address.id}
                                                        checked={selectedAddress === address.id}
                                                        onChange={() => setSelectedAddress(address.id)}
                                                        className="radio radio-primary mt-1"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold">{address.nama_pengguna}</span>
                                                            {address.aktif && (
                                                                <span className="badge badge-primary badge-sm">Utama</span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mt-1">{address.nomor_telepon}</p>
                                                        <p className="text-sm text-gray-600">{address.alamat}</p>
                                                        <div className="flex items-center gap-2 mt-2 text-sm flex-wrap">
                                                            <Truck className="w-4 h-4 text-gray-400" />
                                                            <span className="text-gray-500">
                                                                {address.ongkir.kecamatan}
                                                                {address.ongkir.nama_desa && ` - ${address.ongkir.nama_desa}`}
                                                            </span>
                                                            <span className="text-pink-500 font-semibold">
                                                                {formatRupiah(address.ongkir.harga)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    
                                    <Link 
                                        href="/profil/alamat" 
                                        className="btn btn-outline btn-sm mt-4 gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Tambah Alamat Baru
                                    </Link>
                                </div>

                                {/* Order Items */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <ShoppingBag className="w-5 h-5 text-pink-500" />
                                        Daftar Pesanan
                                    </h2>
                                    
                                    <div className="divide-y">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {formatRupiah(item.price)} x {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-pink-500">
                                                        {formatRupiah(item.subtotal)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-lg font-bold mb-4">Catatan (Opsional)</h2>
                                    <textarea
                                        value={catatan}
                                        onChange={(e) => setCatatan(e.target.value)}
                                        placeholder="Tambahkan catatan untuk pesanan Anda..."
                                        className="textarea textarea-bordered w-full h-24"
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">{catatan.length}/500 karakter</p>
                                </div>
                            </div>

                            {/* Right Column - Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
                                    <h2 className="text-lg font-bold mb-6">Ringkasan Pembayaran</h2>
                                    
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal ({totalItems} item)</span>
                                            <span className="font-semibold">{formatRupiah(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Ongkos Kirim</span>
                                            <span className="font-semibold">
                                                {selectedAddressData ? formatRupiah(ongkir) : '-'}
                                            </span>
                                        </div>
                                        {selectedAddressData && (
                                            <div className="text-sm text-gray-500">
                                                Pengiriman ke {selectedAddressData.ongkir.kecamatan}
                                                {selectedAddressData.ongkir.nama_desa && ` - ${selectedAddressData.ongkir.nama_desa}`}
                                            </div>
                                        )}
                                        <div className="divider my-2"></div>
                                        <div className="flex justify-between text-xl font-bold">
                                            <span>Total</span>
                                            <span className="text-pink-500">{formatRupiah(total)}</span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="primary"
                                        className="w-full"
                                        onClick={handleCheckout}
                                        disabled={!selectedAddress || isProcessing}
                                        loading={isProcessing}
                                    >
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        {isProcessing ? 'Memproses...' : 'Buat Pesanan'}
                                    </Button>

                                    <p className="text-xs text-gray-500 text-center mt-4">
                                        Dengan membuat pesanan, Anda menyetujui syarat dan ketentuan yang berlaku
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </UserLayout>
    );
}
