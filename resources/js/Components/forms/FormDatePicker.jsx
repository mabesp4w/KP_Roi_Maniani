import { useFormContext, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

export default function FormDatePicker({
    name,
    label,
    placeholder = 'Pilih tanggal',
    className = '',
    required = false,
    dateFormat = 'dd/MM/yyyy',
    showYearDropdown = true,
    showMonthDropdown = true,
    dropdownMode = 'select',
    minDate,
    maxDate,
    ...props
}) {
    const {
        control,
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
            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    // Parse date value - handle both string (YYYY-MM-DD) and Date object
                    const parseDate = (value) => {
                        // Explicitly check for empty/null/undefined
                        if (value === null || value === undefined || value === '' || value === 'Invalid Date') {
                            return null;
                        }
                        
                        if (value instanceof Date) {
                            return isNaN(value.getTime()) ? null : value;
                        }
                        
                        if (typeof value === 'string') {
                            // Handle YYYY-MM-DD format - use local timezone to avoid date shift
                            const parts = value.trim().split('-');
                            if (parts.length === 3 && parts[0].length === 4) {
                                const year = parseInt(parts[0], 10);
                                const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
                                const day = parseInt(parts[2], 10);
                                
                                // Validate parsed values
                                if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                                    const date = new Date(year, month, day);
                                    return isNaN(date.getTime()) ? null : date;
                                }
                            }
                        }
                        
                        return null;
                    };

                    const selectedDate = parseDate(field.value);

                    return (
                        <div className="relative">
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => {
                                    // Convert date to YYYY-MM-DD format for form submission
                                    if (date && date instanceof Date && !isNaN(date.getTime())) {
                                        // Use local date to avoid timezone issues
                                        const year = date.getFullYear();
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const day = String(date.getDate()).padStart(2, '0');
                                        const formattedDate = `${year}-${month}-${day}`;
                                        field.onChange(formattedDate);
                                    } else {
                                        // For required fields, we might want to keep empty string
                                        // but validation will catch it
                                        field.onChange('');
                                    }
                                }}
                            dateFormat={dateFormat}
                            placeholderText={placeholder}
                            className={`input input-bordered w-full ${error ? 'input-error' : ''}`.trim()}
                            showYearDropdown={showYearDropdown}
                            showMonthDropdown={showMonthDropdown}
                            dropdownMode={dropdownMode}
                            minDate={
                                minDate
                                    ? minDate instanceof Date
                                        ? minDate
                                        : typeof minDate === 'string'
                                          ? new Date(minDate)
                                          : undefined
                                    : undefined
                            }
                            maxDate={
                                maxDate
                                    ? maxDate instanceof Date
                                        ? maxDate
                                        : typeof maxDate === 'string'
                                          ? new Date(maxDate)
                                          : undefined
                                    : undefined
                            }
                            calendarClassName="!font-sans"
                            wrapperClassName="w-full"
                            {...props}
                        />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/50 pointer-events-none" />
                        </div>
                    );
                }}
            />
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error.message}</span>
                </label>
            )}
        </div>
    );
}

