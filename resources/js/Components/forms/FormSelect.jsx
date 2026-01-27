import Select from '@/Components/ui/Select';
import { Controller, useFormContext } from 'react-hook-form';

export default function FormSelect({
    name,
    label,
    helperText,
    options = [],
    placeholder,
    isDisabled = false,
    isMulti = false,
    isClearable = false,
    isSearchable = true,
    menuPosition = 'absolute | fixed',
    menuPlacement = 'auto',
    menuShouldScrollIntoView = false,
    menuShouldBlockScroll = false,
    className = '',
    required = false,
}) {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <div className={className}>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select
                        label={label}
                        error={errors[name]?.message}
                        helperText={helperText}
                        options={options}
                        placeholder={placeholder}
                        isDisabled={isDisabled}
                        isMulti={isMulti}
                        isClearable={isClearable}
                        isSearchable={isSearchable}
                        menuPosition={menuPosition}
                        menuPlacement={menuPlacement}
                        menuShouldScrollIntoView={menuShouldScrollIntoView}
                        menuShouldBlockScroll={menuShouldBlockScroll}
                        required={required}
                        value={
                            isMulti
                                ? Array.isArray(field.value)
                                    ? field.value.map((val) => options.find((opt) => String(opt.value) === String(val))).filter(Boolean)
                                    : []
                                : field.value !== null && field.value !== undefined && field.value !== ''
                                  ? options.find((opt) => String(opt.value) === String(field.value)) || null
                                  : null
                        }
                        onChange={(selected) => {
                            if (isMulti) {
                                // For multi-select, selected is an array
                                field.onChange(Array.isArray(selected) ? selected.map((item) => item.value) : []);
                            } else {
                                // For single select, extract value from SelectOption object
                                field.onChange(selected ? selected.value : null);
                            }
                        }}
                    />
                )}
            />
        </div>
    );
}
