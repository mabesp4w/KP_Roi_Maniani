import { useFormContext } from 'react-hook-form';

export default function Checkbox({ name, label, className = '', required = false, ...props }) {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const error = errors[name];

    return (
        <div className={`form-control ${className}`.trim()}>
            <label className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" className="checkbox checkbox-primary" {...register(name)} {...props} />
                <span className="label-text">
                    {label}
                    {required && <span className="text-error"> *</span>}
                </span>
            </label>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error.message}</span>
                </label>
            )}
        </div>
    );
}
