
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAppointments } from "../services/api";
import { useAuth } from "../context/useAuth";

function AppointmentsPage() {
    // State stores the appointments returned by the backend.
    const [appointments, setAppointments] = useState([]);

    // Loading tells the user that appointment data is being fetched.
    const [loading, setLoading] = useState(true);

    // Error stores a readable message if the API request fails.
    const [error, setError] = useState("");

    // The logged-in user's role determines whether booking is allowed.
    const { user } = useAuth();

    const canManageAppointments =
        user?.role === "Admin" || user?.role === "Receptionist";

    useEffect(() => {
        // Fetch appointment records when this page first loads.
        async function loadAppointments() {
            try {
                setLoading(true);
                setError("");

                const response = await getAppointments();

                // The backend returns the appointment array in response.data.
                setAppointments(response.data || []);
            } catch (err) {
                setError(err.message || "Failed to load appointments.");
            } finally {
                // Always stop the loading indicator after the request finishes.
                setLoading(false);
            }
        }

        loadAppointments();
    }, []);

    // Display dates in a readable format.
    function formatDate(dateValue) {
        if (!dateValue) return "Not available";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) return "Invalid date";

        return date.toLocaleString();
    }

    return (
        <section>
            <h1>Appointments</h1>
            <p>View and manage clinic appointments.</p>

            {canManageAppointments && (
                <p>
                    <Link to="/appointments/create">
                        Book Appointment
                    </Link>
                </p>
            )}

            {loading && <p>Loading appointments...</p>}

            {error && (
                <p role="alert">
                    {error}
                </p>
            )}

            {!loading && !error && appointments.length === 0 && (
                <p>No appointments found.</p>
            )}

            {!loading && !error && appointments.length > 0 && (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date and Time</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {appointments.map((appointment) => (
                                <tr key={appointment._id}>
                                    <td>
                                        {formatDate(appointment.appointmentDate)}
                                    </td>

                                    <td>
                                        {appointment.patient?.name || "Unknown"}
                                    </td>

                                    <td>
                                        {appointment.doctor?.name || "Unknown"}
                                    </td>

                                    <td>{appointment.reason}</td>

                                    <td>{appointment.status}</td>

                                    <td>
                                        <Link
                                            to={`/appointments/${appointment._id}`}
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default AppointmentsPage;
