import { Link, usePage } from '@inertiajs/react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import Navbar from '@/Components/ui/Navbar';

export default function UserLayout({ children }) {
    const { auth } = usePage().props;
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
            {/* Navbar */}
            <Navbar auth={auth} />

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16 px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        {/* About */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Angel Cake'S</h3>
                            <p className="text-gray-400 mb-4">
                                Toko kue terbaik dengan berbagai pilihan kue berkualitas untuk setiap momen spesial Anda.
                            </p>
                            <div className="flex gap-3">
                                <a href="#" className="btn btn-circle btn-sm bg-white/10 hover:bg-pink-500 border-none">
                                    <Facebook className="w-4 h-4" />
                                </a>
                                <a href="#" className="btn btn-circle btn-sm bg-white/10 hover:bg-pink-500 border-none">
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a href="#" className="btn btn-circle btn-sm bg-white/10 hover:bg-pink-500 border-none">
                                    <Twitter className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Menu */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Menu</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/" className="hover:text-pink-500 transition-colors">Beranda</Link></li>
                                <li><Link href="/produk" className="hover:text-pink-500 transition-colors">Produk</Link></li>
                                <li><Link href="/tentang" className="hover:text-pink-500 transition-colors">Tentang</Link></li>
                                <li><Link href="/kontak" className="hover:text-pink-500 transition-colors">Kontak</Link></li>
                            </ul>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Kategori</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/produk" className="hover:text-pink-500 transition-colors">Kue Ulang Tahun</Link></li>
                                <li><Link href="/produk" className="hover:text-pink-500 transition-colors">Kue Pernikahan</Link></li>
                                <li><Link href="/produk" className="hover:text-pink-500 transition-colors">Kue Tart</Link></li>
                                <li><Link href="/produk" className="hover:text-pink-500 transition-colors">Kue Kering</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Kontak Kami</h3>
                            <ul className="space-y-3 text-gray-400">
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                                    <span>Jl. Raya Abepura No. 123, Jayapura, Papua</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-pink-500 flex-shrink-0" />
                                    <a href="tel:+6281234567890" className="hover:text-pink-500 transition-colors">+62 812 3456 7890</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-pink-500 flex-shrink-0" />
                                    <a href="mailto:info@enjelcakes.com" className="hover:text-pink-500 transition-colors">info@enjelcakes.com</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} Angel Cake'S. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
