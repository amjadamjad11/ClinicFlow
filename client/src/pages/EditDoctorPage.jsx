
 // EditDoctorPage → form for updating an existing ClinicFlow doctor.
 // Why? → Admins need to correct professional details without creating a duplicate record.

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoctor, updateDoctor } from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";

function EditDoctorPage() {
    // useParams reads the doctor ID from /doctors/:id/edit.
    const { id } = useParams();

    // useNavigate redirects to the doctor's details after saving.
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        specialization: "",
        phone: "",
        email: "",
        licenseNumber: "",
        experience: "0",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDoctor() {
            try {
                setError("");

                // getDoctor retrieves the existing record using its MongoDB ID.
                const response = await getDoctor(id);
                const doctor = response.data;

                // Convert numeric experience to text for the controlled input.
                setFormData({
                    name: doctor.name || "",
                    specialization: doctor.specialization || "",
                    phone: doctor.phone || "",
                    email: doctor.email || "",
                    licenseNumber: doctor.licenseNumber || "",
                    experience: String(doctor.experience ?? 0),
                });
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadDoctor();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Keep the form state synchronized with the field being edited.
        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        // Client-side checks give users immediate feedback before the API request.
        if (!/^[0-9]{10}$/.test(formData.phone)) {
            setError("Phone number must contain exactly 10 digits.");
            return;
        }

        if (
            formData.experience.trim() === "" ||
            !Number.isFinite(Number(formData.experience)) ||
            Number(formData.experience) < 0
        ) {
            setError("Experience must be a number greater than or equal to 0.");
            return;
        }

        setSaving(true);

        try {
            // Convert experience to a number because the backend schema expects one.
            await updateDoctor(id, {
                ...formData,
                experience: Number(formData.experience),
            });

            // Return to the details page so the user can review the saved record.
            navigate(`/doctors/${id}`);
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
                    <h1>Edit Doctor</h1>
                    <p>Loading doctor information...</p>
                </section>
            </main>
        );
    }

    if (error && !formData.name) {
        return (
            <main>
                <section>
                    <h1>Edit Doctor</h1>
                    <p role="alert">{error}</p>
                    <Link to={`/doctors/${id}`}>Back to Doctor Details</Link>
                </section>
            </main>
        );
    }

    return (
        <main>
            <section>
                <h1>Edit Doctor</h1>
                <p>Update the doctor's professional information.</p>

                {error && <p role="alert">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Full Name"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Specialization"
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Phone"
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit phone number"
                        required
                    />

                    <Input
                        label="Email (optional)"
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <Input
                        label="Medical License Number"
                        id="licenseNumber"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Years of Experience"
                        id="experience"
                        name="experience"
                        type="number"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                    />

                    <Button type="submit" disabled={saving}>
                        {saving ? "Saving Changes..." : "Save Changes"}
                    </Button>

                    {" "}
                    <Link to={`/doctors/${id}`}>Cancel</Link>
                </form>
            </section>
        </main>
    );
}

export default EditDoctorPage;
