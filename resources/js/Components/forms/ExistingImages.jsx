import { X } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ConfirmDialog from '@/Components/modal/ConfirmDialog';

export default function ExistingImages({ images = [], varianProdukId, onDelete }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);
    const [localImages, setLocalImages] = useState(images);

    // Sync local images with props when images change
    useEffect(() => {
        setLocalImages(images);
    }, [images]);

    const handleDeleteClick = (image) => {
        setImageToDelete(image);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (!imageToDelete) return;

        router.delete(`/admin/gambar-produk/${imageToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                // Immediately remove from local state for instant UI update
                setLocalImages((prev) => prev.filter((img) => img.id !== imageToDelete.id));
                setShowDeleteDialog(false);
                setImageToDelete(null);
                if (onDelete) onDelete(imageToDelete.id);
            },
            onError: (errors) => {
                console.error('Delete error:', errors);
                setShowDeleteDialog(false);
                setImageToDelete(null);
            },
        });
    };

    if (!localImages || localImages.length === 0) {
        return null;
    }

    return (
        <>
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text font-medium">Gambar Existing ({localImages.length})</span>
                </label>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {localImages.map((image) => (
                        <div key={image.id} className="relative group">
                            {/* Image */}
                            <img
                                src={`/storage/${image.gambar_produk}`}
                                alt={`Posisi ${image.posisi}`}
                                className="w-full h-32 object-cover rounded-lg border-2 border-base-300"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                }}
                            />

                            {/* Remove Button */}
                            <button
                                type="button"
                                onClick={() => handleDeleteClick(image)}
                                className="absolute top-2 right-2 btn btn-circle btn-sm btn-error opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                <X size={16} />
                            </button>

                            {/* Position Badge */}
                            <div className="absolute bottom-2 left-2 badge badge-secondary badge-lg font-bold">
                                Posisi {image.posisi}
                            </div>

                            {/* File Info */}
                            <div className="mt-1">
                                <p className="text-xs text-base-content/60 truncate">
                                    {image.gambar_produk.split('/').pop()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <label className="label">
                    <span className="label-text-alt text-base-content/60">
                        Klik X untuk menghapus gambar. Upload gambar baru akan ditambahkan setelah gambar existing.
                    </span>
                </label>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => {
                    setShowDeleteDialog(false);
                    setImageToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Hapus Gambar"
                message={`Apakah Anda yakin ingin menghapus gambar posisi ${imageToDelete?.posisi}?`}
            />
        </>
    );
}
