export default function SearchInput({
    value,
    onChange,
    onSubmit,
    placeholder = 'Cari...',
    className = '',
    disabled = false,
    ...props
}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && onSubmit) {
            e.preventDefault();
            onSubmit(e);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`flex ${className}`.trim()}>
            <div className="join w-full">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    className="input-bordered input join-item flex-1"
                    {...props}
                />
                <button
                    type="submit"
                    className="btn join-item btn-primary"
                    disabled={disabled}
                    title="Cari"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
            </div>
        </form>
    );
}
