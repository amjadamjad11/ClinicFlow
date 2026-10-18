
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPrescriptions } from "../services/api";
import { useAuth } from "../context/useAuth";

export default function PrescriptionsPage() {
  const { user } = useAuth();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load saved prescriptions from the backend when the page opens.
  useEffect(() => {
    async function loadPrescriptions() {
      try {
        setLoading(true);
        setError("");

        const response = await getPrescriptions();
        setPrescriptions(response.data || []);
      } catch (err) {
        setError(err.message || "Unable to load prescriptions.");
      } finally {
        setLoading(false);
      }
    }

    loadPrescriptions();
  }, []);

  const canCreate =
    user?.role === "Admin" || user?.role === "Doctor";

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <h1>Prescriptions</h1>
          <p>View prescriptions recorded for consultations.</p>
        </div>

        {canCreate && (
          <Link to="/prescriptions/create" className="button">
            Create Prescription
          </Link>
        )}
      </div>

      {loading && <p>Loading prescriptions...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && prescriptions.length === 0 && (
        <p>No prescriptions found.</p>
      )}

      {!loading && !error && prescriptions.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Diagnosis</th>
                <th>Medicines</th>
                <th>Notes</th>
              </tr>
            </thead>

            <tbody>
              {prescriptions.map((prescription) => {
                const consultation = prescription.consultation;
                const appointment = consultation?.appointment;

                return (
                  <tr key={prescription._id}>
                    <td>
                      {appointment?.patient?.name || "N/A"}
                    </td>

                    <td>
                      {appointment?.doctor?.name || "N/A"}
                    </td>

                    <td>
                      {consultation?.diagnosis || "N/A"}
                    </td>

                    <td>
                      {prescription.medicines
                        ?.map((medicine) => medicine.name)
                        .join(", ") || "N/A"}
                    </td>

                    <td>{prescription.notes || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
