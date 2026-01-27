import { useFormContext } from 'react-hook-form';

export default function Textarea({
    name,
    label,
    placeholder,
    className = '',
    required = false,
    rows = 4,
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
            <textarea
                rows={rows}
                placeholder={placeholder}
                className={`textarea textarea-bordered w-full ${error ? 'textarea-error' : ''}`.trim()}
                {...register(name)}
                {...props}
            ></textarea>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error.message}</span>
                </label>
            )}
        </div>
    );
}

