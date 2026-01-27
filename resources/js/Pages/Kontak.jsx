import { Head } from '@inertiajs/react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook } from 'lucide-react';
import UserLayout from '@/Layouts/UserLayout';

export default function Kontak() {
    const contactInfo = [
        {
            icon: MapPin,
            title: 'Alamat',
            content: 'Jl. Raya Abepura No. 123, Jayapura, Papua',
            color: 'from-pink-400 to-pink-600',
        },
        {
            icon: Phone,
            title: 'Telepon',
            content: '+62 812 3456 7890',
            link: 'tel:+6281234567890',
            color: 'from-purple-400 to-purple-600',
        },
        {
            icon: Mail,
            title: 'Email',
            content: 'info@enjelcakes.com',
            link: 'mailto:info@enjelcakes.com',
            color: 'from-blue-400 to-blue-600',
        },
        {
            icon: Clock,
            title: 'Jam Operasional',
            content: 'Senin - Sabtu: 08:00 - 21:00',
            color: 'from-green-400 to-green-600',
        },
    ];

    const socialMedia = [
        { icon: Instagram, name: 'Instagram', link: '#', handle: '@enjelcakes' },
        { icon: Facebook, name: 'Facebook', link: '#', handle: 'Angel Cake\'s' },
        { icon: MessageCircle, name: 'WhatsApp', link: 'https://wa.me/6281234567890', handle: '+62 812 3456 7890' },
    ];

    return (
        <UserLayout>
            <Head title="Kontak - Angel Cake'S" />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
                <div className="container mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full mb-6">
                        <MessageCircle className="w-5 h-5 text-pink-600" />
                        <span className="text-pink-600 font-semibold text-sm">Hubungi Kami</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Mari{' '}
                        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                            Terhubung
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Punya pertanyaan atau ingin memesan kue spesial? 
                        Jangan ragu untuk menghubungi kami. Tim kami siap melayani Anda!
                    </p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => {
                            const Icon = info.icon;
                            return (
                                <div 
                                    key={index} 
                                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
                                >
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{info.title}</h3>
                                    {info.link ? (
                                        <a 
                                            href={info.link} 
                                            className="text-gray-600 hover:text-pink-500 transition-colors"
                                        >
                                            {info.content}
                                        </a>
                                    ) : (
                                        <p className="text-gray-600">{info.content}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Map & Social */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Map */}
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl">
                            <h2 className="text-3xl font-bold mb-6">Lokasi Kami</h2>
                            <div className="rounded-2xl overflow-hidden shadow-lg h-64 bg-gray-200">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.4159!2d140.7!3d-2.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwMzMnMDAuMCJTIDE0MMKwNDInMDAuMCJF!5e0!3m2!1sen!2sid!4v1705000000000!5m2!1sen!2sid"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Lokasi Angel Cake's"
                                ></iframe>
                            </div>
                            <p className="text-gray-600 mt-4 flex items-start gap-2">
                                <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                                Jl. Raya Abepura No. 123, Jayapura, Papua 99351
                            </p>
                        </div>

                        {/* Social Media */}
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl">
                            <h2 className="text-3xl font-bold mb-6">Media Sosial</h2>
                            <p className="text-gray-600 mb-6">
                                Ikuti kami di media sosial untuk update terbaru dan promo menarik!
                            </p>
                            <div className="space-y-4">
                                {socialMedia.map((social, index) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={index}
                                            href={social.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all group"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{social.name}</p>
                                                <p className="text-gray-600 text-sm">{social.handle}</p>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-pink-50 to-purple-50">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Pertanyaan Umum</h2>
                        <p className="text-xl text-gray-600">Jawaban untuk pertanyaan yang sering diajukan</p>
                    </div>
                    
                    <div className="space-y-4">
                        {[
                            {
                                q: 'Berapa lama waktu yang dibutuhkan untuk memesan kue?',
                                a: 'Untuk kue standar, kami membutuhkan waktu minimal 1 hari sebelumnya. Untuk kue custom atau dalam jumlah besar, disarankan memesan 3-7 hari sebelumnya.',
                            },
                            {
                                q: 'Apakah bisa melakukan pemesanan custom?',
                                a: 'Tentu! Kami menerima pesanan custom sesuai keinginan Anda. Silakan hubungi kami untuk konsultasi desain dan harga.',
                            },
                            {
                                q: 'Bagaimana cara pembayaran?',
                                a: 'Kami menerima pembayaran melalui transfer bank, e-wallet (OVO, GoPay, Dana), dan pembayaran di tempat untuk pengambilan langsung.',
                            },
                            {
                                q: 'Apakah tersedia layanan pengiriman?',
                                a: 'Ya, kami menyediakan layanan pengiriman untuk area Jayapura dan sekitarnya. Ongkos kirim dihitung berdasarkan jarak.',
                            },
                        ].map((faq, index) => (
                            <div key={index} className="collapse collapse-plus bg-white shadow rounded-xl">
                                <input type="radio" name="faq-accordion" />
                                <div className="collapse-title text-lg font-semibold">
                                    {faq.q}
                                </div>
                                <div className="collapse-content">
                                    <p className="text-gray-600">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </UserLayout>
    );
}
