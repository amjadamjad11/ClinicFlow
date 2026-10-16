
 // CreatePatientPage → form for registering a new ClinicFlow patient.
 // Why? → Admin and Receptionist users need a frontend
 // interface for creating patient records.

import { useState } from "react";
import { createPatient } from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Textarea from "../components/Textarea";

function CreatePatientPage() {
    // formData → stores all values entered by the user.
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

    // handleChange → updates the field identified by its name.
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    // handleSubmit → sends the completed form to the backend API.
    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            // createPatient → sends the patient data to the backend.
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
            setError(requestError.message);
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
                    {/* Input → reusable component for the patient's name. */}
                    <Input
                        id="name"
                        name="name"
                        label="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                    />

                    {/* Input → date input for the patient's date of birth. */}
                    <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        label="Date of Birth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />

                    {/* Select → reusable dropdown for the patient's gender. */}
                    <Select
                        id="gender"
                        name="gender"
                        label="Gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        options={[
                            { value: "", label: "Select gender" },
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                            { value: "other", label: "Other" },
                        ]}
                    />

                    {/* Input → validates that the phone number has 10 digits. */}
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

                    {/* Input → email input with browser email validation. */}
                    <Input
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                    />

                    {/* Textarea → allows an address to span multiple lines. */}
                    <Textarea
                        id="address"
                        name="address"
                        label="Address"
                        value={formData.address}
                        onChange={handleChange}
                    />

                    {/* Textarea → allows longer medical-history information. */}
                    <Textarea
                        id="medicalHistory"
                        name="medicalHistory"
                        label="Medical History"
                        value={formData.medicalHistory}
                        onChange={handleChange}
                    />

                    {/* Button → shared submit button with loading protection. */}
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
