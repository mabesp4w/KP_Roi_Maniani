export default function Alert({
    children,
    variant = 'info',
    className = '',
    icon,
    ...props
}) {
    const variants = {
        info: 'alert-info',
        success: 'alert-success',
        warning: 'alert-warning',
        error: 'alert-error',
    };

    return (
        <div className={`alert ${variants[variant]} ${className}`.trim()} {...props}>
            {icon && <span>{icon}</span>}
            <span>{children}</span>
        </div>
    );
}
