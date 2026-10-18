
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getConsultation } from "../services/api";

// This page displays the full details of one consultation.
// useParams reads the consultation ID from the URL.
// Example: /consultations/65abc123
function ConsultationDetailsPage() {
    const { id } = useParams();

    // Store the consultation returned by the backend.
    const [consultation, setConsultation] = useState(null);

    // Track loading and request errors.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Load the selected consultation when the page opens.
    useEffect(() => {
        async function loadConsultation() {
            try {
                setLoading(true);
                setError("");

                const response = await getConsultation(id);

                // The backend returns the record inside response.data.
                setConsultation(response.data);
            } catch (requestError) {
                setError(
                    requestError.message ||
                    "Failed to load consultation details."
                );
            } finally {
                setLoading(false);
            }
        }

        loadConsultation();
    }, [id]);

    // Display dates in a readable format.
    function formatDate(dateValue) {
        if (!dateValue) return "Not available";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Invalid date";
        }

        return date.toLocaleString();
    }

    if (loading) {
        return (
            <section className="page-container">
                <p>Loading consultation details...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="page-container">
                <h1>Consultation Details</h1>
                <p role="alert">{error}</p>
                <Link to="/consultations">Back to Consultations</Link>
            </section>
        );
    }

    if (!consultation) {
        return (
            <section className="page-container">
                <h1>Consultation Not Found</h1>
                <p>The requested consultation could not be found.</p>
                <Link to="/consultations">Back to Consultations</Link>
            </section>
        );
    }

    const appointment = consultation.appointment;
    const patient = appointment?.patient;
    const doctor = appointment?.doctor;

    return (
        <section className="page-container">
            <header className="page-header">
                <div>
                    <h1>Consultation Details</h1>
                    <p>View the complete clinical record.</p>
                </div>

                <Link to="/consultations">
                    Back to Consultations
                </Link>
            </header>

            <section className="form-section">
                <h2>Appointment Information</h2>

                <p>
                    <strong>Appointment Date:</strong>{" "}
                    {formatDate(appointment?.appointmentDate)}
                </p>

                <p>
                    <strong>Patient:</strong>{" "}
                    {patient?.name || "Not available"}
                </p>

                <p>
                    <strong>Patient Phone:</strong>{" "}
                    {patient?.phone || "Not available"}
                </p>

                <p>
                    <strong>Doctor:</strong>{" "}
                    {doctor?.name || "Not available"}
                </p>

                <p>
                    <strong>Specialization:</strong>{" "}
                    {doctor?.specialization || "Not available"}
                </p>
            </section>

            <section className="form-section">
                <h2>Clinical Record</h2>

                <p>
                    <strong>Symptoms:</strong>
                </p>
                <p>{consultation.symptoms || "Not recorded"}</p>

                <p>
                    <strong>Diagnosis:</strong>
                </p>
                <p>{consultation.diagnosis || "Not recorded"}</p>

                <p>
                    <strong>Treatment:</strong>
                </p>
                <p>{consultation.treatment || "Not recorded"}</p>

                <p>
                    <strong>Notes:</strong>
                </p>
                <p>{consultation.notes || "No additional notes"}</p>
            </section>
        </section>
    );
}

export default ConsultationDetailsPage;
