
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    deleteAppointment,
    getAppointment,
} from "../services/api";
import { useAuth } from "../context/useAuth";

function AppointmentDetailsPage() {
    // useParams reads the appointment ID from the URL.
    // Example: /appointments/123 identifies appointment 123.
    const { id } = useParams();

    // useNavigate redirects the user after an action succeeds.
    const navigate = useNavigate();

    // useAuth provides the currently logged-in user's information.
    const { user } = useAuth();

    // Store the appointment and the page's current state.
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    // Only Admin and Receptionist users can manage appointments.
    // The backend must also enforce these permissions.
    const canManageAppointments =
        user?.role === "Admin" ||
        user?.role === "Receptionist";

    // Load the selected appointment when the page opens.
    useEffect(() => {
        async function loadAppointment() {
            try {
                setLoading(true);
                setError("");

                const response = await getAppointment(id);

                setAppointment(response.data);
            } catch (requestError) {
                setError(
                    requestError.message ||
                    "Failed to load appointment."
                );
            } finally {
                setLoading(false);
            }
        }

        loadAppointment();
    }, [id]);

    // Permanently delete the appointment after user confirmation.
    async function handleDelete() {
        const confirmed = window.confirm(
            "Permanently delete this appointment? This action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            await deleteAppointment(id);

            // Return to the appointment directory after deletion.
            navigate("/appointments");
        } catch (requestError) {
            setError(
                requestError.message ||
                "Failed to delete appointment."
            );
        } finally {
            setDeleting(false);
        }
    }

    // Display a loading message while fetching appointment data.
    if (loading) {
        return (
            <section>
                <h1>Appointment Details</h1>
                <p>Loading appointment...</p>
            </section>
        );
    }

    // Show an error and a return link if loading fails.
    if (!appointment) {
        return (
            <section>
                <h1>Appointment Details</h1>

                <p role="alert">
                    {error || "Appointment not found."}
                </p>

                <Link to="/appointments">
                    Back to Appointments
                </Link>
            </section>
        );
    }

    // Convert the stored date into a readable local date and time.
    const appointmentDate = appointment.appointmentDate
        ? new Date(appointment.appointmentDate)
        : null;

    const formattedDate =
        appointmentDate &&
        !Number.isNaN(appointmentDate.getTime())
            ? appointmentDate.toLocaleString()
            : "Not available";

    return (
        <main>
            <section>
                <h1>Appointment Details</h1>

                <p>
                    <strong>Appointment ID:</strong>{" "}
                    {appointment._id}
                </p>

                {error && (
                    <p role="alert">{error}</p>
                )}

                <hr />

                <h2>Appointment Information</h2>

                <p>
                    <strong>Date and Time:</strong>{" "}
                    {formattedDate}
                </p>

                <p>
                    <strong>Status:</strong>{" "}
                    {appointment.status}
                </p>

                <p>
                    <strong>Reason:</strong>{" "}
                    {appointment.reason}
                </p>

                <h2>Patient Information</h2>

                <p>
                    <strong>Name:</strong>{" "}
                    {appointment.patient?.name || "Unknown"}
                </p>

                <p>
                    <strong>Phone:</strong>{" "}
                    {appointment.patient?.phone || "Not available"}
                </p>

                <p>
                    <strong>Email:</strong>{" "}
                    {appointment.patient?.email || "Not available"}
                </p>

                <h2>Doctor Information</h2>

                <p>
                    <strong>Name:</strong>{" "}
                    {appointment.doctor?.name || "Unknown"}
                </p>

                <p>
                    <strong>Specialization:</strong>{" "}
                    {appointment.doctor?.specialization ||
                        "Not available"}
                </p>

                {canManageAppointments && (
                    <>
                        <hr />

                        <h2>Appointment Actions</h2>

                        {/* Open the dedicated appointment editing page. */}
                        <p>
                            <Link
                                to={`/appointments/${appointment._id}/edit`}
                            >
                                Edit Appointment
                            </Link>
                        </p>

                        {/* Require confirmation before permanent deletion. */}
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting
                                ? "Deleting Appointment..."
                                : "Delete Appointment"}
                        </button>
                    </>
                )}

                <hr />

                <Link to="/appointments">
                    Back to Appointments
                </Link>
            </section>
        </main>
    );
}

export default AppointmentDetailsPage;
