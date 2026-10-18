// EditAppointmentPage.jsx
// Purpose: Allow Admins and Receptionists to update an existing appointment.

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    getAppointment,
    getPatients,
    getDoctors,
    updateAppointment,
} from "../services/api";

import Button from "../components/Button";
import Select from "../components/Select";

function EditAppointmentPage() {
    // Read the appointment ID from /appointments/:id/edit.
    const { id } = useParams();

    // Redirect the user after saving or cancelling.
    const navigate = useNavigate();

    // Store the appointment form fields.
    const [formData, setFormData] = useState({
        patient: "",
        doctor: "",
        reason: "",
        status: "Scheduled",
    });

    // Store the selected appointment date and time as a JavaScript Date.
    const [selectedDate, setSelectedDate] = useState(null);

    // Store patients and doctors for the dropdown menus.
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);

    // Track loading, saving, and errors separately.
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Remember the current time so the user cannot select a past appointment.
    const [minimumDateTime] = useState(() => new Date());

    // Load the appointment and dropdown options when the page opens.
    useEffect(() => {
        async function loadPageData() {
            try {
                setLoading(true);
                setError("");

                // Load the appointment, patients, and doctors together.
                const [
                    appointmentResponse,
                    patientsResponse,
                    doctorsResponse,
                ] = await Promise.all([
                    getAppointment(id),
                    getPatients(),
                    getDoctors(),
                ]);

                const appointment = appointmentResponse.data;

                // Populate the form with the existing appointment information.
                setFormData({
                    patient:
                        appointment.patient?._id ||
                        appointment.patient ||
                        "",
                    doctor:
                        appointment.doctor?._id ||
                        appointment.doctor ||
                        "",
                    reason: appointment.reason || "",
                    status: appointment.status || "Scheduled",
                });

                // Convert the saved date string into a Date object for the calendar.
                const existingDate = new Date(
                    appointment.appointmentDate
                );

                if (Number.isNaN(existingDate.getTime())) {
                    throw new Error(
                        "The saved appointment date is invalid."
                    );
                }

                setSelectedDate(existingDate);
                setPatients(patientsResponse.data);
                setDoctors(doctorsResponse.data);
            } catch (requestError) {
                setError(
                    requestError.message ||
                    "Failed to load appointment information."
                );
            } finally {
                setLoading(false);
            }
        }

        loadPageData();
    }, [id]);

    // Update a form field without changing the other fields.
    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    }

    // Validate the form and send the changes to the backend.
    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (
            !formData.patient ||
            !formData.doctor ||
            !formData.reason.trim() ||
            !selectedDate
        ) {
            setError("Please complete all required fields.");
            return;
        }

        // Prevent selecting an appointment time that has already passed.
        if (selectedDate.getTime() <= Date.now()) {
            setError("Please select a future appointment date and time.");
            return;
        }

        setSaving(true);

        try {
            // Convert the selected date into ISO format for the API.
            await updateAppointment(id, {
                patient: formData.patient,
                doctor: formData.doctor,
                appointmentDate: selectedDate.toISOString(),
                reason: formData.reason.trim(),
                status: formData.status,
            });

            // Return to the updated appointment's details page.
            navigate(`/appointments/${id}`);
        } catch (requestError) {
            setError(
                requestError.message ||
                "Failed to update the appointment."
            );
        } finally {
            setSaving(false);
        }
    }

    // Show a message while the existing data is loading.
    if (loading) {
        return (
            <main>
                <section>
                    <h1>Edit Appointment</h1>
                    <p>Loading appointment information...</p>
                </section>
            </main>
        );
    }

    // Do not show an empty form if the appointment could not be loaded.
    if (!selectedDate) {
        return (
            <main>
                <section>
                    <h1>Edit Appointment</h1>

                    <p role="alert">
                        {error || "Appointment information is unavailable."}
                    </p>

                    <Link to={`/appointments/${id}`}>
                        Back to Appointment Details
                    </Link>
                </section>
            </main>
        );
    }

    // Convert API records into the options expected by the dropdown component.
    const patientOptions = patients.map((patient) => ({
        value: patient._id,
        label: patient.name,
    }));

    const doctorOptions = doctors.map((doctor) => ({
        value: doctor._id,
        label: `${doctor.name} (${doctor.specialization})`,
    }));

    // Restrict the calendar to today or later.
    // If today is selected, restrict the time selector to future times.
    const isToday =
        selectedDate.toDateString() ===
        minimumDateTime.toDateString();

    const minimumTime = isToday
        ? minimumDateTime
        : new Date(0, 0, 0, 0, 0);

    const maximumTime = new Date(0, 0, 0, 23, 45);

    return (
        <main>
            <section>
                <h1>Edit Appointment</h1>

                <p>
                    Update the patient, doctor, date, time, status, or reason.
                </p>

                {error && (
                    <p role="alert">{error}</p>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Select the patient associated with this appointment. */}
                    <Select
                        label="Patient"
                        id="patient"
                        name="patient"
                        value={formData.patient}
                        onChange={handleChange}
                        options={patientOptions}
                        required
                    />

                    {/* Select the doctor responsible for the appointment. */}
                    <Select
                        label="Doctor"
                        id="doctor"
                        name="doctor"
                        value={formData.doctor}
                        onChange={handleChange}
                        options={doctorOptions}
                        required
                    />

                    {/* Reuse the popup calendar from the booking page. */}
                    <div>
                        <label htmlFor="appointmentDate">
                            Appointment Date and Time
                        </label>

                        <DatePicker
                            id="appointmentDate"
                            selected={selectedDate}
                            onChange={setSelectedDate}
                            showTimeSelect
                            timeIntervals={15}
                            minDate={minimumDateTime}
                            minTime={minimumTime}
                            maxTime={maximumTime}
                            dateFormat="dd/MM/yyyy h:mm aa"
                            placeholderText="Choose date and time"
                            required
                        />
                    </div>

                    {/* The backend accepts these four exact status values. */}
                    <div>
                        <label htmlFor="status">
                            Appointment Status
                        </label>

                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="Scheduled">Scheduled</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Keep the appointment reason editable. */}
                    <div>
                        <label htmlFor="reason">
                            Reason for Appointment
                        </label>

                        <textarea
                            id="reason"
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            rows={4}
                            required
                        />
                    </div>

                    <Button type="submit" disabled={saving}>
                        {saving ? "Saving Changes..." : "Save Changes"}
                    </Button>

                    {" "}

                    <Link to={`/appointments/${id}`}>
                        Cancel
                    </Link>
                </form>
            </section>
        </main>
    );
}

export default EditAppointmentPage;