
 // Textarea → reusable labelled multiline input for ClinicFlow.
 // Why? → Longer information needs more space than a normal input.

function Textarea({
    id,
    label,
    name,
    value,
    onChange,
    placeholder = "",
    required = false,
    disabled = false,
}) {
    return (
        <div className="form-field">
            <label htmlFor={id}>{label}</label>

            <textarea
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
            />
        </div>
    );
}

export default Textarea;
