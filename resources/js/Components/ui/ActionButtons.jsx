import { Edit, Trash2, Eye } from 'lucide-react';
import Button from './Button';

export default function ActionButtons({
    onView,
    onEdit,
    onDelete,
    viewTitle = 'Lihat',
    editTitle = 'Edit',
    deleteTitle = 'Hapus',
    size = 'sm',
    className = '',
}) {
    return (
        <div className={`flex gap-2 ${className}`.trim()}>
            {onView && (
                <Button
                    variant="ghost"
                    size={size}
                    onClick={onView}
                    title={viewTitle}
                    className="btn-circle text-info"
                >
                    <Eye size={16} />
                </Button>
            )}
            {onEdit && (
                <Button
                    variant="ghost"
                    size={size}
                    onClick={onEdit}
                    title={editTitle}
                    className="btn-circle"
                >
                    <Edit size={16} />
                </Button>
            )}
            {onDelete && (
                <Button
                    variant="ghost"
                    size={size}
                    onClick={onDelete}
                    title={deleteTitle}
                    className="btn-circle text-error"
                >
                    <Trash2 size={16} />
                </Button>
            )}
        </div>
    );
}