// Contoh penggunaan Form dengan react-hook-form dan zod/yup
import { z } from 'zod';
import Button from '../ui/Button';
import Form, { Checkbox, Input, Radio, Select, Textarea } from './index';

// Schema validasi dengan Zod
const formSchema = z.object({
    name: z.string().min(3, 'Nama minimal 3 karakter'),
    email: z.string().email('Email tidak valid'),
    message: z.string().min(10, 'Pesan minimal 10 karakter'),
    category: z.string().min(1, 'Pilih kategori'),
    agree: z.boolean().refine((val) => val === true, 'Anda harus menyetujui'),
    gender: z.string().min(1, 'Pilih jenis kelamin'),
});

export default function FormExample() {
    const handleSubmit = (data) => {
        console.log('Form data:', data);
        // Handle form submission
    };

    return (
        <Form
            schema={formSchema}
            onSubmit={handleSubmit}
            resolver="zod"
            defaultValues={{
                agree: false,
            }}
        >
            <Input name="name" label="Nama" placeholder="Masukkan nama" required />

            <Input name="email" label="Email" type="email" placeholder="email@example.com" required />

            <Select
                name="category"
                label="Kategori"
                placeholder="Pilih kategori"
                options={[
                    { value: '1', label: 'Kategori 1' },
                    { value: '2', label: 'Kategori 2' },
                    { value: '3', label: 'Kategori 3' },
                ]}
                required
            />

            <Textarea name="message" label="Pesan" placeholder="Tulis pesan Anda" rows={5} required />

            <Radio
                name="gender"
                label="Jenis Kelamin"
                options={[
                    { value: 'male', label: 'Laki-laki' },
                    { value: 'female', label: 'Perempuan' },
                ]}
                required
            />

            <Checkbox name="agree" label="Saya setuju dengan syarat dan ketentuan" required />

            <div className="form-control mt-6">
                <Button type="submit" variant="primary">
                    Submit
                </Button>
            </div>
        </Form>
    );
}
