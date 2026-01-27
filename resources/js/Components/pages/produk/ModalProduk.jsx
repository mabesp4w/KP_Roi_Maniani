import FormInput from '@/Components/forms/FormInput';
import FormSelect from '@/Components/forms/FormSelect';
import { Modal } from '@/Components/modal';
import Button from '@/Components/ui/Button';
import { router } from '@inertiajs/react';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

// Validation schema
const schema = yup.object({
    kategori_id: yup.string().required('Kategori wajib dipilih'),
    nama_produk: yup.string().required('Nama produk wajib diisi'),
});

export default function ModalProduk({ isOpen, onClose, produk = null, onSuccess }) {
    const isEdit = !!produk;
    const [kategoriList, setKategoriList] = useState([]);
    const [loadingKategori, setLoadingKategori] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            kategori_id: '',
            nama_produk: '',
        },
    });

    const { handleSubmit, reset } = methods;

    // Fetch kategori list
    useEffect(() => {
        const fetchKategori = async () => {
            setLoadingKategori(true);
            try {
                const response = await axios.get(route('admin.kategori.list'));
                setKategoriList(response.data);
            } catch (error) {
                console.error('Error fetching kategori:', error);
                toast.error('Gagal memuat daftar kategori');
            } finally {
                setLoadingKategori(false);
            }
        };

        if (isOpen) {
            fetchKategori();
        }
    }, [isOpen]);

    // Update form data when produk prop changes (for edit mode)
    useEffect(() => {
        if (produk) {
            reset({
                kategori_id: produk.kategori_id || '',
                nama_produk: produk.nama_produk || '',
            });
        } else {
            reset({
                kategori_id: '',
                nama_produk: '',
            });
        }
    }, [produk, reset]);

    const onSubmit = (data) => {
        setSubmitting(true);

        const url = isEdit ? `/admin/produk/${produk.id}` : '/admin/produk';
        const method = isEdit ? 'put' : 'post';

        router[method](url, data, {
            onSuccess: () => {
                handleClose();
                if (onSuccess) onSuccess();
            },
            onError: (errors) => {
                console.error('Submit error:', errors);
                if (errors.message) {
                    toast.error(errors.message);
                } else if (Object.values(errors).length > 0) {
                    toast.error(Object.values(errors)[0]);
                } else {
                    toast.error(`Terjadi kesalahan saat ${isEdit ? 'mengubah' : 'menambah'} produk`);
                }
            },
            onFinish: () => {
                setSubmitting(false);
            },
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    // Transform kategori list to options format
    const kategoriOptions = kategoriList.map((kat) => ({
        value: kat.id,
        label: kat.nama_kategori,
    }));

    return (
        <Modal id="modal-produk" isOpen={isOpen} onClose={handleClose} size="md">
            <div className="space-y-4">
                <h3 className="text-lg font-bold">{isEdit ? 'Edit Produk' : 'Tambah Produk'}</h3>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormSelect
                            name="kategori_id"
                            label="Kategori"
                            options={kategoriOptions}
                            placeholder="Pilih Kategori"
                            isDisabled={submitting || loadingKategori}
                            isSearchable={true}
                            isClearable={false}
                            required
                        />

                        <FormInput
                            name="nama_produk"
                            label="Nama Produk"
                            placeholder="Contoh: Kue Ulang Tahun Coklat"
                            disabled={submitting}
                            required
                        />

                        <div className="modal-action">
                            <Button variant="outline" type="button" onClick={handleClose} disabled={submitting}>
                                Batal
                            </Button>
                            <Button variant="primary" type="submit" disabled={submitting || loadingKategori}>
                                {submitting ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </Modal>
    );
}
