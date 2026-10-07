// PatientDetailsPage → displays one patient's complete information.
// Why? → Users need a dedicated page to view a patient and
// perform authorized actions such as editing or deleting the record.

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deletePatient, getPatient } from "../services/api";
import { useAuth } from "../context/useAuth";

function PatientDetailsPage() {
    // useParams → reads the patient ID from the URL.
    // Why? → /patients/:id identifies which patient we need.
    const { id } = useParams();

    // useNavigate → allows us to redirect after deletion.
    const navigate = useNavigate();

    // useAuth → gives us the logged-in user's role.
    // Why? → Only Admin users should see the delete control.
    const { user } = useAuth();

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadPatient() {
            try {
                setError("");

                // getPatient → retrieves the selected patient from the backend.
                const response = await getPatient(id);

                setPatient(response.data);
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadPatient();
    }, [id]);

    const handleDelete = async () => {
        // Confirmation → prevents accidental permanent deletion.
        const confirmed = window.confirm(
            "Are you sure you want to delete this patient? This action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setDeleting(true);

            // deletePatient → sends the DELETE request to the backend.
            await deletePatient(id);

            // After successful deletion, return to the patient list.
            navigate("/patients");
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
                    <h1>Patient Details</h1>
                    <p>Loading patient...</p>
                </section>
            </main>
        );
    }

    if (error && !patient) {
        return (
            <main>
                <section>
                    <h1>Patient Details</h1>

                    <p role="alert">{error}</p>

                    <Link to="/patients">
                        Back to Patients
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main>
            <section>
                <h1>{patient.name}</h1>

                <p>Patient ID: {patient._id}</p>

                {error && <p role="alert">{error}</p>}

                <hr />

                <h2>Personal Information</h2>

                <p>
                    <strong>Date of Birth:</strong>{" "}
                    {new Date(
                        patient.dateOfBirth
                    ).toLocaleDateString()}
                </p>

                <p>
                    <strong>Gender:</strong> {patient.gender}
                </p>

                <p>
                    <strong>Phone:</strong> {patient.phone}
                </p>

                <p>
                    <strong>Email:</strong>{" "}
                    {patient.email || "—"}
                </p>

                <p>
                    <strong>Address:</strong>{" "}
                    {patient.address || "—"}
                </p>

                <h2>Medical Information</h2>

                <p>
                    <strong>Medical History:</strong>{" "}
                    {patient.medicalHistory ||
                        "No medical history recorded."}
                </p>

                <hr />

                {/* Edit Patient → available for users who can update patients. */}
                <Link to={`/patients/${patient._id}/edit`}>
                    Edit Patient
                </Link>

                {" "}

                {/* Delete Patient → displayed only to Admin users.
                    Backend RBAC still provides the real security. */}
                {user?.role === "Admin" && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting
                            ? "Deleting Patient..."
                            : "Delete Patient"}
                    </button>
                )}

                {" "}

                {/* Back to Patients → returns to the patient list. */}
                <Link to="/patients">
                    Back to Patients
                </Link>
            </section>
        </main>
    );
}

export default PatientDetailsPage;