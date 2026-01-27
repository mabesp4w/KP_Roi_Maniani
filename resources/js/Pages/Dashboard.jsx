import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Card, { CardBody, CardHeader, CardTitle } from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="text-xl font-semibold leading-tight text-base-content">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardBody>
                            <CardTitle>Selamat Datang!</CardTitle>
                            <p className="mt-2">Anda telah berhasil login ke sistem.</p>
                            <div className="mt-4 flex gap-4">
                                {auth.user.role === 'admin' && (
                                    <Link href={route('admin.dashboard')}>
                                        <Button variant="primary">Ke Dashboard Admin</Button>
                                    </Link>
                                )}
                                {auth.user.role === 'petugas' && (
                                    <Link href={route('petugas.dashboard')}>
                                        <Button variant="primary">Ke Dashboard Petugas</Button>
                                    </Link>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
