import FormCurrencyInput from '@/Components/forms/FormCurrencyInput';
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
    kecamatan_id: yup.string().required('Kecamatan wajib dipilih'),
    nama_desa: yup.string().required('Nama desa/kelurahan wajib diisi'),
    ongkir: yup
        .number()
        .typeError('Ongkir harus berupa angka')
        .required('Ongkir wajib diisi')
        .min(0, 'Ongkir tidak boleh negatif'),
});

export default function ModalOngkir({ isOpen, onClose, ongkir = null, onSuccess }) {
    const isEdit = !!ongkir;
    const [kecamatanList, setKecamatanList] = useState([]);
    const [loadingKecamatan, setLoadingKecamatan] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            kecamatan_id: '',
            nama_desa: '',
            ongkir: '',
        },
    });

    const { handleSubmit, reset, setValue } = methods;

    // Fetch kecamatan list
    useEffect(() => {
        const fetchKecamatan = async () => {
            setLoadingKecamatan(true);
            try {
                const response = await axios.get(route('admin.kecamatan.list'));
                setKecamatanList(response.data);
            } catch (error) {
                console.error('Error fetching kecamatan:', error);
                toast.error('Gagal memuat daftar kecamatan');
            } finally {
                setLoadingKecamatan(false);
            }
        };

        if (isOpen) {
            fetchKecamatan();
        }
    }, [isOpen]);

    // Update form data when ongkir prop changes (for edit mode)
    useEffect(() => {
        if (ongkir) {
            reset({
                kecamatan_id: ongkir.kecamatan_id || '',
                nama_desa: ongkir.nama_desa || '',
                ongkir: ongkir.ongkir || '',
            });
        } else {
            reset({
                kecamatan_id: '',
                nama_desa: '',
                ongkir: '',
            });
        }
    }, [ongkir, reset]);

    const onSubmit = (data) => {
        setSubmitting(true);

        const url = isEdit ? `/admin/ongkir/${ongkir.id}` : '/admin/ongkir';
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
                    toast.error(`Terjadi kesalahan saat ${isEdit ? 'mengubah' : 'menambah'} ongkir`);
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

    // Transform kecamatan list to options format
    const kecamatanOptions = kecamatanList.map((kec) => ({
        value: kec.id,
        label: kec.nama_kecamatan,
    }));

    return (
        <Modal id="modal-ongkir" isOpen={isOpen} onClose={handleClose} size="md">
            <div className="space-y-4">
                <h3 className="text-lg font-bold">{isEdit ? 'Edit Ongkir' : 'Tambah Ongkir'}</h3>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormSelect
                            name="kecamatan_id"
                            label="Kecamatan"
                            options={kecamatanOptions}
                            placeholder="Pilih Kecamatan"
                            isDisabled={submitting || loadingKecamatan}
                            isSearchable={true}
                            isClearable={false}
                            required
                        />

                        <FormInput
                            name="nama_desa"
                            label="Nama Desa/Kelurahan"
                            placeholder="Contoh: Desa Example"
                            disabled={submitting}
                            required
                        />

                        <FormCurrencyInput
                            name="ongkir"
                            label="Ongkir"
                            placeholder="0"
                            disabled={submitting}
                            required
                        />

                        <div className="modal-action">
                            <Button variant="outline" type="button" onClick={handleClose} disabled={submitting}>
                                Batal
                            </Button>
                            <Button variant="primary" type="submit" disabled={submitting || loadingKecamatan}>
                                {submitting ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </Modal>
    );
}
