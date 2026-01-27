import { Head, Link, useForm } from '@inertiajs/react';
import { Cake, Mail, Lock, User as UserIcon } from 'lucide-react';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardHeader, CardTitle } from '@/Components/ui/Card';
import Alert from '@/Components/ui/Alert';
import TextInput from '@/Components/forms/TextInput';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register - Angel Cake'S" />

            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Logo & Title */}
                    <div className="text-center mb-8" data-aos="fade-down">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <Cake className="w-12 h-12 text-pink-500" />
                            <span className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                                Angel Cake'S
                            </span>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Daftar Akun Baru</h1>
                        <p className="text-gray-600">Bergabunglah dan nikmati kue terbaik kami</p>
                    </div>

                    {/* Register Card */}
                    <Card className="shadow-xl" data-aos="fade-up">
                        <CardHeader>
                            <CardTitle className="text-center">Registrasi</CardTitle>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={submit} className="space-y-5">
                                {/* Name */}
                                <TextInput
                                    label="Nama Lengkap"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="John Doe"
                                    icon={UserIcon}
                                    error={errors.name}
                                    autoComplete="name"
                                    autoFocus
                                    required
                                />

                                {/* Email */}
                                <TextInput
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@example.com"
                                    icon={Mail}
                                    error={errors.email}
                                    autoComplete="username"
                                    required
                                />

                                {/* Password */}
                                <TextInput
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    icon={Lock}
                                    error={errors.password}
                                    autoComplete="new-password"
                                    required
                                />

                                {/* Password Confirmation */}
                                <TextInput
                                    label="Konfirmasi Password"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi password"
                                    icon={Lock}
                                    error={errors.password_confirmation}
                                    autoComplete="new-password"
                                    required
                                />

                                {/* Info Note */}
                                <Alert variant="info">
                                    <span className="text-sm">Alamat pengiriman dapat ditambahkan setelah login</span>
                                </Alert>

                                {/* Submit Button */}
                                <Button type="submit" variant="primary" className="w-full" loading={processing}>
                                    Daftar Sekarang
                                </Button>
                            </form>

                            {/* Login Link */}
                            <div className="mt-6 text-center">
                                <p className="text-gray-600">
                                    Sudah punya akun?{' '}
                                    <Link href={route('login')} className="text-pink-500 hover:text-pink-600 font-semibold">
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Back to Home */}
                    <div className="mt-6 text-center">
                        <Link href="/" className="text-gray-600 hover:text-gray-800 text-sm">
                            ← Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
