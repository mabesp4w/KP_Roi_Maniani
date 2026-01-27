import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import Card, { CardBody, CardHeader, CardTitle } from '@/Components/ui/Card';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';

export default function AdminDashboard({ auth }) {
    return (
        <AdminLayout
            auth={auth}
            header="Dashboard Admin"
        >
            <Head title="Dashboard Admin" />

            <div>
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6">
                        <div className="alert alert-info">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="h-6 w-6 shrink-0 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                            <span>Selamat datang, {auth.user.name}! Anda login sebagai Admin.</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardBody>
                                <CardTitle className="text-lg">Total Pengguna</CardTitle>
                                <p className="text-3xl font-bold">0</p>
                                <Badge variant="info" className="mt-2">
                                    Aktif
                                </Badge>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody>
                                <CardTitle className="text-lg">Total Petugas</CardTitle>
                                <p className="text-3xl font-bold">0</p>
                                <Badge variant="success" className="mt-2">
                                    Aktif
                                </Badge>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody>
                                <CardTitle className="text-lg">Total Data</CardTitle>
                                <p className="text-3xl font-bold">0</p>
                                <Badge variant="warning" className="mt-2">
                                    Pending
                                </Badge>
                            </CardBody>
                        </Card>
                    </div>

                    <div className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="primary">Kelola Pengguna</Button>
                                    <Button variant="secondary">Kelola Petugas</Button>
                                    <Button variant="accent">Laporan</Button>
                                    <Button variant="outline">Settings</Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

