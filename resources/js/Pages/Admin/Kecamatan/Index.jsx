import ConfirmDialog from '@/Components/modal/ConfirmDialog';
import ModalKecamatan from '@/Components/pages/kecamatan/ModalKecamatan';
import ActionButtons from '@/Components/ui/ActionButtons';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardHeader, CardTitle } from '@/Components/ui/Card';
import Pagination from '@/Components/ui/Pagination';
import SearchInput from '@/Components/ui/SearchInput';
import Table from '@/Components/ui/Table';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Index({ kecamatan, filters }) {
    const { props } = usePage();
    const auth = props.auth;
    const [search, setSearch] = useState(filters.search || '');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [kecamatanToDelete, setKecamatanToDelete] = useState(null);
    const [sort, setSort] = useState(filters.sort || 'nama_kecamatan');
    const [direction, setDirection] = useState(filters.direction || 'asc');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [kecamatanToEdit, setKecamatanToEdit] = useState(null);

    // Handle flash messages
    useEffect(() => {
        if (props.success) {
            toast.success(props.success);
        }
        if (props.error) {
            toast.error(props.error);
        }
    }, [props.success, props.error]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('admin.kecamatan.index'),
            { search, sort, direction },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSort = (column) => {
        const newDirection = sort === column && direction === 'asc' ? 'desc' : 'asc';
        setSort(column);
        setDirection(newDirection);
        router.get(
            route('admin.kecamatan.index'),
            {
                search,
                sort: column,
                direction: newDirection,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (kec) => {
        setKecamatanToDelete(kec);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (kecamatanToDelete) {
            const deleteUrl = `/admin/kecamatan/${kecamatanToDelete.id}`;
            router.delete(deleteUrl, {
                preserveScroll: true,
                onSuccess: (page) => {
                    setShowDeleteDialog(false);
                    setKecamatanToDelete(null);
                    // Toast will be handled by useEffect from props
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                    if (errors.message) {
                        toast.error(errors.message);
                    } else if (Object.values(errors).length > 0) {
                        toast.error(Object.values(errors)[0]);
                    } else {
                        toast.error('Terjadi kesalahan saat menghapus kecamatan');
                    }
                },
            });
        }
    };

    const handleEdit = (kec) => {
        setKecamatanToEdit(kec);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setKecamatanToEdit(null);
    };

    return (
        <AdminLayout auth={props.auth} header="Data Kecamatan">
            <Head title="Data Kecamatan" />

            <div className="space-y-6">
                {/* Search & Create */}
                <Card data-aos="fade-down">
                    <CardBody>
                        <div className="flex gap-4">
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                onSubmit={handleSearch}
                                placeholder="Cari kecamatan..."
                                className="flex-1"
                            />
                            <Button variant="primary" className="gap-2" onClick={() => setShowCreateModal(true)}>
                                <Plus size={18} />
                                Tambah Kecamatan
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Table */}
                <Card data-aos="fade-up" data-aos-delay="100">
                    <CardHeader>
                        <CardTitle>Daftar Kecamatan ({kecamatan.total})</CardTitle>
                    </CardHeader>
                    <CardBody className="p-0">
                        <Table
                            headers={[
                                { label: 'No', key: 'no', sortable: false },
                                {
                                    label: 'Nama Kecamatan',
                                    key: 'nama_kecamatan',
                                    sortable: true,
                                },
                                { label: 'Ongkir', key: 'ongkir', sortable: false },
                                { label: 'Aksi', key: 'aksi', sortable: false },
                            ]}
                            data={kecamatan.data}
                            renderRow={(kec, index) => (
                                <tr key={kec.id}>
                                    <td>{(kecamatan.current_page - 1) * kecamatan.per_page + index + 1}</td>
                                    <td>{kec.nama_kecamatan}</td>
                                    <td>
                                        <Badge variant="info">{kec.ongkir_count || 0} ongkir</Badge>
                                    </td>
                                    <td>
                                        <ActionButtons onEdit={() => handleEdit(kec)} onDelete={() => handleDelete(kec)} />
                                    </td>
                                </tr>
                            )}
                            emptyMessage="Tidak ada data kecamatan"
                            emptyColSpan={4}
                            sortConfig={{ key: sort, direction }}
                            onSort={handleSort}
                        />
                    </CardBody>
                </Card>

                {/* Pagination */}
                <Pagination links={kecamatan.links} />
            </div>

            {/* Create Modal */}
            <ModalKecamatan
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => {
                    setShowCreateModal(false);
                    router.reload();
                }}
            />

            {/* Edit Modal */}
            <ModalKecamatan
                isOpen={showEditModal}
                onClose={handleCloseEditModal}
                kecamatan={kecamatanToEdit}
                onSuccess={() => {
                    handleCloseEditModal();
                    router.reload();
                }}
            />

            {/* Delete Confirm Dialog */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={confirmDelete}
                title="Hapus Kecamatan"
                message={`Apakah Anda yakin ingin menghapus kecamatan "${kecamatanToDelete?.nama_kecamatan}"?`}
            />
        </AdminLayout>
    );
}
