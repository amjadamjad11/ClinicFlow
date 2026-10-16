
 // Input → reusable labelled input component for ClinicFlow.
 // Why? → Forms can share consistent labels and input behavior.

function Input({
    id,
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder = "",
    required = false,
    disabled = false,
    pattern,
    autoComplete,
}) {
    return (
        <div className="form-field">
            {/* htmlFor connects the label to its input for accessibility. */}
            <label htmlFor={id}>{label}</label>

            <input
                id={id}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                pattern={pattern}
                autoComplete={autoComplete}
            />
        </div>
    );
}

export default Input;
