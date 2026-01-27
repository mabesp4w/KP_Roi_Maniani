export default function Badge({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) {
    const variants = {
        primary: 'badge-primary',
        secondary: 'badge-secondary',
        accent: 'badge-accent',
        success: 'badge-success',
        warning: 'badge-warning',
        error: 'badge-error',
        info: 'badge-info',
        outline: 'badge-outline',
        ghost: 'badge-ghost',
    };

    const sizes = {
        xs: 'badge-xs',
        sm: 'badge-sm',
        md: 'badge-md',
        lg: 'badge-lg',
    };

    return (
        <span className={`badge ${variants[variant]} ${sizes[size]} ${className}`.trim()} {...props}>
            {children}
        </span>
    );
}
