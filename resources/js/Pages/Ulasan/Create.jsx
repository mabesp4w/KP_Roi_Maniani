import { Head, Link, router } from '@inertiajs/react';
import { Star, ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import Button from '@/Components/ui/Button';
import toast from 'react-hot-toast';

export default function UlasanCreate({ pesanan, items }) {
    const [reviews, setReviews] = useState(
        items.map(item => ({
            varian_produk_id: item.varian_produk_id,
            rating: 5,
            komentar: '',
        }))
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateReview = (index, field, value) => {
        setReviews(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate all ratings
        const hasEmptyRating = reviews.some(r => r.rating < 1);
        if (hasEmptyRating) {
            toast.error('Mohon berikan rating untuk semua produk');
            return;
        }

        setIsSubmitting(true);

        router.post(route('ulasan.store'), {
            pesanan_id: pesanan.id,
            reviews: reviews,
        }, {
            onSuccess: () => {
                toast.success('Ulasan berhasil dikirim!');
            },
            onError: () => {
                toast.error('Gagal mengirim ulasan');
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const StarRating = ({ rating, onChange }) => {
        const [hover, setHover] = useState(0);
        
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="transition-transform hover:scale-110"
                    >
                        <Star
                            className={`w-8 h-8 ${
                                star <= (hover || rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                            }`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    const getRatingText = (rating) => {
        const texts = {
            1: 'Sangat Buruk',
            2: 'Buruk',
            3: 'Cukup',
            4: 'Bagus',
            5: 'Sangat Bagus',
        };
        return texts[rating] || '';
    };

    return (
        <UserLayout>
            <Head title="Beri Ulasan - Angel Cake'S" />

            <section className="pt-28 pb-12 px-4 min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-3xl">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href={route('pesanan.detail', pesanan.id)} className="btn btn-ghost btn-circle">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Beri Ulasan</h1>
                            <p className="text-gray-600">Pesanan #{pesanan.id.slice(0, 8).toUpperCase()} - {pesanan.created_at}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {items.map((item, index) => (
                                <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex gap-4 mb-6">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{item.name}</h3>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="mb-6">
                                        <label className="label">
                                            <span className="label-text font-semibold">Rating Produk</span>
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <StarRating
                                                rating={reviews[index].rating}
                                                onChange={(rating) => updateReview(index, 'rating', rating)}
                                            />
                                            <span className={`text-sm font-semibold ${
                                                reviews[index].rating >= 4 ? 'text-green-500' :
                                                reviews[index].rating >= 3 ? 'text-yellow-500' : 'text-red-500'
                                            }`}>
                                                {getRatingText(reviews[index].rating)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">Komentar (Opsional)</span>
                                        </label>
                                        <textarea
                                            value={reviews[index].komentar}
                                            onChange={(e) => updateReview(index, 'komentar', e.target.value)}
                                            placeholder="Bagikan pengalaman Anda dengan produk ini..."
                                            className="textarea textarea-bordered w-full h-24"
                                            maxLength={500}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            {reviews[index].komentar.length}/500 karakter
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex gap-4">
                            <Link 
                                href={route('pesanan.detail', pesanan.id)} 
                                className="btn btn-outline flex-1"
                            >
                                Batal
                            </Link>
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex-1"
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                <Send className="w-5 h-5 mr-2" />
                                Kirim Ulasan
                            </Button>
                        </div>
                    </form>
                </div>
            </section>
        </UserLayout>
    );
}
