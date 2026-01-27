import Button from '../ui/Button';
import Modal from './Modal';

export default function ConfirmDialog({
    id,
    isOpen,
    onClose,
    onConfirm,
    title = 'Konfirmasi',
    message = 'Apakah Anda yakin?',
    confirmText = 'Ya',
    cancelText = 'Batal',
    variant = 'error',
    loading = false,
}) {
    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Modal
            id={id}
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose} disabled={loading}>
                        {cancelText}
                    </Button>
                    <Button variant={variant} onClick={handleConfirm} loading={loading}>
                        {confirmText}
                    </Button>
                </>
            }
        >
            <p>{message}</p>
        </Modal>
    );
}
