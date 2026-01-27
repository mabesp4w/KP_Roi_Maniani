import SimpleInput from '@/Components/forms/SimpleInput';
import { Modal } from '@/Components/modal';
import Button from '@/Components/ui/Button';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ModalKecamatan({ isOpen, onClose, kecamatan = null, onSuccess }) {
    const isEdit = !!kecamatan;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nama_kecamatan: '',
    });

    // Update form data when kecamatan prop changes (for edit mode)
    useEffect(() => {
        if (kecamatan) {
            setData('nama_kecamatan', kecamatan.nama_kecamatan);
        } else {
            setData('nama_kecamatan', '');
        }
    }, [kecamatan, setData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit) {
            put(`/admin/kecamatan/${kecamatan.id}`, {
                onSuccess: () => {
                    onClose();
                    reset();
                    if (onSuccess) onSuccess();
                },
                onError: (errors) => {
                    if (errors.message) {
                        toast.error(errors.message);
                    } else if (Object.values(errors).length > 0) {
                        toast.error(Object.values(errors)[0]);
                    } else {
                        toast.error('Terjadi kesalahan saat mengubah kecamatan');
                    }
                },
            });
        } else {
            post(`/admin/kecamatan`, {
                onSuccess: () => {
                    onClose();
                    reset();
                    if (onSuccess) onSuccess();
                },
                onError: (errors) => {
                    if (errors.message) {
                        toast.error(errors.message);
                    } else if (Object.values(errors).length > 0) {
                        toast.error(Object.values(errors)[0]);
                    } else {
                        toast.error('Terjadi kesalahan saat menambah kecamatan');
                    }
                },
            });
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal id="modal-kecamatan" isOpen={isOpen} onClose={handleClose} size="md">
            <div className="space-y-4">
                <h3 className="text-lg font-bold">{isEdit ? 'Edit Kecamatan' : 'Tambah Kecamatan'}</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <SimpleInput
                        label="Nama Kecamatan"
                        name="nama_kecamatan"
                        value={data.nama_kecamatan}
                        onChange={(e) => setData('nama_kecamatan', e.target.value)}
                        error={errors.nama_kecamatan}
                        placeholder="Contoh: Kecamatan Example"
                        required
                        autoFocus
                    />

                    <div className="text-sm text-base-content/60">
                        <p>Catatan: Nama kecamatan harus unik dan tidak boleh sama dengan kecamatan lain yang sudah ada.</p>
                    </div>

                    <div className="modal-action">
                        <Button variant="outline" type="button" onClick={handleClose} disabled={processing}>
                            Batal
                        </Button>
                        <Button variant="primary" type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
