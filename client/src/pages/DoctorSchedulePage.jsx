
// DoctorSchedulePage → displays appointments assigned to one doctor.
// Why? → Staff need to view the doctor's upcoming and previous appointments.

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDoctorSchedule } from "../services/api";

function DoctorSchedulePage() {
    // useParams → reads the doctor ID from the current URL.
    const { id } = useParams();

    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadSchedule() {
            try {
                setError("");
                setLoading(true);

                // Request the schedule and patient details from the backend.
                const response = await getDoctorSchedule(id);
                setSchedule(response);
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadSchedule();
    }, [id]);

    if (loading) {
        return (
            <main>
                <section>
                    <h1>Doctor Schedule</h1>
                    <p>Loading appointments...</p>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <section>
                    <h1>Doctor Schedule</h1>
                    <p role="alert">{error}</p>
                    <Link to={`/doctors/${id}`}>Back to Doctor Details</Link>
                </section>
            </main>
        );
    }

    return (
        <main>
            <section>
                <h1>Appointment Schedule</h1>

                <h2>{schedule.doctor.name}</h2>
                <p>Specialization: {schedule.doctor.specialization}</p>
                <p>Total appointments: {schedule.results}</p>

                {schedule.data.length === 0 ? (
                    <p>No appointments found for this doctor.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Date and Time</th>
                                <th>Patient</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Reason</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {schedule.data.map((appointment) => (
                                <tr key={appointment._id}>
                                    <td>
                                        {new Date(
                                            appointment.appointmentDate
                                        ).toLocaleString()}
                                    </td>

                                    <td>
                                        {appointment.patient?.name || "Patient unavailable"}
                                    </td>

                                    <td>
                                        {appointment.patient?.phone || "—"}
                                    </td>

                                    <td>
                                        {appointment.patient?.email || "—"}
                                    </td>

                                    <td>{appointment.reason}</td>
                                    <td>{appointment.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <p>
                    <Link to={`/doctors/${id}`}>
                        Back to Doctor Details
                    </Link>
                </p>

                <p>
                    <Link to="/doctors">Back to Doctors</Link>
                </p>
            </section>
        </main>
    );
}

export default DoctorSchedulePage;
