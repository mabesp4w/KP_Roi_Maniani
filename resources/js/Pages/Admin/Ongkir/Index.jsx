import ConfirmDialog from '@/Components/modal/ConfirmDialog';
import ModalOngkir from '@/Components/pages/ongkir/ModalOngkir';
import ActionButtons from '@/Components/ui/ActionButtons';
import Badge from '@/Components/ui/Badge';
import Button from '@/Components/ui/Button';
import Card, { CardBody, CardHeader, CardTitle } from '@/Components/ui/Card';
import Pagination from '@/Components/ui/Pagination';
import SearchInput from '@/Components/ui/SearchInput';
import Table from '@/Components/ui/Table';
import Select from '@/Components/ui/Select';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Index({ ongkir, filters }) {
    const { props } = usePage();
    const auth = props.auth;
    const [search, setSearch] = useState(filters.search || '');
    const [kecamatanFilter, setKecamatanFilter] = useState(filters.kecamatan_id || '');
    const [kecamatanList, setKecamatanList] = useState([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [ongkirToDelete, setOngkirToDelete] = useState(null);
    const [sort, setSort] = useState(filters.sort || 'nama_desa');
    const [direction, setDirection] = useState(filters.direction || 'asc');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [ongkirToEdit, setOngkirToEdit] = useState(null);

    // Fetch kecamatan list for filter
    useEffect(() => {
        const fetchKecamatan = async () => {
            try {
                const response = await axios.get(route('admin.kecamatan.list'));
                setKecamatanList(response.data);
            } catch (error) {
                console.error('Error fetching kecamatan:', error);
            }
        };
        fetchKecamatan();
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
            route('admin.ongkir.index'),
            { search, kecamatan_id: kecamatanFilter, sort, direction },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleKecamatanFilter = (selected) => {
        const value = selected ? selected.value : '';
        setKecamatanFilter(value);
        router.get(
            route('admin.ongkir.index'),
            { search, kecamatan_id: value, sort, direction },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleClearFilter = () => {
        setKecamatanFilter('');
        router.get(
            route('admin.ongkir.index'),
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
            route('admin.ongkir.index'),
            {
                search,
                kecamatan_id: kecamatanFilter,
                sort: column,
                direction: newDirection,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (ong) => {
        setOngkirToDelete(ong);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (ongkirToDelete) {
            const deleteUrl = `/admin/ongkir/${ongkirToDelete.id}`;
            router.delete(deleteUrl, {
                preserveScroll: true,
                onSuccess: (page) => {
                    setShowDeleteDialog(false);
                    setOngkirToDelete(null);
                    // Toast will be handled by useEffect from props
                },
                onError: (errors) => {
                    console.error('Delete error:', errors);
                    if (errors.message) {
                        toast.error(errors.message);
                    } else if (Object.values(errors).length > 0) {
                        toast.error(Object.values(errors)[0]);
                    } else {
                        toast.error('Terjadi kesalahan saat menghapus ongkir');
                    }
                },
            });
        }
    };

    const handleEdit = (ong) => {
        setOngkirToEdit(ong);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setOngkirToEdit(null);
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    // Transform kecamatan list to options format
    const kecamatanOptions = [
        { value: '', label: 'Semua Kecamatan' },
        ...kecamatanList.map((kec) => ({
            value: kec.id,
            label: kec.nama_kecamatan,
        })),
    ];

    // Get selected kecamatan for Select component
    const selectedKecamatan = kecamatanFilter
        ? kecamatanOptions.find((opt) => opt.value === kecamatanFilter)
        : kecamatanOptions[0];

    return (
        <AdminLayout auth={props.auth} header="Data Ongkir">
            <Head title="Data Ongkir" />

            <div className="space-y-6">
                {/* Search & Filter */}
                <Card>
                    <CardBody>
                        <div className="flex flex-col gap-4 md:flex-row">
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                onSubmit={handleSearch}
                                placeholder="Cari ongkir..."
                                className="flex-1"
                            />
                            <div className="flex gap-2">
                                <div className="w-full md:w-64">
                                    <Select
                                        options={kecamatanOptions}
                                        value={selectedKecamatan}
                                        onChange={handleKecamatanFilter}
                                        placeholder="Filter Kecamatan"
                                        isSearchable={true}
                                        isClearable={false}
                                    />
                                </div>
                                {kecamatanFilter && (
                                    <Button variant="outline" onClick={handleClearFilter} className="gap-2">
                                        <X size={16} />
                                        Clear
                                    </Button>
                                )}
                            </div>
                            <Button variant="primary" className="gap-2" onClick={() => setShowCreateModal(true)}>
                                <Plus size={18} />
                                Tambah Ongkir
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Ongkir ({ongkir.total})</CardTitle>
                    </CardHeader>
                    <CardBody className="p-0">
                        <Table
                            headers={[
                                { label: 'No', key: 'no', sortable: false },
                                {
                                    label: 'Kecamatan',
                                    key: 'kecamatan',
                                    sortable: false,
                                },
                                {
                                    label: 'Desa/Kelurahan',
                                    key: 'nama_desa',
                                    sortable: true,
                                },
                                {
                                    label: 'Ongkir',
                                    key: 'ongkir',
                                    sortable: true,
                                },
                                { label: 'Aksi', key: 'aksi', sortable: false },
                            ]}
                            data={ongkir.data}
                            renderRow={(ong, index) => (
                                <tr key={ong.id}>
                                    <td>{(ongkir.current_page - 1) * ongkir.per_page + index + 1}</td>
                                    <td>{ong.kecamatan?.nama_kecamatan || '-'}</td>
                                    <td>{ong.nama_desa}</td>
                                    <td>
                                        <Badge variant="success">{formatRupiah(ong.ongkir)}</Badge>
                                    </td>
                                    <td>
                                        <ActionButtons onEdit={() => handleEdit(ong)} onDelete={() => handleDelete(ong)} />
                                    </td>
                                </tr>
                            )}
                            emptyMessage="Tidak ada data ongkir"
                            emptyColSpan={5}
                            sortConfig={{ key: sort, direction }}
                            onSort={handleSort}
                        />
                    </CardBody>
                </Card>

                {/* Pagination */}
                <Pagination links={ongkir.links} />
            </div>

            {/* Create Modal */}
            <ModalOngkir
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => {
                    setShowCreateModal(false);
                    router.reload();
                }}
            />

            {/* Edit Modal */}
            <ModalOngkir
                isOpen={showEditModal}
                onClose={handleCloseEditModal}
                ongkir={ongkirToEdit}
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
                title="Hapus Ongkir"
                message={`Apakah Anda yakin ingin menghapus ongkir untuk "${ongkirToDelete?.nama_desa}"?`}
            />
        </AdminLayout>
    );
}
