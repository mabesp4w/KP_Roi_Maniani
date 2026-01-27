import Input from '@/Components/forms/Input';
import { usePage } from '@inertiajs/react';
import Alert from '@/Components/ui/Alert';

export default function FormKecamatan({ data, errors, setData }) {
    return (
        <div className="space-y-4">
            {/* Success/Error Messages from Session */}
            {usePage().props.success && (
                <Alert variant="success">{usePage().props.success}</Alert>
            )}
            {usePage().props.error && (
                <Alert variant="error">{usePage().props.error}</Alert>
            )}

            <Input
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
        </div>
    );
}
