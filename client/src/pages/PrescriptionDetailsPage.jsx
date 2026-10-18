
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPrescription } from "../services/api";

// Display the complete information for one prescription.
export default function PrescriptionDetailsPage() {
    // Read the prescription ID from the URL.
    const { id } = useParams();

    // Store the prescription returned by the backend.
    const [prescription, setPrescription] = useState(null);

    // Track loading and errors.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch the selected prescription when the page opens.
    useEffect(() => {
        async function loadPrescription() {
            try {
                setLoading(true);
                setError("");

                const response = await getPrescription(id);

                // The API returns the record inside response.data.
                setPrescription(response.data);
            } catch (requestError) {
                setError(
                    requestError.message ||
                    "Failed to load prescription details."
                );
            } finally {
                setLoading(false);
            }
        }

        loadPrescription();
    }, [id]);

    // Format dates for easier reading.
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
            <main className="page-container">
                <p>Loading prescription details...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="page-container">
                <h1>Prescription Details</h1>
                <p role="alert">{error}</p>
                <Link to="/prescriptions">
                    Back to Prescriptions
                </Link>
            </main>
        );
    }

    if (!prescription) {
        return (
            <main className="page-container">
                <h1>Prescription Not Found</h1>
                <p>The requested prescription could not be found.</p>
                <Link to="/prescriptions">
                    Back to Prescriptions
                </Link>
            </main>
        );
    }

    const consultation = prescription.consultation;
    const appointment = consultation?.appointment;
    const patient = appointment?.patient;
    const doctor = appointment?.doctor;

    return (
        <main className="page-container">
            <header className="page-header">
                <div>
                    <h1>Prescription Details</h1>
                    <p>View the complete prescription and medicines.</p>
                </div>

                <Link to="/prescriptions">
                    Back to Prescriptions
                </Link>
            </header>

            <section className="form-section">
                <h2>Patient and Doctor Information</h2>

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

                <p>
                    <strong>Appointment Date:</strong>{" "}
                    {formatDate(appointment?.appointmentDate)}
                </p>
            </section>

            <section className="form-section">
                <h2>Consultation Information</h2>

                <p>
                    <strong>Symptoms:</strong>{" "}
                    {consultation?.symptoms || "Not recorded"}
                </p>

                <p>
                    <strong>Diagnosis:</strong>{" "}
                    {consultation?.diagnosis || "Not recorded"}
                </p>

                <p>
                    <strong>Treatment:</strong>{" "}
                    {consultation?.treatment || "Not recorded"}
                </p>

                <p>
                    <strong>Consultation Notes:</strong>{" "}
                    {consultation?.notes || "No additional notes"}
                </p>
            </section>

            <section className="form-section">
                <h2>Prescribed Medicines</h2>

                {!prescription.medicines?.length && (
                    <p>No medicines recorded.</p>
                )}

                {prescription.medicines?.length > 0 && (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Medicine</th>
                                    <th>Dosage</th>
                                    <th>Frequency</th>
                                    <th>Duration</th>
                                    <th>Instructions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {prescription.medicines.map(
                                    (medicine, index) => (
                                        <tr key={`${medicine.name}-${index}`}>
                                            <td>{medicine.name}</td>
                                            <td>{medicine.dosage}</td>
                                            <td>{medicine.frequency}</td>
                                            <td>{medicine.duration}</td>
                                            <td>
                                                {medicine.instructions || "—"}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <h3>Prescription Notes</h3>
                <p>{prescription.notes || "No additional notes"}</p>
            </section>
        </main>
    );
}
