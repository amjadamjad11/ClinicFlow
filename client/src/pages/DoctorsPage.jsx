
 // DoctorsPage → displays doctors registered in ClinicFlow.
 // Why? → Admins, Doctors, and Receptionists need to view doctor records.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDoctors } from "../services/api";

function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // useEffect → loads doctors when the page first opens.
        // Why? → The list should come from the backend, not hardcoded data.
        async function loadDoctors() {
            try {
                setError("");

                const response = await getDoctors();
                setDoctors(response.data);
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadDoctors();
    }, []);

    return (
        <main>
            <section>
                <h1>Doctors</h1>

                <p>Manage doctors registered in ClinicFlow.</p>

                <p>
                    <Link to="/doctors/create">Register Doctor</Link>
                </p>

                {loading && <p>Loading doctors...</p>}

                {error && <p role="alert">{error}</p>}

                {!loading && !error && doctors.length === 0 && (
                    <p>No doctors found.</p>
                )}

                {!loading && !error && doctors.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Specialization</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Experience</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {doctors.map((doctor) => (
                                <tr key={doctor._id}>
                                    <td>
                                        <Link to={`/doctors/${doctor._id}`}>
                                            {doctor.name}
                                        </Link>
                                    </td>

                                    <td>{doctor.specialization}</td>
                                    <td>{doctor.phone}</td>
                                    <td>{doctor.email || "—"}</td>
                                    <td>{doctor.experience} years</td>

                                    <td>
                                        <Link to={`/doctors/${doctor._id}`}>
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </main>
    );
}

export default DoctorsPage;
