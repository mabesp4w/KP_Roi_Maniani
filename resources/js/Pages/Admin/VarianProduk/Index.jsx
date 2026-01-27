import ConfirmDialog from '@/Components/modal/ConfirmDialog';
import ModalVarianProduk from '@/Components/pages/varian-produk/ModalVarianProduk';
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

export default function Index({ varianProduk, filters }) {
    const { props } = usePage();
    const [search, setSearch] = useState(filters.search || '');
    const [produkFilter, setProdukFilter] = useState(filters.produk_id || '');
    const [produkList, setProdukList] = useState([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [varianToDelete, setVarianToDelete] = useState(null);
    const [sort, setSort] = useState(filters.sort || 'nama_varian');
    const [direction, setDirection] = useState(filters.direction || 'asc');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [varianToEdit, setVarianToEdit] = useState(null);

    // Fetch produk list for filter
    useEffect(() => {
        const fetchProduk = async () => {
            try {
                const response = await axios.get(route('admin.produk.list'));
                setProdukList(response.data);
            } catch (error) {
                console.error('Error fetching produk:', error);
            }
        };
        fetchProduk();
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
            route('admin.varian-produk.index'),
            { search, produk_id: produkFilter, sort, direction },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleProdukFilter = (selected) => {
        const value = selected ? selected.value : '';
        setProdukFilter(value);
        router.get(
            route('admin.varian-produk.index'),
            { search, produk_id: value, sort, direction },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleClearFilter = () => {
        setProdukFilter('');
        router.get(
            route('admin.varian-produk.index'),
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
            route('admin.varian-produk.index'),
            {
                search,
                produk_id: produkFilter,
                sort: column,
                direction: newDirection,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (varian) => {
        setVarianToDelete(varian);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (varianToDelete) {
            router.delete(`/admin/varian-produk/${varianToDelete.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDeleteDialog(false);
                    setVarianToDelete(null);
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                    if (errors.message) {
                        toast.error(errors.message);
                    } else if (Object.values(errors).length > 0) {
                        toast.error(Object.values(errors)[0]);
                    } else {
                        toast.error('Terjadi kesalahan saat menghapus varian produk');
                    }
                },
            });
        }
    };

    const handleEdit = (varian) => {
        setVarianToEdit(varian);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setVarianToEdit(null);
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    // Transform produk list to options format
    const produkOptions = [
        { value: '', label: 'Semua Produk' },
        ...produkList.map((prod) => ({
            value: prod.id,
            label: `${prod.nama_produk} (${prod.kategori?.nama_kategori || '-'})`,
        })),
    ];

    // Get selected produk for Select component
    const selectedProduk = produkFilter ? produkOptions.find((opt) => opt.value === produkFilter) : produkOptions[0];

    return (
        <AdminLayout auth={props.auth} header="Data Varian Produk">
            <Head title="Data Varian Produk" />

            <div className="space-y-6">
                {/* Search & Filter */}
                <Card>
                    <CardBody>
                        <div className="flex flex-col gap-4 md:flex-row">
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                onSubmit={handleSearch}
                                placeholder="Cari varian produk..."
                                className="flex-1"
                            />
                            <div className="flex gap-2">
                                <div className="w-full md:w-80">
                                    <Select
                                        options={produkOptions}
                                        value={selectedProduk}
                                        onChange={handleProdukFilter}
                                        placeholder="Filter Produk"
                                        isSearchable={true}
                                        isClearable={false}
                                    />
                                </div>
                                {produkFilter && (
                                    <Button variant="outline" onClick={handleClearFilter} className="gap-2">
                                        <X size={16} />
                                        Clear
                                    </Button>
                                )}
                            </div>
                            <Button variant="primary" className="gap-2" onClick={() => setShowCreateModal(true)}>
                                <Plus size={18} />
                                Tambah Varian
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Varian Produk ({varianProduk.total})</CardTitle>
                    </CardHeader>
                    <CardBody className="p-0">
                        <Table
                            headers={[
                                { label: 'No', key: 'no', sortable: false },
                                { label: 'Produk', key: 'produk', sortable: false },
                                { label: 'Atribut', key: 'nama_atribut', sortable: true },
                                { label: 'Varian', key: 'nama_varian', sortable: true },
                                { label: 'Harga', key: 'harga', sortable: true },
                                { label: 'Stok', key: 'stok', sortable: true },
                                { label: 'Aksi', key: 'aksi', sortable: false },
                            ]}
                            data={varianProduk.data}
                            renderRow={(varian, index) => (
                                <tr key={varian.id}>
                                    <td>{(varianProduk.current_page - 1) * varianProduk.per_page + index + 1}</td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{varian.produk?.nama_produk || '-'}</span>
                                            <span className="text-xs text-base-content/60">
                                                {varian.produk?.kategori?.nama_kategori || '-'}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <Badge variant="secondary">{varian.nama_atribut}</Badge>
                                    </td>
                                    <td>{varian.nama_varian}</td>
                                    <td className="font-medium">{formatRupiah(varian.harga)}</td>
                                    <td>
                                        <Badge variant={varian.stok > 0 ? 'success' : 'error'}>
                                            {varian.stok} unit
                                        </Badge>
                                    </td>
                                    <td>
                                        <ActionButtons onEdit={() => handleEdit(varian)} onDelete={() => handleDelete(varian)} />
                                    </td>
                                </tr>
                            )}
                            emptyMessage="Tidak ada data varian produk"
                            emptyColSpan={7}
                            sortConfig={{ key: sort, direction }}
                            onSort={handleSort}
                        />
                    </CardBody>
                </Card>

                {/* Pagination */}
                <Pagination links={varianProduk.links} />
            </div>

            {/* Create Modal */}
            <ModalVarianProduk
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => {
                    setShowCreateModal(false);
                    router.reload();
                }}
            />

            {/* Edit Modal */}
            <ModalVarianProduk
                isOpen={showEditModal}
                onClose={handleCloseEditModal}
                varianProduk={varianToEdit}
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
                title="Hapus Varian Produk"
                message={`Apakah Anda yakin ingin menghapus varian "${varianToDelete?.nama_varian}" dari produk "${varianToDelete?.produk?.nama_produk}"?`}
            />
        </AdminLayout>
    );
}
