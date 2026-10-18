
 // DoctorDetailsPage → displays and manages one doctor's professional information.
 // Why? → Staff can view details, while Admins can edit or delete doctor records.

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteDoctor, getDoctor } from "../services/api";
import { useAuth } from "../context/useAuth";

function DoctorDetailsPage() {
    // useParams reads the doctor ID from /doctors/:id.
    const { id } = useParams();

    // useNavigate redirects to the doctors list after successful deletion.
    const navigate = useNavigate();

    // useAuth provides the logged-in user's role for UI permissions.
    const { user } = useAuth();

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDoctor() {
            try {
                setError("");
                setLoading(true);

                // Retrieve the selected doctor from the backend.
                const response = await getDoctor(id);
                setDoctor(response.data);
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadDoctor();
    }, [id]);

    const handleDelete = async () => {
        // Ask for confirmation because deletion removes the doctor record.
        const confirmed = window.confirm(
            `Are you sure you want to delete Dr. ${doctor.name}? This action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setDeleting(true);

        try {
            // deleteDoctor calls the protected backend DELETE endpoint.
            await deleteDoctor(doctor._id);

            // Return to the list after the backend confirms successful deletion.
            navigate("/doctors", {
                state: { message: "Doctor deleted successfully." },
            });
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <main>
                <section>
                    <h1>Doctor Details</h1>
                    <p>Loading doctor...</p>
                </section>
            </main>
        );
    }

    if (error && !doctor) {
        return (
            <main>
                <section>
                    <h1>Doctor Details</h1>
                    <p role="alert">{error}</p>
                    <Link to="/doctors">Back to Doctors</Link>
                </section>
            </main>
        );
    }

    return (
        <main>
            <section>
                <h1>{doctor.name}</h1>
                <p>Doctor ID: {doctor._id}</p>

                {error && <p role="alert">{error}</p>}

                <hr />

                <h2>Professional Information</h2>

                <p>
                    <strong>Specialization:</strong>{" "}
                    {doctor.specialization}
                </p>

                <p>
                    <strong>Phone:</strong> {doctor.phone}
                </p>

                <p>
                    <strong>Email:</strong> {doctor.email || "—"}
                </p>

                <p>
                    <strong>Medical License Number:</strong>{" "}
                    {doctor.licenseNumber}
                </p>

                <p>
                    <strong>Experience:</strong>{" "}
                    {doctor.experience} years
                </p>

                <hr />

                {/* Only Admin users see edit and delete actions.
                    The backend must independently enforce these permissions. */}
                {user?.role === "Admin" && (
                    <>
                        <Link to={`/doctors/${doctor._id}/edit`}>
                            Edit Doctor
                        </Link>

                        {" "}

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? "Deleting Doctor..." : "Delete Doctor"}
                        </button>

                        {" "}
                    </>
                )}

                <Link to={`/doctors/${doctor._id}/schedule`}>
                    View Appointment Schedule
                </Link>

                {" "}

                <Link to="/doctors">Back to Doctors</Link>
            </section>
        </main>
    );
}

export default DoctorDetailsPage;
