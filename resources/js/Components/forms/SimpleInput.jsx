export default function SimpleInput({
    label,
    type = 'text',
    name,
    value,
    onChange,
    error,
    placeholder = '',
    className = '',
    required = false,
    autoFocus = false,
    disabled = false,
    ...props
}) {
    return (
        <div className={`form-control w-full ${className}`.trim()}>
            {label && (
                <label className="label" htmlFor={name}>
                    <span className="label-text">
                        {label}
                        {required && <span className="text-error"> *</span>}
                    </span>
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                autoFocus={autoFocus}
                className={`input input-bordered w-full ${error ? 'input-error' : ''}`.trim()}
                {...props}
            />
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
}
