export default function Avatar({ src, alt, size = 'md', className = '', ...props }) {
    const sizes = {
        xs: 'w-6 h-6',
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24',
    };

    return (
        <div className={`avatar ${className}`.trim()} {...props}>
            <div className={`rounded-full ${sizes[size]}`}>
                {src ? (
                    <img src={src} alt={alt} />
                ) : (
                    <div className="bg-neutral text-neutral-content rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">
                            {alt?.charAt(0).toUpperCase() || '?'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
