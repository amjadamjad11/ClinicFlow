
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    createBilling,
    getBillings,
    getConsultations,
} from "../services/api";
import { useAuth } from "../context/useAuth";
import Input from "../components/Input";
import Select from "../components/Select";
import Textarea from "../components/Textarea";
import Button from "../components/Button";

export default function BillingPage() {
    const { user } = useAuth();

    const [billings, setBillings] = useState([]);
    const [consultations, setConsultations] = useState([]);
    const [consultation, setConsultation] = useState("");
    const [consultationFee, setConsultationFee] = useState("0");
    const [medicineCharges, setMedicineCharges] = useState("0");
    const [otherCharges, setOtherCharges] = useState("0");
    const [paymentStatus, setPaymentStatus] = useState("Pending");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [notes, setNotes] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const canCreate =
        user?.role === "Admin" ||
        user?.role === "Receptionist";

    // Load bills and consultations together.
    // Promise.all lets both requests run at the same time.
    async function loadBillingData() {
        const [billingResponse, consultationResponse] =
            await Promise.all([
                getBillings(),
                getConsultations(),
            ]);

        const allBillings = billingResponse.data || [];
        const allConsultations = consultationResponse.data || [];

        setBillings(allBillings);

        // Extract consultation IDs that already have a bill.
        const billedConsultationIds = new Set(
            allBillings
                .map((bill) => {
                    const value = bill.consultation;
                    return typeof value === "object"
                        ? value?._id
                        : value;
                })
                .filter(Boolean)
                .map(String)
        );

        // Prevent selecting a consultation that has already been billed.
        setConsultations(
            allConsultations.filter(
                (item) =>
                    !billedConsultationIds.has(String(item._id))
            )
        );
    }

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError("");
                await loadBillingData();
            } catch (err) {
                setError(err.message || "Unable to load billing data.");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    // Convert the input strings to numbers for calculating the total.
    const totalAmount =
        (Number(consultationFee) || 0) +
        (Number(medicineCharges) || 0) +
        (Number(otherCharges) || 0);

    const consultationOptions = consultations.map((item) => {
        const appointment = item.appointment;
        const patient = appointment?.patient?.name || "Unknown patient";
        const doctor = appointment?.doctor?.name || "Unknown doctor";
        const diagnosis = item.diagnosis || "No diagnosis";

        return {
            value: String(item._id),
            label: `${patient} - ${doctor} - ${diagnosis}`,
        };
    });

    function resetForm() {
        setConsultation("");
        setConsultationFee("0");
        setMedicineCharges("0");
        setOtherCharges("0");
        setPaymentStatus("Pending");
        setPaymentMethod("");
        setNotes("");
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!consultation) {
            setError("Please select a consultation.");
            return;
        }

        const consultationFeeNumber = Number(consultationFee);
        const medicineChargesNumber = Number(medicineCharges);
        const otherChargesNumber = Number(otherCharges);

        const amounts = [
            consultationFeeNumber,
            medicineChargesNumber,
            otherChargesNumber,
        ];

        // Reject negative, non-numeric, or infinite charge amounts.
        if (
            amounts.some(
                (amount) => !Number.isFinite(amount) || amount < 0
            )
        ) {
            setError("All charges must be valid non-negative numbers.");
            return;
        }

        try {
            setSaving(true);

            await createBilling({
                consultation,
                consultationFee: consultationFeeNumber,
                medicineCharges: medicineChargesNumber,
                otherCharges: otherChargesNumber,
                paymentStatus,
                ...(paymentMethod ? { paymentMethod } : {}),
                notes: notes.trim(),
            });

            resetForm();
            await loadBillingData();
            setSuccess("Bill created successfully.");
        } catch (err) {
            setError(err.message || "Unable to create bill.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="page-container">
                <p>Loading billing records...</p>
            </main>
        );
    }

    return (
        <main className="page-container">
            <div className="page-header">
                <div>
                    <h1>Billing Management</h1>
                    <p>Create bills and review payment records.</p>
                </div>
            </div>

            {error && <p role="alert">{error}</p>}
            {success && <p role="status">{success}</p>}

            {canCreate && (
                <section className="form-section">
                    <h2>Create Bill</h2>

                    {consultations.length === 0 ? (
                        <p>
                            No consultations are available for billing.
                            A consultation may already have a bill, or
                            a consultation may need to be recorded first.
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <Select
                                id="billing-consultation"
                                label="Consultation"
                                name="consultation"
                                value={consultation}
                                onChange={setConsultation}
                                options={consultationOptions}
                                required
                            />

                            <Input
                                id="consultation-fee"
                                label="Consultation Fee (₹)"
                                name="consultationFee"
                                type="number"
                                value={consultationFee}
                                onChange={(event) =>
                                    setConsultationFee(event.target.value)
                                }
                                required
                            />

                            <Input
                                id="medicine-charges"
                                label="Medicine Charges (₹)"
                                name="medicineCharges"
                                type="number"
                                value={medicineCharges}
                                onChange={(event) =>
                                    setMedicineCharges(event.target.value)
                                }
                                required
                            />

                            <Input
                                id="other-charges"
                                label="Other Charges (₹)"
                                name="otherCharges"
                                type="number"
                                value={otherCharges}
                                onChange={(event) =>
                                    setOtherCharges(event.target.value)
                                }
                                required
                            />

                            <section className="form-field">
                                <h3>Total Amount</h3>
                                <p>
                                    ₹{totalAmount.toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </section>

                            <Select
                                id="payment-status"
                                label="Payment Status"
                                name="paymentStatus"
                                value={paymentStatus}
                                onChange={setPaymentStatus}
                                options={[
                                    { value: "Pending", label: "Pending" },
                                    { value: "Paid", label: "Paid" },
                                    { value: "Cancelled", label: "Cancelled" },
                                ]}
                                required
                            />

                            <Select
                                id="payment-method"
                                label="Payment Method (optional)"
                                name="paymentMethod"
                                value={paymentMethod}
                                onChange={setPaymentMethod}
                                options={[
                                    { value: "Cash", label: "Cash" },
                                    { value: "Card", label: "Card" },
                                    { value: "UPI", label: "UPI" },
                                    { value: "Insurance", label: "Insurance" },
                                ]}
                            />

                            <Textarea
                                id="billing-notes"
                                label="Notes (optional)"
                                name="notes"
                                value={notes}
                                onChange={(event) =>
                                    setNotes(event.target.value)
                                }
                                placeholder="Enter billing notes"
                            />

                            <Button type="submit" disabled={saving}>
                                {saving ? "Saving..." : "Create Bill"}
                            </Button>
                        </form>
                    )}
                </section>
            )}

            <section>
                <h2>Existing Bills</h2>

                {billings.length === 0 ? (
                    <p>No billing records found.</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Doctor</th>
                                    <th>Consultation Fee</th>
                                    <th>Total</th>
                                    <th>Payment Status</th>
                                    <th>Payment Method</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {billings.map((bill) => {
                                    const appointment =
                                        bill.consultation?.appointment;

                                    return (
                                        <tr key={bill._id}>
                                            <td>
                                                {appointment?.patient?.name || "N/A"}
                                            </td>
                                            <td>
                                                {appointment?.doctor?.name || "N/A"}
                                            </td>
                                            <td>
                                                ₹{Number(
                                                    bill.consultationFee || 0
                                                ).toFixed(2)}
                                            </td>
                                            <td>
                                                ₹{Number(
                                                    bill.totalAmount || 0
                                                ).toFixed(2)}
                                            </td>
                                            <td>{bill.paymentStatus || "Pending"}</td>
                                            <td>{bill.paymentMethod || "N/A"}</td>
                                            <td>
                                                <Link to={`/billing/${bill._id}`}>
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}
