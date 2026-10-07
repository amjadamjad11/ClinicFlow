// CreatePatientPage → form for registering a new ClinicFlow patient.
// Why? → Admin and Receptionist users need a frontend
// interface for creating patient records.

import { useState } from "react";
import { createPatient } from "../services/api";

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

    // message → displays a successful patient creation message.
    const [message, setMessage] = useState("");

    // error → displays an API error when patient creation fails.
    const [error, setError] = useState("");

    // loading → prevents repeated form submission while the request is running.
    const [loading, setLoading] = useState(false);

    // handleChange → updates the matching form field whenever
    // the user types or selects a value.
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    // handleSubmit → sends the completed patient form to the backend.
    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            // createPatient → sends POST /api/patients with the JWT.
            await createPatient(formData);

            setMessage("Patient created successfully.");

            // Clear the form after successful creation.
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

                <p>
                    Register a new patient in ClinicFlow.
                </p>

                {message && (
                    <p role="status">
                        {message}
                    </p>
                )}

                {error && (
                    <p role="alert">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">
                            Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="dateOfBirth">
                            Date of Birth
                        </label>

                        <input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="gender">
                            Gender
                        </label>

                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Select gender
                            </option>

                            <option value="Male">
                                Male
                            </option>

                            <option value="Female">
                                Female
                            </option>

                            <option value="other">
                                Other
                            </option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="phone">
                            Phone
                        </label>

                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            pattern="[0-9]{10}"
                            placeholder="10-digit phone number"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="address">
                            Address
                        </label>

                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="medicalHistory">
                            Medical History
                        </label>

                        <textarea
                            id="medicalHistory"
                            name="medicalHistory"
                            value={formData.medicalHistory}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Patient..."
                            : "Create Patient"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default CreatePatientPage;