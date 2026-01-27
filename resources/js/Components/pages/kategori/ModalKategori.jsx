import FormInput from '@/Components/forms/FormInput';
import { Modal } from '@/Components/modal';
import Button from '@/Components/ui/Button';
import { router } from '@inertiajs/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';

// Validation schema
const schema = yup.object({
    nama_kategori: yup.string().required('Nama kategori wajib diisi'),
});

export default function ModalKategori({ isOpen, onClose, kategori = null, onSuccess }) {
    const isEdit = !!kategori;
    const [submitting, setSubmitting] = useState(false);

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            nama_kategori: '',
        },
    });

    const { handleSubmit, reset } = methods;

    // Update form data when kategori prop changes (for edit mode)
    useEffect(() => {
        if (kategori) {
            reset({
                nama_kategori: kategori.nama_kategori || '',
            });
        } else {
            reset({
                nama_kategori: '',
            });
        }
    }, [kategori, reset]);

    const onSubmit = (data) => {
        setSubmitting(true);

        const url = isEdit ? `/admin/kategori/${kategori.id}` : '/admin/kategori';
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
                    toast.error(`Terjadi kesalahan saat ${isEdit ? 'mengubah' : 'menambah'} kategori`);
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

    return (
        <Modal id="modal-kategori" isOpen={isOpen} onClose={handleClose} size="md">
            <div className="space-y-4">
                <h3 className="text-lg font-bold">{isEdit ? 'Edit Kategori' : 'Tambah Kategori'}</h3>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormInput
                            name="nama_kategori"
                            label="Nama Kategori"
                            placeholder="Contoh: Kue Ulang Tahun"
                            disabled={submitting}
                            required
                        />

                        <div className="modal-action">
                            <Button variant="outline" type="button" onClick={handleClose} disabled={submitting}>
                                Batal
                            </Button>
                            <Button variant="primary" type="submit" disabled={submitting}>
                                {submitting ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </Modal>
    );
}
