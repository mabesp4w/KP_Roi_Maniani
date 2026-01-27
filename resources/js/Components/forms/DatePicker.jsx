import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

export default function DatePickerComponent({
    name,
    label,
    placeholder = 'Pilih tanggal',
    className = '',
    required = false,
    value = '',
    onChange,
    error,
    dateFormat = 'dd/MM/yyyy',
    showYearDropdown = true,
    showMonthDropdown = true,
    dropdownMode = 'select',
    minDate,
    maxDate,
    ...props
}) {
    const handleDateChange = (date) => {
        if (date) {
            // Convert date to YYYY-MM-DD format
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            onChange?.({ target: { name, value: formattedDate } });
        } else {
            onChange?.({ target: { name, value: '' } });
        }
    };

    const selectedDate = value ? new Date(value) : null;

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
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat={dateFormat}
                    placeholderText={placeholder}
                    className={`input input-bordered w-full ${error ? 'input-error' : ''}`.trim()}
                    showYearDropdown={showYearDropdown}
                    showMonthDropdown={showMonthDropdown}
                    dropdownMode={dropdownMode}
                    minDate={minDate ? new Date(minDate) : undefined}
                    maxDate={maxDate ? new Date(maxDate) : undefined}
                    calendarClassName="!font-sans"
                    wrapperClassName="w-full"
                    {...props}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/50 pointer-events-none" />
            </div>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">
                        {typeof error === 'string' ? error : error?.message}
                    </span>
                </label>
            )}
        </div>
    );
}

