import { useFormContext } from 'react-hook-form';

export default function FormInput({
    name,
    label,
    type = 'text',
    placeholder,
    helperText,
    className = '',
    required = false,
    disabled = false,
    ...props
}) {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const error = errors[name];

    return (
        <div className={`form-control w-full ${className}`.trim()}>
            {label && (
                <label className="label">
                    <span className="label-text">
                        {label}
                        {required && <span className="text-error"> *</span>}
                    </span>
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                className={`input input-bordered w-full ${error ? 'input-error' : ''}`.trim()}
                disabled={disabled}
                {...register(name)}
                {...props}
            />
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error.message}</span>
                </label>
            )}
            {!error && helperText && (
                <label className="label">
                    <span className="label-text-alt text-base-content/60">{helperText}</span>
                </label>
            )}
        </div>
    );
}
