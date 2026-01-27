import { Eye, EyeOff } from 'lucide-react';
import { useState, forwardRef } from 'react';

const TextInput = forwardRef(({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    error,
    icon: Icon,
    required = false,
    className = '',
    disabled = false,
    autoComplete,
    autoFocus = false,
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className={`form-control w-full ${className}`.trim()}>
            {label && (
                <label className="label">
                    <span className="label-text font-semibold">
                        {label}
                        {required && <span className="text-error ml-1">*</span>}
                    </span>
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <Icon className="w-5 h-5 text-gray-400" />
                    </div>
                )}
                <input
                    ref={ref}
                    type={inputType}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`input input-bordered w-full ${Icon ? 'pl-10' : ''} ${isPassword ? 'pr-10' : ''} ${error ? 'input-error' : ''}`.trim()}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                            <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
});

TextInput.displayName = 'TextInput';

export default TextInput;
