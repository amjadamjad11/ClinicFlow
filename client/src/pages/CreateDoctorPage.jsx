
// CreateDoctorPage → form for registering a doctor in ClinicFlow.
// Why? → Admin users need a consistent interface for adding doctors.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createDoctor } from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";

function CreateDoctorPage() {
    const navigate = useNavigate();

    // formData → stores the values entered into the form.
    // Why? → React needs to track the data before submitting it to the API.
    const [formData, setFormData] = useState({
        name: "",
        specialization: "",
        phone: "",
        email: "",
        licenseNumber: "",
        experience: "0",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // handleChange → updates only the field the user edits.
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Convert experience to a number because the backend schema
            // stores experience as a Number, not a string.
            const doctorData = {
                ...formData,
                experience: Number(formData.experience),
            };

            await createDoctor(doctorData);

            // Navigate back to the doctor directory after successful creation.
            navigate("/doctors");
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <section>
                <h1>Register Doctor</h1>
                <p>Enter the doctor's professional information.</p>

                {error && <p role="alert">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <Input
                        id="name"
                        name="name"
                        label="Doctor Name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        autoComplete="name"
                        required
                    />

                    <Input
                        id="specialization"
                        name="specialization"
                        label="Specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        placeholder="e.g. Cardiology"
                        required
                    />

                    <Input
                        id="phone"
                        name="phone"
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit phone number"
                        pattern="[0-9]{10}"
                        autoComplete="tel"
                        required
                    />

                    <Input
                        id="email"
                        name="email"
                        label="Email (Optional)"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="doctor@example.com"
                        autoComplete="email"
                    />

                    <Input
                        id="licenseNumber"
                        name="licenseNumber"
                        label="Medical License Number"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        placeholder="Enter unique license number"
                        required
                    />

                    <Input
                        id="experience"
                        name="experience"
                        label="Years of Experience"
                        type="number"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                    />

                    <Button type="submit" disabled={loading}>
                        {loading ? "Registering Doctor..." : "Register Doctor"}
                    </Button>

                    <p>
                        <Link to="/doctors">Cancel and return to Doctors</Link>
                    </p>
                </form>
            </section>
        </main>
    );
}

export default CreateDoctorPage;
