import { Head, Link } from '@inertiajs/react';
import { Star, MessageSquare, Package, ArrowLeft, Edit2 } from 'lucide-react';
import UserLayout from '@/Layouts/UserLayout';
import Button from '@/Components/ui/Button';
import Pagination from '@/Components/ui/Pagination';

export default function UlasanIndex({ reviews }) {
    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <UserLayout>
            <Head title="Ulasan Saya - Angel Cake'S" />

            <section className="pt-28 pb-12 px-4 min-h-screen">
                <div className="container mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <MessageSquare className="w-8 h-8 text-pink-500" />
                            Ulasan Saya
                        </h1>
                        <p className="text-gray-600 mt-1">Riwayat ulasan yang telah Anda berikan</p>
                    </div>

                    {reviews.data.length > 0 ? (
                        <>
                            <div className="space-y-4">
                                {reviews.data.map((review) => (
                                    <div
                                        key={review.id}
                                        className="bg-white rounded-2xl shadow-lg p-6"
                                    >
                                        <div className="flex gap-4">
                                            <img
                                                src={review.image}
                                                alt={review.product_name}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg">{review.product_name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {renderStars(review.rating)}
                                                    <span className="text-sm text-gray-500">
                                                        {review.created_at}
                                                    </span>
                                                </div>
                                                {review.komentar && (
                                                    <p className="text-gray-600 mt-2">{review.komentar}</p>
                                                )}
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-xs text-gray-400">
                                                        Order: #{review.order_id.slice(0, 8).toUpperCase()}
                                                    </span>
                                                    <Link
                                                        href={route('ulasan.edit', review.id)}
                                                        className="btn btn-ghost btn-xs gap-1 text-pink-500 hover:text-pink-600"
                                                    >
                                                        <Edit2 className="w-3 h-3" />
                                                        Edit
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-8">
                                <Pagination links={reviews.links} />
                            </div>
                        </>
                    ) : (
                        /* Empty State */
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <MessageSquare className="w-12 h-12 text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Belum Ada Ulasan</h2>
                            <p className="text-gray-600 mb-8">
                                Anda belum memberikan ulasan untuk produk apapun
                            </p>
                            <Link href="/pesanan">
                                <Button variant="primary">
                                    <Package className="w-5 h-5 mr-2" />
                                    Lihat Pesanan
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </UserLayout>
    );
}
