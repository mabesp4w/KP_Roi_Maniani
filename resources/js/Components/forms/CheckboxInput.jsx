import { forwardRef } from 'react';

const CheckboxInput = forwardRef(({
    label,
    name,
    checked,
    onChange,
    error,
    className = '',
    disabled = false,
    ...props
}, ref) => {
    return (
        <div className={`form-control ${className}`.trim()}>
            <label className="label cursor-pointer justify-start gap-2 p-0">
                <input
                    ref={ref}
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    className="checkbox checkbox-primary checkbox-sm"
                    disabled={disabled}
                    {...props}
                />
                {label && <span className="label-text">{label}</span>}
            </label>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
});

CheckboxInput.displayName = 'CheckboxInput';

export default CheckboxInput;
