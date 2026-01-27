import { useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';

export default function FormCurrencyInput({
    name,
    label,
    placeholder = '0',
    className = '',
    required = false,
    ...props
}) {
    const {
        formState: { errors },
        setValue,
        watch,
    } = useFormContext();

    const error = errors[name];
    const value = watch(name);

    // Format number to currency string (Rupiah)
    const formatCurrency = (num) => {
        if (num === null || num === undefined || num === '') return '';
        const numValue = typeof num === 'string' ? parseFloat(num) : num;
        if (isNaN(numValue) || numValue === 0) return '';
        return Math.floor(numValue).toLocaleString('id-ID');
    };

    // Parse currency string to number
    const parseCurrency = (str) => {
        if (!str) return 0;
        const numStr = str.toString().replace(/[^\d]/g, '');
        return numStr ? parseInt(numStr, 10) : 0;
    };

    const [displayValue, setDisplayValue] = useState(formatCurrency(value || 0));

    // Update display value when form value changes (from outside, e.g., when editing)
    useEffect(() => {
        if (value !== null && value !== undefined && value !== '') {
            const formatted = formatCurrency(value);
            if (formatted !== displayValue) {
                setDisplayValue(formatted);
            }
        } else if (!displayValue) {
            setDisplayValue('');
        }
    }, [value]);

    const handleChange = (e) => {
        const inputValue = e.target.value;
        const numericValue = parseCurrency(inputValue);

        // Update display with formatted value
        const formatted = formatCurrency(numericValue);
        setDisplayValue(formatted);

        // Update form value with numeric value (always a number, not empty string)
        setValue(name, numericValue, { shouldValidate: true });
    };

    const handleBlur = (e) => {
        // Ensure display is formatted on blur
        const numericValue = parseCurrency(e.target.value);
        const formatted = formatCurrency(numericValue);
        setDisplayValue(formatted);
        setValue(name, numericValue, { shouldValidate: true });
    };

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
            <div className="relative">
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder={placeholder}
                    className={`input input-bordered w-full ${error ? 'input-error' : ''}`.trim()}
                    value={displayValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    {...props}
                />
            </div>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error.message}</span>
                </label>
            )}
        </div>
    );
}
