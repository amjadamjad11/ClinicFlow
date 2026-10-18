
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getConsultations } from "../services/api";
import { useAuth } from "../context/useAuth";

function ConsultationsPage() {
    // Store consultations returned by the backend.
    const [consultations, setConsultations] = useState([]);

    // Track loading and errors so the page can inform the user.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // The user's role determines whether they can create consultations.
    const { user } = useAuth();

    const canCreateConsultation =
        user?.role === "Admin" || user?.role === "Doctor";

    // Load consultation records when the page first opens.
    useEffect(() => {
        async function loadConsultations() {
            try {
                setLoading(true);
                setError("");

                const response = await getConsultations();

                // The backend returns the consultation list in response.data.
                setConsultations(response.data || []);
            } catch (requestError) {
                setError(
                    requestError.message ||
                    "Failed to load consultations."
                );
            } finally {
                setLoading(false);
            }
        }

        loadConsultations();
    }, []);

    // Convert the appointment date into a readable date and time.
    function formatDate(dateValue) {
        if (!dateValue) return "Not available";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "Invalid date";
        }

        return date.toLocaleString();
    }

    return (
        <section>
            <h1>Consultations</h1>
            <p>View patient consultations and clinical records.</p>

            {canCreateConsultation && (
                <p>
                    <Link to="/consultations/create">
                        Create Consultation
                    </Link>
                </p>
            )}

            {loading && <p>Loading consultations...</p>}

            {error && <p role="alert">{error}</p>}

            {!loading && !error && consultations.length === 0 && (
                <p>No consultations found.</p>
            )}

            {!loading && !error && consultations.length > 0 && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Appointment Date</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Symptoms</th>
                                <th>Diagnosis</th>
                            </tr>
                        </thead>

                        <tbody>
                            {consultations.map((consultation) => (
                                <tr key={consultation._id}>
                                    <td>
                                        {formatDate(
                                            consultation.appointment
                                                ?.appointmentDate
                                        )}
                                    </td>

                                    <td>
                                        {consultation.appointment?.patient
                                            ?.name || "Unknown"}
                                    </td>

                                    <td>
                                        {consultation.appointment?.doctor
                                            ?.name || "Unknown"}
                                    </td>

                                    <td>{consultation.symptoms}</td>

                                    <td>{consultation.diagnosis}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default ConsultationsPage;
