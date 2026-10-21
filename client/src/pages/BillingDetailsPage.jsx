
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBilling } from "../services/api";

export default function BillingDetailsPage() {
    // Read the bill ID from the URL, e.g. /billing/123.
    const { id } = useParams();

    const [billing, setBilling] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadBilling() {
            try {
                setLoading(true);
                setError("");

                const response = await getBilling(id);
                setBilling(response.data || null);
            } catch (err) {
                setError(err.message || "Unable to load bill details.");
            } finally {
                setLoading(false);
            }
        }

        loadBilling();
    }, [id]);

    if (loading) {
        return (
            <main className="page-container">
                <p>Loading bill details...</p>
            </main>
        );
    }

    if (error || !billing) {
        return (
            <main className="page-container">
                <div className="page-header">
                    <h1>Bill Details</h1>
                    <Link to="/billing">Back to Billing</Link>
                </div>
                <p role="alert">
                    {error || "Billing record not found."}
                </p>
            </main>
        );
    }

    const consultation = billing.consultation;
    const appointment = consultation?.appointment;
    const patient = appointment?.patient;
    const doctor = appointment?.doctor;

    function formatCurrency(amount) {
        return `₹${Number(amount || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }

    function formatDate(value) {
        if (!value) return "N/A";

        const date = new Date(value);

        return Number.isNaN(date.getTime())
            ? "N/A"
            : date.toLocaleString("en-IN");
    }

    return (
        <main className="page-container">
            <div className="page-header">
                <div>
                    <h1>Bill Details</h1>
                    <p>Review patient billing and payment information.</p>
                </div>

                <Link to="/billing">Back to Billing</Link>
            </div>

            <section className="form-section">
                <h2>Patient Information</h2>
                <p><strong>Name:</strong> {patient?.name || "N/A"}</p>
                <p><strong>Phone:</strong> {patient?.phone || "N/A"}</p>
            </section>

            <section className="form-section">
                <h2>Doctor Information</h2>
                <p><strong>Name:</strong> {doctor?.name || "N/A"}</p>
                <p>
                    <strong>Specialization:</strong>{" "}
                    {doctor?.specialization || "N/A"}
                </p>
            </section>

            <section className="form-section">
                <h2>Consultation Information</h2>
                <p><strong>Diagnosis:</strong> {consultation?.diagnosis || "N/A"}</p>
                <p><strong>Symptoms:</strong> {consultation?.symptoms || "N/A"}</p>
                <p>
                    <strong>Appointment Date:</strong>{" "}
                    {formatDate(appointment?.appointmentDate)}
                </p>
            </section>

            <section className="form-section">
                <h2>Charge Breakdown</h2>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Charge</th>
                                <th>Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Consultation Fee</td>
                                <td>{formatCurrency(billing.consultationFee)}</td>
                            </tr>
                            <tr>
                                <td>Medicine Charges</td>
                                <td>{formatCurrency(billing.medicineCharges)}</td>
                            </tr>
                            <tr>
                                <td>Other Charges</td>
                                <td>{formatCurrency(billing.otherCharges)}</td>
                            </tr>
                            <tr>
                                <th>Total Amount</th>
                                <th>{formatCurrency(billing.totalAmount)}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="form-section">
                <h2>Payment Information</h2>
                <p>
                    <strong>Status:</strong>{" "}
                    {billing.paymentStatus || "Pending"}
                </p>
                <p>
                    <strong>Payment Method:</strong>{" "}
                    {billing.paymentMethod || "N/A"}
                </p>
                <p><strong>Created:</strong> {formatDate(billing.createdAt)}</p>
                <p><strong>Last Updated:</strong> {formatDate(billing.updatedAt)}</p>
                <p><strong>Notes:</strong> {billing.notes || "None"}</p>
            </section>
        </main>
    );
}
