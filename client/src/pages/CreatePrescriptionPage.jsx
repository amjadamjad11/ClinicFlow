
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createPrescription,
  getConsultations,
  getPrescriptions,
} from "../services/api";
import Input from "../components/Input";
import Select from "../components/Select";
import Textarea from "../components/Textarea";
import Button from "../components/Button";

// Creates a blank medicine entry.
const emptyMedicine = () => ({
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
});

export default function CreatePrescriptionPage() {
  const navigate = useNavigate();

  const [consultations, setConsultations] = useState([]);
  const [consultation, setConsultation] = useState("");
  const [medicines, setMedicines] = useState([emptyMedicine()]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load consultations and prescriptions, then exclude
  // consultations that already have a prescription.
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [consultationResponse, prescriptionResponse] =
          await Promise.all([
            getConsultations(),
            getPrescriptions(),
          ]);

        const allConsultations = consultationResponse.data || [];
        const allPrescriptions = prescriptionResponse.data || [];

        const usedConsultationIds = new Set(
          allPrescriptions
            .map((prescription) => {
              const value = prescription.consultation;

              return typeof value === "object"
                ? value?._id
                : value;
            })
            .filter(Boolean)
            .map(String)
        );

        setConsultations(
          allConsultations.filter(
            (item) => !usedConsultationIds.has(String(item._id))
          )
        );
      } catch (err) {
        setError(err.message || "Unable to load consultation data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Input.jsx supplies a React event.
  // Extract its text value before updating the medicine.
  function updateMedicine(index, field, event) {
    const value = event.target.value;

    setMedicines((current) =>
      current.map((medicine, medicineIndex) =>
        medicineIndex === index
          ? { ...medicine, [field]: value }
          : medicine
      )
    );
  }

  function addMedicine() {
    setMedicines((current) => [...current, emptyMedicine()]);
  }

  function removeMedicine(index) {
    setMedicines((current) =>
      current.filter((_, medicineIndex) => medicineIndex !== index)
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    // The consultation must be a string ID, never a React event.
    if (typeof consultation !== "string" || !consultation) {
      setError("Please select a consultation.");
      return;
    }

    if (medicines.length === 0) {
      setError("Add at least one medicine.");
      return;
    }

    const cleanedMedicines = medicines.map((medicine) => ({
      name: medicine.name.trim(),
      dosage: medicine.dosage.trim(),
      frequency: medicine.frequency.trim(),
      duration: medicine.duration.trim(),
      instructions: medicine.instructions.trim(),
    }));

    const invalidMedicine = cleanedMedicines.some(
      (medicine) =>
        !medicine.name ||
        !medicine.dosage ||
        !medicine.frequency ||
        !medicine.duration
    );

    if (invalidMedicine) {
      setError(
        "Complete the name, dosage, frequency, and duration for every medicine."
      );
      return;
    }

    try {
      setSaving(true);

      // Send only plain JSON values to the backend.
      const prescriptionData = {
        consultation,
        medicines: cleanedMedicines,
        notes: notes.trim(),
      };

      console.log("Prescription payload:", prescriptionData);

      await createPrescription(prescriptionData);

      navigate("/prescriptions");
    } catch (err) {
      console.error("Prescription save failed:", err);
      setError(err.message || "Unable to create prescription.");
    } finally {
      setSaving(false);
    }
  }

  const consultationOptions = consultations.map((item) => {
    const appointment = item.appointment;
    const patient = appointment?.patient?.name || "Unknown patient";
    const doctor = appointment?.doctor?.name || "Unknown doctor";
    const diagnosis = item.diagnosis || "No diagnosis";

    return {
      value: String(item._id),
      label: `${patient} — ${doctor} — ${diagnosis}`,
    };
  });

  if (loading) {
    return (
      <main className="page-container">
        <p>Loading consultations...</p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <h1>Create Prescription</h1>
          <p>Select a consultation and enter its medicines.</p>
        </div>

        <Link to="/prescriptions">Back to Prescriptions</Link>
      </div>

      {error && <p role="alert">{error}</p>}

      {consultations.length === 0 ? (
        <p>
          No consultations are available for a new prescription.
          Create a consultation first, or check whether a prescription
          has already been recorded.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Select
            id="consultation"
            label="Consultation"
            name="consultation"
            value={consultation}
            // Select.jsx passes the selected value directly.
            onChange={(selectedValue) => {
              setConsultation(
                typeof selectedValue === "string"
                  ? selectedValue
                  : selectedValue?.target?.value ?? ""
              );
            }}
            options={consultationOptions}
            required
          />

          <h2>Medicines</h2>

          {medicines.map((medicine, index) => (
            <section key={index} className="form-section">
              <h3>Medicine {index + 1}</h3>

              <Input
                id={`medicine-name-${index}`}
                label="Medicine Name"
                name={`medicine-name-${index}`}
                value={medicine.name}
                onChange={(event) =>
                  updateMedicine(index, "name", event)
                }
                placeholder="Enter medicine name"
                required
              />

              <Input
                id={`medicine-dosage-${index}`}
                label="Dosage"
                name={`medicine-dosage-${index}`}
                value={medicine.dosage}
                onChange={(event) =>
                  updateMedicine(index, "dosage", event)
                }
                placeholder="e.g. 500 mg"
                required
              />

              <Input
                id={`medicine-frequency-${index}`}
                label="Frequency"
                name={`medicine-frequency-${index}`}
                value={medicine.frequency}
                onChange={(event) =>
                  updateMedicine(index, "frequency", event)
                }
                placeholder="e.g. Twice daily"
                required
              />

              <Input
                id={`medicine-duration-${index}`}
                label="Duration"
                name={`medicine-duration-${index}`}
                value={medicine.duration}
                onChange={(event) =>
                  updateMedicine(index, "duration", event)
                }
                placeholder="e.g. 5 days"
                required
              />

              <Input
                id={`medicine-instructions-${index}`}
                label="Instructions (optional)"
                name={`medicine-instructions-${index}`}
                value={medicine.instructions}
                onChange={(event) =>
                  updateMedicine(index, "instructions", event)
                }
                placeholder="e.g. Take after food"
              />

              {medicines.length > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => removeMedicine(index)}
                >
                  Remove Medicine
                </Button>
              )}
            </section>
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={addMedicine}
          >
            + Add Another Medicine
          </Button>

          <Textarea
            id="notes"
            label="Prescription Notes (optional)"
            name="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Enter additional notes"
          />

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Prescription"}
          </Button>
        </form>
      )}
    </main>
  );
}
