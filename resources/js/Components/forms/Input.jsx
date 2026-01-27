import { useFormContext } from 'react-hook-form';

export default function Input({
    name,
    label,
    type = 'text',
    placeholder,
    className = '',
    required = false,
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
                {...register(name)}
                {...props}
            />
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error.message}</span>
                </label>
            )}
        </div>
    );
}

