
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    createConsultation,
    getAppointments,
    getConsultations,
} from "../services/api";
import Input from "../components/Input";
import Select from "../components/Select";
import Textarea from "../components/Textarea";
import Button from "../components/Button";

function CreateConsultationPage() {
    const navigate = useNavigate();

    // Store appointments that can be selected for a consultation.
    const [appointments, setAppointments] = useState([]);

    // Store the form values before sending them to the backend.
    const [formData, setFormData] = useState({
        appointment: "",
        symptoms: "",
        diagnosis: "",
        treatment: "",
        notes: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Load appointments and consultations when the form opens.
    useEffect(() => {
        async function loadFormData() {
            try {
                setLoading(true);
                setError("");

                const [appointmentResponse, consultationResponse] =
                    await Promise.all([
                        getAppointments(),
                        getConsultations(),
                    ]);

                const allAppointments = appointmentResponse.data || [];
                const allConsultations = consultationResponse.data || [];

                // An appointment can have only one consultation.
                // Exclude appointments that already have a consultation.
                const usedAppointmentIds = new Set(
                    allConsultations.map((consultation) =>
                        typeof consultation.appointment === "object"
                            ? consultation.appointment?._id
                            : consultation.appointment
                    )
                );

                const availableAppointments = allAppointments.filter(
                    (appointment) =>
                        !usedAppointmentIds.has(appointment._id)
                );

                setAppointments(availableAppointments);
            } catch (requestError) {
                setError(
                    requestError.message ||
                    "Failed to load appointment options."
                );
            } finally {
                setLoading(false);
            }
        }

        loadFormData();
    }, []);

    // Update only the form field that the user changes.
    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    }

    // Send the completed form to the backend.
    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            await createConsultation({
                ...formData,
                appointment: formData.appointment,
            });

            // Return to the consultation list after successful creation.
            navigate("/consultations");
        } catch (requestError) {
            setError(
                requestError.message ||
                "Failed to create consultation."
            );
        } finally {
            setSaving(false);
        }
    }

    // Show loading state before displaying the form.
    if (loading) {
        return (
            <section>
                <h1>Create Consultation</h1>
                <p>Loading appointment options...</p>
            </section>
        );
    }

    return (
        <section>
            <h1>Create Consultation</h1>
            <p>Record symptoms, diagnosis, treatment, and notes.</p>

            {error && <p role="alert">{error}</p>}

            {appointments.length === 0 ? (
                <>
                    <p>
                        No appointments are available for a new consultation.
                        An appointment may already have a consultation.
                    </p>

                    <p>
                        <Link to="/appointments">
                            View Appointments
                        </Link>
                    </p>
                </>
            ) : (
                <form onSubmit={handleSubmit}>
                    <Select
                        id="appointment"
                        name="appointment"
                        label="Appointment"
                        value={formData.appointment}
                        onChange={handleChange}
                        required
                        options={[
                            {
                                value: "",
                                label: "Select an appointment",
                            },
                            ...appointments.map((appointment) => ({
                                value: appointment._id,
                                label: `${appointment.patient?.name || "Unknown patient"} — ${appointment.doctor?.name || "Unknown doctor"} — ${
                                    appointment.appointmentDate
                                        ? new Date(
                                              appointment.appointmentDate
                                          ).toLocaleString()
                                        : "Date unavailable"
                                }`,
                            })),
                        ]}
                    />

                    <Textarea
                        id="symptoms"
                        name="symptoms"
                        label="Symptoms"
                        value={formData.symptoms}
                        onChange={handleChange}
                        required
                    />

                    <Textarea
                        id="diagnosis"
                        name="diagnosis"
                        label="Diagnosis"
                        value={formData.diagnosis}
                        onChange={handleChange}
                        required
                    />

                    <Textarea
                        id="treatment"
                        name="treatment"
                        label="Treatment"
                        value={formData.treatment}
                        onChange={handleChange}
                    />

                    <Textarea
                        id="notes"
                        name="notes"
                        label="Additional Notes"
                        value={formData.notes}
                        onChange={handleChange}
                    />

                    <Button type="submit" disabled={saving}>
                        {saving
                            ? "Saving Consultation..."
                            : "Save Consultation"}
                    </Button>

                    {" "}

                    <Link to="/consultations">
                        Cancel
                    </Link>
                </form>
            )}
        </section>
    );
}

export default CreateConsultationPage;
