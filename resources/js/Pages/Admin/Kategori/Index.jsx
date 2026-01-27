import ConfirmDialog from '@/Components/modal/ConfirmDialog';
import ModalKategori from '@/Components/pages/kategori/ModalKategori';
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

export default function Index({ kategori, filters }) {
    const { props } = usePage();
    const [search, setSearch] = useState(filters.search || '');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [kategoriToDelete, setKategoriToDelete] = useState(null);
    const [sort, setSort] = useState(filters.sort || 'nama_kategori');
    const [direction, setDirection] = useState(filters.direction || 'asc');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [kategoriToEdit, setKategoriToEdit] = useState(null);

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
            route('admin.kategori.index'),
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
            route('admin.kategori.index'),
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

    const handleDelete = (kat) => {
        setKategoriToDelete(kat);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (kategoriToDelete) {
            router.delete(`/admin/kategori/${kategoriToDelete.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDeleteDialog(false);
                    setKategoriToDelete(null);
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                    if (errors.message) {
                        toast.error(errors.message);
                    } else if (Object.values(errors).length > 0) {
                        toast.error(Object.values(errors)[0]);
                    } else {
                        toast.error('Terjadi kesalahan saat menghapus kategori');
                    }
                },
            });
        }
    };

    const handleEdit = (kat) => {
        setKategoriToEdit(kat);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setKategoriToEdit(null);
    };

    return (
        <AdminLayout auth={props.auth} header="Data Kategori">
            <Head title="Data Kategori" />

            <div className="space-y-6">
                {/* Search & Create */}
                <Card>
                    <CardBody>
                        <div className="flex gap-4">
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                onSubmit={handleSearch}
                                placeholder="Cari kategori..."
                                className="flex-1"
                            />
                            <Button variant="primary" className="gap-2" onClick={() => setShowCreateModal(true)}>
                                <Plus size={18} />
                                Tambah Kategori
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Kategori ({kategori.total})</CardTitle>
                    </CardHeader>
                    <CardBody className="p-0">
                        <Table
                            headers={[
                                { label: 'No', key: 'no', sortable: false },
                                {
                                    label: 'Nama Kategori',
                                    key: 'nama_kategori',
                                    sortable: true,
                                },
                                { label: 'Jumlah Produk', key: 'produk', sortable: false },
                                { label: 'Aksi', key: 'aksi', sortable: false },
                            ]}
                            data={kategori.data}
                            renderRow={(kat, index) => (
                                <tr key={kat.id}>
                                    <td>{(kategori.current_page - 1) * kategori.per_page + index + 1}</td>
                                    <td>{kat.nama_kategori}</td>
                                    <td>
                                        <Badge variant="info">{kat.produks_count || 0} produk</Badge>
                                    </td>
                                    <td>
                                        <ActionButtons onEdit={() => handleEdit(kat)} onDelete={() => handleDelete(kat)} />
                                    </td>
                                </tr>
                            )}
                            emptyMessage="Tidak ada data kategori"
                            emptyColSpan={4}
                            sortConfig={{ key: sort, direction }}
                            onSort={handleSort}
                        />
                    </CardBody>
                </Card>

                {/* Pagination */}
                <Pagination links={kategori.links} />
            </div>

            {/* Create Modal */}
            <ModalKategori
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => {
                    setShowCreateModal(false);
                    router.reload();
                }}
            />

            {/* Edit Modal */}
            <ModalKategori
                isOpen={showEditModal}
                onClose={handleCloseEditModal}
                kategori={kategoriToEdit}
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
                title="Hapus Kategori"
                message={`Apakah Anda yakin ingin menghapus kategori "${kategoriToDelete?.nama_kategori}"?`}
            />
        </AdminLayout>
    );
}
