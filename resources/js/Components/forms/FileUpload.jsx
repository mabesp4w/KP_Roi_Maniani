import { GripVertical, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function FileUpload({ label, name, accept = 'image/*', multiple = false, onChange, disabled = false, helperText, maxSize = 2 }) {
    const [previews, setPreviews] = useState([]);
    const [draggedIndex, setDraggedIndex] = useState(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const maxSizeBytes = maxSize * 1024 * 1024; // Convert MB to bytes
        const validFiles = [];
        const invalidFiles = [];

        // Validate file sizes
        files.forEach((file) => {
            if (file.size > maxSizeBytes) {
                invalidFiles.push({
                    name: file.name,
                    size: (file.size / (1024 * 1024)).toFixed(2),
                });
            } else {
                validFiles.push(file);
            }
        });

        // Show error for invalid files
        if (invalidFiles.length > 0) {
            const errorMessage = invalidFiles.length === 1
                ? `File "${invalidFiles[0].name}" terlalu besar (${invalidFiles[0].size}MB). Maksimal ${maxSize}MB.`
                : `${invalidFiles.length} file melebihi batas ${maxSize}MB dan tidak akan diupload.`;
            
            toast.error(errorMessage, { duration: 4000 });
        }

        // Only process valid files
        if (validFiles.length === 0) {
            // Clear input
            e.target.value = '';
            return;
        }

        // Create previews for valid files
        const newPreviews = validFiles.map((file, index) => ({
            file,
            url: URL.createObjectURL(file),
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2), // Size in MB
            position: previews.length + index + 1,
        }));

        const updatedPreviews = [...previews, ...newPreviews];
        setPreviews(updatedPreviews);

        // Call parent onChange
        if (onChange) {
            onChange(updatedPreviews.map((p) => p.file));
        }

        // Clear input to allow re-selecting same file
        e.target.value = '';
    };

    const removePreview = (index) => {
        const newPreviews = previews.filter((_, i) => i !== index);
        // Reorder positions
        const reorderedPreviews = newPreviews.map((p, i) => ({
            ...p,
            position: i + 1,
        }));
        setPreviews(reorderedPreviews);

        // Update parent with remaining files
        if (onChange) {
            onChange(reorderedPreviews.map((p) => p.file));
        }
    };

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();

        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const newPreviews = [...previews];
        const draggedItem = newPreviews[draggedIndex];

        // Remove from old position
        newPreviews.splice(draggedIndex, 1);
        // Insert at new position
        newPreviews.splice(dropIndex, 0, draggedItem);

        // Reorder positions
        const reorderedPreviews = newPreviews.map((p, i) => ({
            ...p,
            position: i + 1,
        }));

        setPreviews(reorderedPreviews);
        setDraggedIndex(null);

        // Update parent
        if (onChange) {
            onChange(reorderedPreviews.map((p) => p.file));
        }
    };

    return (
        <div className="form-control w-full">
            {label && (
                <label className="label">
                    <span className="label-text font-medium">{label}</span>
                </label>
            )}

            <input
                type="file"
                name={name}
                accept={accept}
                multiple={multiple}
                onChange={handleFileChange}
                disabled={disabled}
                className="file-input file-input-bordered w-full"
            />

            {helperText && (
                <label className="label">
                    <span className="label-text-alt text-base-content/60">{helperText}</span>
                </label>
            )}

            {/* Image Previews */}
            {previews.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm font-medium mb-2 text-base-content/80">
                        Preview ({previews.length} gambar) - Drag untuk mengatur urutan
                    </p>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {previews.map((preview, index) => (
                            <div
                                key={index}
                                draggable={!disabled}
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                className={`relative group cursor-move ${draggedIndex === index ? 'opacity-50' : ''}`}
                            >
                                {/* Drag Handle */}
                                <div className="absolute top-2 left-2 z-10 bg-base-100/80 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <GripVertical size={16} className="text-base-content/60" />
                                </div>

                                {/* Image */}
                                <img
                                    src={preview.url}
                                    alt={preview.name}
                                    className="w-full h-32 object-cover rounded-lg border-2 border-base-300"
                                />

                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={() => removePreview(index)}
                                    className="absolute top-2 right-2 btn btn-circle btn-sm btn-error opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    disabled={disabled}
                                >
                                    <X size={16} />
                                </button>

                                {/* Position Badge */}
                                <div className="absolute bottom-2 left-2 badge badge-primary badge-lg font-bold">
                                    Posisi {preview.position}
                                </div>

                                {/* File Info */}
                                <div className="mt-1">
                                    <p className="text-xs truncate text-base-content/60">{preview.name}</p>
                                    <p className="text-xs text-base-content/50">{preview.size} MB</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
