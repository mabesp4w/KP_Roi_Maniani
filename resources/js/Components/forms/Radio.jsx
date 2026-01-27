import { useFormContext } from 'react-hook-form';

export default function Radio({
    name,
    label,
    options = [],
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
        <div className={`form-control ${className}`.trim()}>
            {label && (
                <label className="label">
                    <span className="label-text">
                        {label}
                        {required && <span className="text-error"> *</span>}
                    </span>
                </label>
            )}
            <div className="flex flex-col gap-2">
                {options.map((option) => (
                    <label key={option.value} className="label cursor-pointer justify-start gap-2">
                        <input
                            type="radio"
                            value={option.value}
                            className="radio radio-primary"
                            {...register(name)}
                            {...props}
                        />
                        <span className="label-text">{option.label}</span>
                    </label>
                ))}
            </div>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error.message}</span>
                </label>
            )}
        </div>
    );
}

