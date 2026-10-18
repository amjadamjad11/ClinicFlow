
 // Select → reusable dropdown component.
 // Why? → Forms need to return the selected value to their parent.

function Select({
    id,
    label,
    name,
    value,
    onChange,
    options = [],
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
                onChange={(event) => {
                    // Send only the selected string value to the parent.
                    onChange(event.target.value);
                }}
                required={required}
                disabled={disabled}
            >
                <option value="">Select an option</option>

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Select;
