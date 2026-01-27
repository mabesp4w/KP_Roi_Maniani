import ConfirmDialog from '@/Components/modal/ConfirmDialog';
import ModalProduk from '@/Components/pages/produk/ModalProduk';
import ActionButtons from '@/Components/ui/ActionButtons';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardHeader, CardTitle } from '@/Components/ui/Card';
import Pagination from '@/Components/ui/Pagination';
import SearchInput from '@/Components/ui/SearchInput';
import Select from '@/Components/ui/Select';
import Table from '@/Components/ui/Table';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Index({ produk, filters }) {
    const { props } = usePage();
    const [search, setSearch] = useState(filters.search || '');
    const [kategoriFilter, setKategoriFilter] = useState(filters.kategori_id || '');
    const [kategoriList, setKategoriList] = useState([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [produkToDelete, setProdukToDelete] = useState(null);
    const [sort, setSort] = useState(filters.sort || 'nama_produk');
    const [direction, setDirection] = useState(filters.direction || 'asc');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [produkToEdit, setProdukToEdit] = useState(null);

    // Fetch kategori list for filter
    useEffect(() => {
        const fetchKategori = async () => {
            try {
                const response = await axios.get(route('admin.kategori.list'));
                setKategoriList(response.data);
            } catch (error) {
                console.error('Error fetching kategori:', error);
            }
        };
        fetchKategori();
    }, []);

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
            route('admin.produk.index'),
            { search, kategori_id: kategoriFilter, sort, direction },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleKategoriFilter = (selected) => {
        const value = selected ? selected.value : '';
        setKategoriFilter(value);
        router.get(
            route('admin.produk.index'),
            { search, kategori_id: value, sort, direction },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleClearFilter = () => {
        setKategoriFilter('');
        router.get(
            route('admin.produk.index'),
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
            route('admin.produk.index'),
            {
                search,
                kategori_id: kategoriFilter,
                sort: column,
                direction: newDirection,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (prod) => {
        setProdukToDelete(prod);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (produkToDelete) {
            router.delete(`/admin/produk/${produkToDelete.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDeleteDialog(false);
                    setProdukToDelete(null);
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                    if (errors.message) {
                        toast.error(errors.message);
                    } else if (Object.values(errors).length > 0) {
                        toast.error(Object.values(errors)[0]);
                    } else {
                        toast.error('Terjadi kesalahan saat menghapus produk');
                    }
                },
            });
        }
    };

    const handleEdit = (prod) => {
        setProdukToEdit(prod);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setProdukToEdit(null);
    };

    // Transform kategori list to options format
    const kategoriOptions = [
        { value: '', label: 'Semua Kategori' },
        ...kategoriList.map((kat) => ({
            value: kat.id,
            label: kat.nama_kategori,
        })),
    ];

    // Get selected kategori for Select component
    const selectedKategori = kategoriFilter
        ? kategoriOptions.find((opt) => opt.value === kategoriFilter)
        : kategoriOptions[0];

    return (
        <AdminLayout auth={props.auth} header="Data Produk">
            <Head title="Data Produk" />

            <div className="space-y-6">
                {/* Search & Filter */}
                <Card>
                    <CardBody>
                        <div className="flex flex-col gap-4 md:flex-row">
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                onSubmit={handleSearch}
                                placeholder="Cari produk..."
                                className="flex-1"
                            />
                            <div className="flex gap-2">
                                <div className="w-full md:w-64">
                                    <Select
                                        options={kategoriOptions}
                                        value={selectedKategori}
                                        onChange={handleKategoriFilter}
                                        placeholder="Filter Kategori"
                                        isSearchable={true}
                                        isClearable={false}
                                    />
                                </div>
                                {kategoriFilter && (
                                    <Button variant="outline" onClick={handleClearFilter} className="gap-2">
                                        <X size={16} />
                                        Clear
                                    </Button>
                                )}
                            </div>
                            <Button variant="primary" className="gap-2" onClick={() => setShowCreateModal(true)}>
                                <Plus size={18} />
                                Tambah Produk
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Produk ({produk.total})</CardTitle>
                    </CardHeader>
                    <CardBody className="p-0">
                        <Table
                            headers={[
                                { label: 'No', key: 'no', sortable: false },
                                {
                                    label: 'Nama Produk',
                                    key: 'nama_produk',
                                    sortable: true,
                                },
                                { label: 'Kategori', key: 'kategori', sortable: false },
                                { label: 'Jumlah Varian', key: 'varian', sortable: false },
                                { label: 'Aksi', key: 'aksi', sortable: false },
                            ]}
                            data={produk.data}
                            renderRow={(prod, index) => (
                                <tr key={prod.id}>
                                    <td>{(produk.current_page - 1) * produk.per_page + index + 1}</td>
                                    <td>{prod.nama_produk}</td>
                                    <td>
                                        <Badge variant="primary">{prod.kategori?.nama_kategori || '-'}</Badge>
                                    </td>
                                    <td>
                                        <Badge variant="info">{prod.varian_produks_count || 0} varian</Badge>
                                    </td>
                                    <td>
                                        <ActionButtons onEdit={() => handleEdit(prod)} onDelete={() => handleDelete(prod)} />
                                    </td>
                                </tr>
                            )}
                            emptyMessage="Tidak ada data produk"
                            emptyColSpan={5}
                            sortConfig={{ key: sort, direction }}
                            onSort={handleSort}
                        />
                    </CardBody>
                </Card>

                {/* Pagination */}
                <Pagination links={produk.links} />
            </div>

            {/* Create Modal */}
            <ModalProduk
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => {
                    setShowCreateModal(false);
                    router.reload();
                }}
            />

            {/* Edit Modal */}
            <ModalProduk
                isOpen={showEditModal}
                onClose={handleCloseEditModal}
                produk={produkToEdit}
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
                title="Hapus Produk"
                message={`Apakah Anda yakin ingin menghapus produk "${produkToDelete?.nama_produk}"?`}
            />
        </AdminLayout>
    );
}
