// EditPatientPage → form for updating an existing ClinicFlow patient.
// Why? → Admin and Receptionist users need to correct or update
// patient information after the record has been created.

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getPatient, updatePatient } from "../services/api";

function EditPatientPage() {
    // useParams → gets the patient ID from /patients/:id/edit.
    // Why? → We need the ID to retrieve and update the correct patient.
    const { id } = useParams();

    // useNavigate → lets us redirect the user after a successful update.
    // Why? → After saving, we want to return to the patient's details page.
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        dateOfBirth: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        medicalHistory: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadPatient() {
            try {
                setError("");

                // getPatient → retrieves the existing patient from the backend.
                const response = await getPatient(id);

                const patient = response.data;

                // Convert the MongoDB date into YYYY-MM-DD for the date input.
                const formattedDate = new Date(patient.dateOfBirth)
                    .toISOString()
                    .split("T")[0];

                setFormData({
                    name: patient.name,
                    dateOfBirth: formattedDate,
                    gender: patient.gender,
                    phone: patient.phone,
                    email: patient.email || "",
                    address: patient.address || "",
                    medicalHistory: patient.medicalHistory || "",
                });
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadPatient();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Update only the field that the user changed.
        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSaving(true);

        try {
            // updatePatient → sends the edited information to the backend.
            await updatePatient(id, formData);

            // Return to the updated patient's details page.
            navigate(`/patients/${id}`);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main>
                <section>
                    <h1>Edit Patient</h1>
                    <p>Loading patient...</p>
                </section>
            </main>
        );
    }

    if (error && !formData.name) {
        return (
            <main>
                <section>
                    <h1>Edit Patient</h1>
                    <p role="alert">{error}</p>
                    <Link to={`/patients/${id}`}>
                        Back to Patient
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main>
            <section>
                <h1>Edit Patient</h1>

                <p>Update the patient's information.</p>

                {error && <p role="alert">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Name</label>
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
                        <label htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="phone">Phone</label>
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
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="address">Address</label>
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

                    <button type="submit" disabled={saving}>
                        {saving ? "Saving Changes..." : "Save Changes"}
                    </button>

                    <Link to={`/patients/${id}`}>
                        Cancel
                    </Link>
                </form>
            </section>
        </main>
    );
}

export default EditPatientPage;