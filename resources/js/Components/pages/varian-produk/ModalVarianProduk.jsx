import FormCurrencyInput from '@/Components/forms/FormCurrencyInput';
import FormInput from '@/Components/forms/FormInput';
import FormSelect from '@/Components/forms/FormSelect';
import FileUpload from '@/Components/forms/FileUpload';
import ExistingImages from '@/Components/forms/ExistingImages';
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
    produk_id: yup.string().required('Produk wajib dipilih'),
    nama_atribut: yup.string().required('Nama atribut wajib diisi'),
    nama_varian: yup.string().required('Nama varian wajib diisi'),
    harga: yup.number().required('Harga wajib diisi').min(0, 'Harga tidak boleh negatif'),
    stok: yup.number().required('Stok wajib diisi').min(0, 'Stok tidak boleh negatif'),
    deskripsi: yup.string().nullable(),
});

export default function ModalVarianProduk({ isOpen, onClose, varianProduk = null, onSuccess }) {
    const isEdit = !!varianProduk;
    const [produkList, setProdukList] = useState([]);
    const [loadingProduk, setLoadingProduk] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            produk_id: '',
            nama_atribut: '',
            nama_varian: '',
            harga: 0,
            stok: 0,
            deskripsi: '',
        },
    });

    const { handleSubmit, reset } = methods;

    // Fetch produk list
    useEffect(() => {
        const fetchProduk = async () => {
            setLoadingProduk(true);
            try {
                const response = await axios.get(route('admin.produk.list'));
                setProdukList(response.data);
            } catch (error) {
                console.error('Error fetching produk:', error);
                toast.error('Gagal memuat daftar produk');
            } finally {
                setLoadingProduk(false);
            }
        };

        if (isOpen) {
            fetchProduk();
        }
    }, [isOpen]);

    // Update form data when varianProduk prop changes (for edit mode)
    useEffect(() => {
        if (varianProduk) {
            reset({
                produk_id: varianProduk.produk_id || '',
                nama_atribut: varianProduk.nama_atribut || '',
                nama_varian: varianProduk.nama_varian || '',
                harga: varianProduk.harga || 0,
                stok: varianProduk.stok || 0,
                deskripsi: varianProduk.deskripsi || '',
            });
        } else {
            reset({
                produk_id: '',
                nama_atribut: '',
                nama_varian: '',
                harga: 0,
                stok: 0,
                deskripsi: '',
            });
        }
    }, [varianProduk, reset]);

    const onSubmit = (data) => {
        setSubmitting(true);

        const url = isEdit ? `/admin/varian-produk/${varianProduk.id}` : '/admin/varian-produk';
        const method = isEdit ? 'post' : 'post'; // Both use POST for file upload

        // Create FormData for file upload
        const formData = new FormData();
        formData.append('produk_id', data.produk_id);
        formData.append('nama_atribut', data.nama_atribut);
        formData.append('nama_varian', data.nama_varian);
        formData.append('harga', data.harga);
        formData.append('stok', data.stok);
        if (data.deskripsi) formData.append('deskripsi', data.deskripsi);

        // Add images
        selectedImages.forEach((image) => {
            formData.append('gambar[]', image);
        });

        // Add _method for PUT if editing
        if (isEdit) {
            formData.append('_method', 'PUT');
        }

        router.post(url, formData, {
            forceFormData: true,
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
                    toast.error(`Terjadi kesalahan saat ${isEdit ? 'mengubah' : 'menambah'} varian produk`);
                }
            },
            onFinish: () => {
                setSubmitting(false);
            },
        });
    };

    const handleClose = () => {
        reset();
        setSelectedImages([]);
        onClose();
    };

    // Transform produk list to options format
    const produkOptions = produkList.map((prod) => ({
        value: prod.id,
        label: `${prod.nama_produk} (${prod.kategori?.nama_kategori || '-'})`,
    }));

    return (
        <Modal id="modal-varian-produk" isOpen={isOpen} onClose={handleClose} size="3xl" className="max-h-[90vh] overflow-y-auto">
            <div className="space-y-4">
                <h3 className="text-lg font-bold">{isEdit ? 'Edit Varian Produk' : 'Tambah Varian Produk'}</h3>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormSelect
                            name="produk_id"
                            label="Produk"
                            options={produkOptions}
                            placeholder="Pilih Produk"
                            isDisabled={submitting || loadingProduk}
                            isSearchable={true}
                            isClearable={false}
                            required
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormInput
                                name="nama_atribut"
                                label="Nama Atribut"
                                placeholder="Contoh: Ukuran, Warna, Rasa"
                                disabled={submitting}
                                required
                            />

                            <FormInput
                                name="nama_varian"
                                label="Nama Varian"
                                placeholder="Contoh: Kecil, Merah, Coklat"
                                disabled={submitting}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormCurrencyInput
                                name="harga"
                                label="Harga"
                                placeholder="0"
                                disabled={submitting}
                                required
                            />

                            <FormInput
                                name="stok"
                                label="Stok"
                                type="number"
                                placeholder="0"
                                min="0"
                                disabled={submitting}
                                required
                            />
                        </div>


                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium">Deskripsi (Opsional)</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered w-full h-24 resize-none"
                                placeholder="Tambahkan deskripsi detail varian produk..."
                                disabled={submitting}
                                {...methods.register('deskripsi')}
                            />
                            <label className="label">
                                <span className="label-text-alt text-base-content/60">
                                    Contoh: Ukuran diameter 20cm, cocok untuk 8-10 orang
                                </span>
                            </label>
                        </div>

                        {/* Existing Images - Only show in edit mode */}
                        {isEdit && varianProduk?.gambar_produks && varianProduk.gambar_produks.length > 0 && (
                            <ExistingImages
                                images={varianProduk.gambar_produks}
                                varianProdukId={varianProduk.id}
                            />
                        )}

                        <FileUpload
                            label="Gambar Produk (Opsional)"
                            name="gambar"
                            accept="image/*"
                            multiple={true}
                            maxSize={2}
                            onChange={setSelectedImages}
                            disabled={submitting}
                            helperText="Format: JPEG, PNG, JPG, WEBP. Maksimal 2MB per file. File yang melebihi batas akan ditolak."
                        />

                        <div className="modal-action">
                            <Button variant="outline" type="button" onClick={handleClose} disabled={submitting}>
                                Batal
                            </Button>
                            <Button variant="primary" type="submit" disabled={submitting || loadingProduk}>
                                {submitting ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </Modal>
    );
}
