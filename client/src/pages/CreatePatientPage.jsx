import { useState } from "react";
import { createPatient } from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Textarea from "../components/Textarea";

function CreatePatientPage() {
    // Stores all values entered by the user.
    const [formData, setFormData] = useState({
        name: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        medicalHistory: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Updates text, date, email, and textarea fields using their events.
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    // Select.jsx passes the selected gender as a string, not an event.
    const handleGenderChange = (selectedGender) => {
        setFormData((currentData) => ({
            ...currentData,
            gender: selectedGender,
        }));
    };

    // Sends the completed patient form to the backend API.
    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            await createPatient(formData);

            setMessage("Patient created successfully.");

            // Clear every field after successful creation.
            setFormData({
                name: "",
                dateOfBirth: "",
                gender: "",
                phone: "",
                email: "",
                address: "",
                medicalHistory: "",
            });
        } catch (requestError) {
            setError(
                requestError.message || "Failed to create patient."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <section>
                <h1>Create Patient</h1>
                <p>Register a new patient in ClinicFlow.</p>

                {message && <p role="status">{message}</p>}
                {error && <p role="alert">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <Input
                        id="name"
                        name="name"
                        label="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                    />

                    <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        label="Date of Birth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />

                    {/* The dropdown passes its selected string to this handler. */}
                    <Select
                        id="gender"
                        name="gender"
                        label="Gender"
                        value={formData.gender}
                        onChange={handleGenderChange}
                        required
                        options={[
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                            { value: "Other", label: "Other" },
                        ]}
                    />

                    <Input
                        id="phone"
                        name="phone"
                        label="Phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        placeholder="10-digit phone number"
                        required
                        autoComplete="tel"
                    />

                    <Input
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                    />

                    <Textarea
                        id="address"
                        name="address"
                        label="Address"
                        value={formData.address}
                        onChange={handleChange}
                    />

                    <Textarea
                        id="medicalHistory"
                        name="medicalHistory"
                        label="Medical History"
                        value={formData.medicalHistory}
                        onChange={handleChange}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? "Creating Patient..." : "Create Patient"}
                    </Button>
                </form>
            </section>
        </main>
    );
}

export default CreatePatientPage;
