// PatientsPage → displays the patients stored in ClinicFlow.
// Why? → This is the main patient management screen where users
// can view registered patients and open individual patient records.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPatients } from "../services/api";

function PatientsPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadPatients() {
            try {
                setError("");

                // getPatients → requests all patients from the backend API.
                // Why? → The page needs the latest patient records from MongoDB.
                const response = await getPatients();

                setPatients(response.data);
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        }

        loadPatients();
    }, []);

    return (
        <main>
            <section>
                <h1>Patients</h1>

                <p>Manage patients registered in ClinicFlow.</p>

                {/* Create Patient → opens the patient registration form. */}
                <Link to="/patients/create">
                    Create Patient
                </Link>

                {loading && <p>Loading patients...</p>}

                {error && <p role="alert">{error}</p>}

                {!loading && !error && patients.length === 0 && (
                    <p>No patients found.</p>
                )}

                {!loading && !error && patients.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date of Birth</th>
                                <th>Gender</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {patients.map((patient) => (
                                <tr key={patient._id}>
                                    <td>
                                        {/* Patient name → opens this patient's details page. */}
                                        <Link to={`/patients/${patient._id}`}>
                                            {patient.name}
                                        </Link>
                                    </td>

                                    <td>
                                        {new Date(
                                            patient.dateOfBirth
                                        ).toLocaleDateString()}
                                    </td>

                                    <td>{patient.gender}</td>

                                    <td>{patient.phone}</td>

                                    <td>{patient.email || "—"}</td>

                                    <td>
                                        {/* View Details → uses the patient's MongoDB ID
                                            automatically, so we don't need to copy it manually. */}
                                        <Link to={`/patients/${patient._id}`}>
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

export default PatientsPage;