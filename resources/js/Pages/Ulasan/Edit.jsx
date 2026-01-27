import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Star } from 'lucide-react';
import { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import Button from '@/Components/ui/Button';
import toast from 'react-hot-toast';

export default function UlasanEdit({ review }) {
    const [rating, setRating] = useState(review.rating);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [komentar, setKomentar] = useState(review.komentar || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            toast.error('Silakan pilih rating');
            return;
        }

        setIsSubmitting(true);
        
        router.put(route('ulasan.update', review.id), {
            rating,
            komentar,
        }, {
            onSuccess: () => {
                toast.success('Ulasan berhasil diperbarui!');
            },
            onError: () => {
                toast.error('Gagal memperbarui ulasan');
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const renderStar = (starNumber) => {
        const isActive = starNumber <= (hoveredRating || rating);
        return (
            <button
                key={starNumber}
                type="button"
                onClick={() => setRating(starNumber)}
                onMouseEnter={() => setHoveredRating(starNumber)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
            >
                <Star
                    className={`w-10 h-10 ${
                        isActive
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 hover:text-yellow-200'
                    }`}
                />
            </button>
        );
    };

    return (
        <UserLayout>
            <Head title="Edit Ulasan - Angel Cake'S" />

            <section className="pt-28 pb-12 px-4 min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-2xl">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/ulasan" className="btn btn-ghost btn-circle">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Edit Ulasan</h1>
                            <p className="text-gray-600 text-sm">Perbarui ulasan Anda</p>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            {/* Product Info */}
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                                <img
                                    src={review.image}
                                    alt={review.product_name}
                                    className="w-20 h-20 rounded-lg object-cover"
                                />
                                <div>
                                    <h3 className="font-semibold text-lg">{review.product_name}</h3>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="mb-6">
                                <label className="block font-semibold mb-3">Rating</label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map(renderStar)}
                                    <span className="ml-4 text-gray-600">
                                        {rating > 0 && (
                                            <>
                                                {rating === 1 && 'Sangat Buruk'}
                                                {rating === 2 && 'Buruk'}
                                                {rating === 3 && 'Cukup'}
                                                {rating === 4 && 'Baik'}
                                                {rating === 5 && 'Sangat Baik'}
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="mb-6">
                                <label className="block font-semibold mb-3">
                                    Komentar <span className="text-gray-400 font-normal">(opsional)</span>
                                </label>
                                <textarea
                                    value={komentar}
                                    onChange={(e) => setKomentar(e.target.value)}
                                    className="textarea textarea-bordered w-full h-32"
                                    placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                                    maxLength={500}
                                />
                                <p className="text-sm text-gray-500 mt-1">{komentar.length}/500 karakter</p>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <Link href="/ulasan" className="btn btn-outline flex-1">
                                    Batal
                                </Link>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="flex-1"
                                    loading={isSubmitting}
                                    disabled={isSubmitting || rating === 0}
                                >
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </UserLayout>
    );
}
