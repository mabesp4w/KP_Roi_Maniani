import { Head } from '@inertiajs/react';
import { ChefHat, Award, Users, Heart, Star, Cake, Clock, MapPin, CheckCircle } from 'lucide-react';
import UserLayout from '@/Layouts/UserLayout';

export default function Tentang() {
    const milestones = [
        { year: '2018', title: 'Awal Mula', description: 'Angel Cake\'s didirikan dengan semangat berbagi kebahagiaan melalui kue.' },
        { year: '2019', title: 'Toko Pertama', description: 'Membuka toko fisik pertama di Jayapura.' },
        { year: '2021', title: '1000+ Pelanggan', description: 'Mencapai milestone 1000 pelanggan setia.' },
        { year: '2024', title: 'Go Digital', description: 'Meluncurkan platform online untuk menjangkau lebih banyak pelanggan.' },
    ];

    const values = [
        { icon: Heart, title: 'Dibuat dengan Cinta', description: 'Setiap kue kami buat dengan sepenuh hati dan kasih sayang.' },
        { icon: Star, title: 'Kualitas Terbaik', description: 'Hanya menggunakan bahan-bahan berkualitas premium.' },
        { icon: Users, title: 'Pelanggan Utama', description: 'Kepuasan pelanggan adalah prioritas nomor satu kami.' },
        { icon: Clock, title: 'Tepat Waktu', description: 'Kami berkomitmen untuk pengiriman yang selalu tepat waktu.' },
    ];

    const team = [
        { name: 'Angel', role: 'Founder & Head Baker', description: 'Dengan pengalaman lebih dari 10 tahun di bidang pastry.' },
        { name: 'Tim Pastry', role: 'Baker Team', description: 'Tim yang berdedikasi menghasilkan kue berkualitas.' },
        { name: 'Tim Dekorasi', role: 'Decoration Team', description: 'Ahli dalam menciptakan desain kue yang memukau.' },
    ];

    return (
        <UserLayout>
            <Head title="Tentang Kami - Angel Cake'S" />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
                <div className="container mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 rounded-full mb-6">
                        <ChefHat className="w-5 h-5 text-pink-600" />
                        <span className="text-pink-600 font-semibold text-sm">Tentang Kami</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Cerita di Balik{' '}
                        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                            Angel Cake's
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Didirikan dengan semangat untuk berbagi kebahagiaan melalui setiap gigitan kue. 
                        Kami percaya bahwa kue bukan hanya makanan, tetapi juga simbol cinta dan kebahagiaan.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-6">Kisah Kami</h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    <strong>Angel Cake's</strong> bermula dari dapur kecil dengan mimpi besar. 
                                    Berawal dari hobi membuat kue untuk keluarga dan teman-teman, 
                                    kini telah berkembang menjadi toko kue yang dicintai masyarakat Jayapura.
                                </p>
                                <p>
                                    Setiap kue yang kami buat adalah hasil dari resep rahasia yang telah 
                                    disempurnakan selama bertahun-tahun. Kami selalu mengutamakan kesegaran 
                                    dan kualitas bahan, karena kami percaya bahwa kue yang baik dimulai dari 
                                    bahan yang baik.
                                </p>
                                <p>
                                    Dengan dedikasi dan semangat yang tinggi, kami terus berinovasi untuk 
                                    menghadirkan varian kue yang lezat dan unik. Kepuasan pelanggan adalah 
                                    motivasi terbesar kami untuk terus berkarya.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 rounded-3xl blur-2xl opacity-50"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1556217477-d325251ece38?w=600" 
                                alt="Angel Cake's Kitchen" 
                                className="relative rounded-3xl shadow-2xl w-full h-96 object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Nilai-Nilai Kami</h2>
                        <p className="text-xl text-gray-600">Prinsip yang kami pegang dalam setiap karya</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            const colors = ['from-pink-400 to-pink-600', 'from-purple-400 to-purple-600', 'from-blue-400 to-blue-600', 'from-green-400 to-green-600'];
                            return (
                                <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all group">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[index]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-pink-50 to-purple-50">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Perjalanan Kami</h2>
                        <p className="text-xl text-gray-600">Milestone penting dalam sejarah Angel Cake's</p>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        {milestones.map((milestone, index) => (
                            <div key={index} className="flex gap-6 mb-8">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                        {milestone.year}
                                    </div>
                                    {index < milestones.length - 1 && (
                                        <div className="w-0.5 h-full bg-gradient-to-b from-pink-300 to-purple-300 mt-2"></div>
                                    )}
                                </div>
                                <div className="bg-white rounded-2xl p-6 shadow-lg flex-1">
                                    <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                                    <p className="text-gray-600">{milestone.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Tim Kami</h2>
                        <p className="text-xl text-gray-600">Orang-orang hebat di balik kue-kue lezat</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-center group">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Cake className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                <p className="text-pink-500 font-medium mb-3">{member.role}</p>
                                <p className="text-gray-600">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 text-center text-white">
                        <div>
                            <div className="text-5xl font-bold mb-2">500+</div>
                            <div className="opacity-90">Pelanggan Puas</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">50+</div>
                            <div className="opacity-90">Varian Kue</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">6+</div>
                            <div className="opacity-90">Tahun Pengalaman</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">4.9</div>
                            <div className="opacity-90">Rating Pelanggan</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Mengapa Memilih Kami?</h2>
                        <p className="text-xl text-gray-600">Beberapa alasan mengapa Angel Cake's adalah pilihan tepat</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {[
                            'Bahan-bahan premium berkualitas tinggi',
                            'Resep rahasia yang telah disempurnakan',
                            'Tanpa bahan pengawet berbahaya',
                            'Proses produksi higienis dan bersih',
                            'Pengiriman cepat dan tepat waktu',
                            'Harga terjangkau dengan kualitas terbaik',
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                                <span className="text-gray-700 font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </UserLayout>
    );
}
