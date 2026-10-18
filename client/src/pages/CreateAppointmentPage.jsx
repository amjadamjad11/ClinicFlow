
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    getPatients,
    getDoctors,
    createAppointment,
} from "../services/api";

import Button from "../components/Button";
import Textarea from "../components/Textarea";

function CreateAppointmentPage() {
    const navigate = useNavigate();
    const [minimumDateTime] = useState(() => new Date());

    // Store patient and doctor options loaded from the backend.
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    // Store the selected appointment date and time as a JavaScript Date.
    const [selectedDate, setSelectedDate] = useState(null);

    // Store the other form values.
    const [formData, setFormData] = useState({
        patient: "",
        doctor: "",
        reason: "",
    });

    const [loadingOptions, setLoadingOptions] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Load patients and doctors when the page opens.
    useEffect(() => {
        async function loadOptions() {
            try {
                setLoadingOptions(true);
                setError("");

                const [patientResponse, doctorResponse] =
                    await Promise.all([
                        getPatients(),
                        getDoctors(),
                    ]);

                setPatients(patientResponse.data || []);
                setDoctors(doctorResponse.data || []);
            } catch (err) {
                setError(
                    err.message ||
                    "Unable to load patients and doctors."
                );
            } finally {
                setLoadingOptions(false);
            }
        }

        loadOptions();
    }, []);

    // Update patient, doctor, or reason when the user changes a field.
    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    }

    // Submit the appointment to the backend.
    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (!formData.patient || !formData.doctor) {
            setError("Please select both a patient and a doctor.");
            return;
        }

        if (!selectedDate || selectedDate <= new Date()) {
            setError("Please select a future appointment date and time.");
            return;
        }

        if (!formData.reason.trim()) {
            setError("Please enter the reason for the appointment.");
            return;
        }

        try {
            setSubmitting(true);

            await createAppointment({
                patient: formData.patient,
                doctor: formData.doctor,
                appointmentDate: selectedDate.toISOString(),
                reason: formData.reason.trim(),
            });

            // Return to the appointment list after a successful booking.
            navigate("/appointments");
        } catch (err) {
            setError(err.message || "Failed to create appointment.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loadingOptions) {
        return <p>Loading patients and doctors...</p>;
    }

    return (
        <section>
            <h1>Book Appointment</h1>
            <p>Select a patient, doctor, date, and reason for the visit.</p>

            {error && <p role="alert">{error}</p>}

            {patients.length === 0 || doctors.length === 0 ? (
                <div>
                    <p>
                        {patients.length === 0
                            ? "No patients are available. Add a patient first."
                            : "No doctors are available. Add a doctor first."}
                    </p>

                    <p>
                        <Link to="/patients">View Patients</Link>
                        {" | "}
                        <Link to="/doctors">View Doctors</Link>
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="patient">Patient</label>
                        <select
                            id="patient"
                            name="patient"
                            value={formData.patient}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a patient</option>

                            {patients.map((patient) => (
                                <option
                                    key={patient._id}
                                    value={patient._id}
                                >
                                    {patient.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="doctor">Doctor</label>
                        <select
                            id="doctor"
                            name="doctor"
                            value={formData.doctor}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a doctor</option>

                            {doctors.map((doctor) => (
                                <option
                                    key={doctor._id}
                                    value={doctor._id}
                                >
                                    {doctor.name}
                                    {doctor.specialization
                                        ? ` — ${doctor.specialization}`
                                        : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Popup calendar with a time selector. */}
                    <div className="form-field">
                        <label htmlFor="appointmentDate">
                            Appointment Date and Time
                        </label>

                        <DatePicker
                            id="appointmentDate"
                            name="appointmentDate"
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            minDate={minimumDateTime}
                            minTime={
                                selectedDate &&
                                selectedDate.toDateString() ===
                                    minimumDateTime.toDateString()
                                    ? minimumDateTime
                                    : new Date(0, 0, 0, 0, 0)
                            }
                            maxTime={new Date(0, 0, 0, 23, 45)}
                            showTimeSelect
                            timeIntervals={15}
                            dateFormat="dd MMMM yyyy, h:mm aa"
                            placeholderText="Choose date and time"
                            autoComplete="off"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="reason">
                            Reason for Appointment
                        </label>

                        <Textarea
                            id="reason"
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Enter the reason for the visit"
                            required
                        />
                    </div>

                    <Button type="submit" disabled={submitting}>
                        {submitting ? "Booking..." : "Book Appointment"}
                    </Button>

                    {" "}
                    <Link to="/appointments">Cancel</Link>
                </form>
            )}
        </section>
    );
}

export default CreateAppointmentPage;
