import { useId } from 'react';
import ReactSelect from 'react-select';

// Helper function to create select option
export const createSelectOption = (value, label, disabled = false) => ({
    value,
    label,
    disabled,
});

export default function Select({
    label,
    error,
    helperText,
    options = [],
    placeholder = 'Select...',
    isMulti = false,
    isClearable = false,
    isSearchable = true,
    value,
    onChange,
    className = '',
    id,
    isDisabled = false,
    menuPosition = 'absolute',
    menuPlacement = 'bottom',
    menuShouldScrollIntoView = false,
    menuShouldBlockScroll = false,
    required = false,
}) {
    const generatedId = useId();
    const selectId = id || generatedId;

    // Get theme colors from CSS variables
    const getThemeColors = () => {
        if (typeof window === 'undefined') {
            return {
                b1: '220 14% 96%',
                b2: '220 14% 94%',
                bc: '215 28% 17%',
                p: '262 80% 50%',
                pc: '0 0% 100%',
                er: '0 84% 60%',
                erc: '0 0% 100%',
            };
        }

        const root = document.documentElement;
        const getColor = (varName) => {
            const value = getComputedStyle(root).getPropertyValue(varName).trim();
            return value || '';
        };

        // Check if dark theme
        const isDark = root.getAttribute('data-theme') === 'dark' || root.getAttribute('data-theme') === 'coffee';

        return {
            b1: getColor('--b1') || (isDark ? '24 10% 10%' : '220 14% 96%'),
            b2: getColor('--b2') || (isDark ? '24 10% 15%' : '220 14% 94%'),
            bc: getColor('--bc') || (isDark ? '60 9% 98%' : '215 28% 17%'),
            p: getColor('--p') || '262 80% 50%',
            pc: getColor('--pc') || '0 0% 100%',
            er: getColor('--er') || '0 84% 60%',
            erc: getColor('--erc') || '0 0% 100%',
        };
    };

    const themeColors = getThemeColors();

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderColor: error
                ? `hsl(${themeColors.er})`
                : state.isFocused
                  ? `hsl(${themeColors.p})`
                  : `hsl(${themeColors.bc} / 0.2)`,
            boxShadow: state.isFocused
                ? `0 0 0 1px ${error ? `hsl(${themeColors.er})` : `hsl(${themeColors.p})`}`
                : 'none',
            '&:hover': {
                borderColor: error ? `hsl(${themeColors.er})` : `hsl(${themeColors.p})`,
            },
            backgroundColor: `hsl(${themeColors.b1})`,
            minHeight: '3rem',
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: `hsl(${themeColors.b1})`,
            border: `1px solid hsl(${themeColors.bc} / 0.2)`,
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            zIndex: 1050,
            marginTop: '0.25rem',
        }),
        menuList: (base) => ({
            ...base,
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '8px 4px',
            backgroundColor: `hsl(${themeColors.b1})`,
            borderRadius: '6px',
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 1050,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? `hsl(${themeColors.p})`
                : state.isFocused
                  ? `hsl(${themeColors.b2})`
                  : 'transparent',
            color: state.isSelected ? `hsl(${themeColors.pc})` : `hsl(${themeColors.bc})`,
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '4px',
            margin: '0',
            transition: 'all 0.15s ease',
            ':hover': {
                backgroundColor: state.isSelected ? `hsl(${themeColors.p})` : `hsl(${themeColors.b2})`,
                color: state.isSelected ? `hsl(${themeColors.pc})` : `hsl(${themeColors.bc})`,
            },
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: `hsl(${themeColors.p})`,
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: `hsl(${themeColors.pc})`,
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: `hsl(${themeColors.pc})`,
            '&:hover': {
                backgroundColor: `hsl(${themeColors.er})`,
                color: `hsl(${themeColors.erc})`,
            },
        }),
        placeholder: (base) => ({
            ...base,
            color: `hsl(${themeColors.bc} / 0.5)`,
        }),
        singleValue: (base) => ({
            ...base,
            color: `hsl(${themeColors.bc})`,
        }),
        input: (base) => ({
            ...base,
            color: `hsl(${themeColors.bc})`,
        }),
        indicatorsContainer: (base) => ({
            ...base,
            color: `hsl(${themeColors.bc})`,
        }),
        indicatorSeparator: (base) => ({
            ...base,
            backgroundColor: `hsl(${themeColors.bc} / 0.2)`,
        }),
        clearIndicator: (base) => ({
            ...base,
            color: `hsl(${themeColors.bc})`,
            '&:hover': {
                color: `hsl(${themeColors.er})`,
            },
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: `hsl(${themeColors.bc})`,
            '&:hover': {
                color: `hsl(${themeColors.bc})`,
            },
        }),
    };

    const customTheme = (theme) => ({
        ...theme,
        colors: {
            ...theme.colors,
            primary: `hsl(${themeColors.p})`,
            primary75: `hsl(${themeColors.p} / 0.75)`,
            primary50: `hsl(${themeColors.p} / 0.5)`,
            primary25: `hsl(${themeColors.p} / 0.25)`,
            danger: `hsl(${themeColors.er})`,
            dangerLight: `hsl(${themeColors.er} / 0.5)`,
            neutral0: `hsl(${themeColors.b1})`,
            neutral5: `hsl(${themeColors.b2})`,
            neutral10: `hsl(${themeColors.b2})`,
            neutral20: `hsl(${themeColors.bc} / 0.2)`,
            neutral30: `hsl(${themeColors.bc} / 0.3)`,
            neutral40: `hsl(${themeColors.bc} / 0.4)`,
            neutral50: `hsl(${themeColors.bc} / 0.5)`,
            neutral60: `hsl(${themeColors.bc} / 0.6)`,
            neutral70: `hsl(${themeColors.bc} / 0.7)`,
            neutral80: `hsl(${themeColors.bc} / 0.8)`,
            neutral90: `hsl(${themeColors.bc})`,
        },
        spacing: {
            ...theme.spacing,
            baseUnit: 4,
            controlHeight: 48,
            menuGutter: 4,
        },
    });

    const reactSelectOptions = options.map((opt) => ({
        value: opt.value,
        label: opt.label,
        isDisabled: opt.disabled || false,
    }));

    const selectedValue = isMulti
        ? Array.isArray(value)
            ? reactSelectOptions.filter((opt) => value.some((v) => v.value === opt.value))
            : null
        : value && !Array.isArray(value)
          ? reactSelectOptions.find((opt) => opt.value === value.value) || null
          : null;

    return (
        <div className={`form-control w-full ${className}`}>
            {label && (
                <label className="label" htmlFor={selectId}>
                    <span className="label-text">
                        {label}
                        {required && <span className="text-error"> *</span>}
                    </span>
                </label>
            )}
            <ReactSelect
                instanceId={selectId}
                options={reactSelectOptions}
                placeholder={placeholder}
                isMulti={isMulti}
                isClearable={isClearable}
                isSearchable={isSearchable}
                isDisabled={isDisabled}
                value={selectedValue}
                onChange={(selected) => {
                    if (onChange) {
                        if (isMulti) {
                            onChange(
                                Array.isArray(selected)
                                    ? selected.map((s) => ({ value: s.value, label: s.label }))
                                    : null,
                            );
                        } else {
                            const singleSelected = selected;
                            onChange(
                                singleSelected ? { value: singleSelected.value, label: singleSelected.label } : null,
                            );
                        }
                    }
                }}
                styles={customStyles}
                theme={customTheme}
                className={className}
                menuPosition={menuPosition}
                menuPlacement={menuPlacement}
                menuShouldScrollIntoView={menuShouldScrollIntoView}
                menuShouldBlockScroll={menuShouldBlockScroll}
                menuPortalTarget={menuPosition === 'fixed' && typeof document !== 'undefined' ? document.body : null}
            />
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
            {helperText && !error && (
                <label className="label">
                    <span className="label-text-alt text-base-content/70">{helperText}</span>
                </label>
            )}
        </div>
    );
}

