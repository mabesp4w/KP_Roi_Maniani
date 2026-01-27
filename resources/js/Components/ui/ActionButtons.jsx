import { Edit, Trash2 } from 'lucide-react';
import Button from './Button';

export default function ActionButtons({
    onEdit,
    onDelete,
    editTitle = 'Edit',
    deleteTitle = 'Hapus',
    size = 'sm',
    className = '',
}) {
    return (
        <div className={`flex gap-2 ${className}`.trim()}>
            <Button
                variant="ghost"
                size={size}
                onClick={onEdit}
                title={editTitle}
                className="btn-circle"
            >
                <Edit size={16} />
            </Button>
            <Button
                variant="ghost"
                size={size}
                onClick={onDelete}
                title={deleteTitle}
                className="btn-circle text-error"
            >
                <Trash2 size={16} />
            </Button>
        </div>
    );
}