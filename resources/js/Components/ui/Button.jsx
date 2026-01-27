export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled,
    loading,
    type = 'button',
    ...props
}) {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        accent: 'btn-accent',
        ghost: 'btn-ghost',
        link: 'btn-link',
        outline: 'btn-outline',
        error: 'btn-error',
        success: 'btn-success',
        warning: 'btn-warning',
        info: 'btn-info',
    };

    const sizes = {
        xs: 'btn-xs',
        sm: 'btn-sm',
        md: 'btn-md',
        lg: 'btn-lg',
    };

    return (
        <button
            type={type}
            className={`btn ${variants[variant]} ${sizes[size]} ${className}`.trim()}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <span className="loading loading-spinner loading-sm"></span>}
            {children}
        </button>
    );
}
