import { Head, Link, useForm } from '@inertiajs/react';
import { Cake, Mail, Lock } from 'lucide-react';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardHeader, CardTitle } from '@/Components/ui/Card';
import Alert from '@/Components/ui/Alert';
import TextInput from '@/Components/forms/TextInput';
import CheckboxInput from '@/Components/forms/CheckboxInput';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login - Angel Cake'S" />

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
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Selamat Datang Kembali!</h1>
                        <p className="text-gray-600">Login untuk melanjutkan pesanan Anda</p>
                    </div>

                    {/* Login Card */}
                    <Card className="shadow-xl" data-aos="fade-up">
                        <CardHeader>
                            <CardTitle className="text-center">Login</CardTitle>
                        </CardHeader>
                        <CardBody>
                            {status && <Alert variant="success" className="mb-4">{status}</Alert>}

                            <form onSubmit={submit} className="space-y-6">
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
                                    autoFocus
                                />

                                {/* Password */}
                                <TextInput
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Masukkan password"
                                    icon={Lock}
                                    error={errors.password}
                                    autoComplete="current-password"
                                />

                                {/* Remember & Forgot */}
                                <div className="flex items-center justify-between">
                                    <CheckboxInput
                                        label="Ingat saya"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    {canResetPassword && (
                                        <Link href={route('password.request')} className="text-sm text-pink-500 hover:text-pink-600 font-medium">
                                            Lupa password?
                                        </Link>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button type="submit" variant="primary" className="w-full" loading={processing}>
                                    Login
                                </Button>
                            </form>

                            {/* Register Link */}
                            <div className="mt-6 text-center">
                                <p className="text-gray-600">
                                    Belum punya akun?{' '}
                                    <Link href={route('register')} className="text-pink-500 hover:text-pink-600 font-semibold">
                                        Daftar Sekarang
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
