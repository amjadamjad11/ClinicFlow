
 // Select → reusable labelled dropdown for ClinicFlow.
 // Why? → Forms can share consistent dropdown behavior and styling.

function Select({
    id,
    label,
    name,
    value,
    onChange,
    options,
    required = false,
    disabled = false,
}) {
    return (
        <div className="form-field">
            <label htmlFor={id}>{label}</label>

            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Select;
