// api.js → central place for communicating with the ClinicFlow backend.
// Why? → Keeping API requests here prevents pages and components
// from being filled with backend communication logic.

const API_URL = import.meta.env.VITE_API_URL;

// AUTH_STORAGE_KEY → must match the key used by AuthContext.
// Why? → This lets the API service retrieve the JWT saved after login.
const AUTH_STORAGE_KEY = "clinicflow_auth";

// apiRequest → reusable function for sending HTTP requests to ClinicFlow.
// Why? → All frontend API functions can use the same request logic.
async function apiRequest(endpoint, options = {}) {
    // Read authentication data saved by AuthContext.
    // sessionStorage → keeps authentication available after page refreshes
    // during the current browser session.
    const storedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);

    // Convert stored JSON back into a JavaScript object.
    const authData = storedAuth ? JSON.parse(storedAuth) : null;

    // token → JWT received from the backend after successful login.
    const token = authData?.token;

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,

        headers: {
            "Content-Type": "application/json",

            // Authorization → sends the JWT to protected backend endpoints.
            // Why? → The backend uses this token to identify the logged-in user.
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),

            // Allow individual requests to provide additional headers.
            ...options.headers,
        },
    });

    // Convert the backend response from JSON into a JavaScript object.
    if (response.status === 204) {
    return null;
    }

// Convert JSON responses into a JavaScript object.
    const data = await response.json();

// HTTP status codes outside 200–299 mean the request failed.
    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}

// loginUser → sends login credentials to the authentication API.
export async function loginUser(email, password) {
    return apiRequest("/api/auth/login", {
        method: "POST",

        body: JSON.stringify({
            email,
            password,
        }),
    });
}

// getPatients → retrieves all patients from the backend.
// Why? → The Patient List page uses this function to display patients.
export async function getPatients() {
    return apiRequest("/api/patients");
}

// getPatient → retrieves one patient using their MongoDB ID.
// Why? → Patient details and editing need the selected patient's data.
export async function getPatient(patientId) {
    return apiRequest(`/api/patients/${patientId}`);
}

// createPatient → creates a new patient.
// Why? → Admin and Receptionist users can register new patients.
export async function createPatient(patientData) {
    return apiRequest("/api/patients", {
        method: "POST",
        body: JSON.stringify(patientData),
    });
}

// updatePatient → updates an existing patient.
// Why? → Admin and Receptionist users can modify patient information.
export async function updatePatient(patientId, patientData) {
    return apiRequest(`/api/patients/${patientId}`, {
        method: "PUT",
        body: JSON.stringify(patientData),
    });
}

// deletePatient → deletes a patient.
// Why? → Only Admin users are allowed to delete patients.
export async function deletePatient(patientId) {
    return apiRequest(`/api/patients/${patientId}`, {
        method: "DELETE",
    });
}

// getPatientHistory → retrieves the complete history of a patient.
// Why? → Doctors, Receptionists, and Admins can view patient history.
export async function getPatientHistory(patientId) {
    return apiRequest(`/api/patients/${patientId}/history`);
}


// getDoctors → retrieves all doctors from the backend.
// Why? → The Doctors page needs the list of registered doctors.
export async function getDoctors() {
    return apiRequest("/api/doctors");
}

// getDoctor → retrieves one doctor using their MongoDB ID.
// Why? → The details and edit pages need the selected doctor's data.
export async function getDoctor(doctorId) {
    return apiRequest(`/api/doctors/${doctorId}`);
}

// createDoctor → registers a new doctor.
// Why? → Only Admin users can create doctors, as enforced by the backend.
export async function createDoctor(doctorData) {
    return apiRequest("/api/doctors", {
        method: "POST",
        body: JSON.stringify(doctorData),
    });
}

// updateDoctor → updates an existing doctor's information.
// Why? → The backend restricts doctor updates to Admin users.
export async function updateDoctor(doctorId, doctorData) {
    return apiRequest(`/api/doctors/${doctorId}`, {
        method: "PUT",
        body: JSON.stringify(doctorData),
    });
}

// deleteDoctor → deletes a doctor.
// Why? → The backend restricts doctor deletion to Admin users.
export async function deleteDoctor(doctorId) {
    return apiRequest(`/api/doctors/${doctorId}`, {
        method: "DELETE",
    });
}

// getDoctorSchedule → retrieves appointments for a selected doctor.
// Why? → The schedule page needs this doctor's appointment records.
export async function getDoctorSchedule(doctorId) {
    return apiRequest(`/api/doctors/${doctorId}/schedule`);
}

 // getAppointments → retrieves all appointments from the backend.
 // Why? → The Appointments page needs records to display in a list.
export async function getAppointments() {
    return apiRequest("/api/appointments");
}

// getAppointment → retrieves one appointment using its MongoDB ID.
// Why? → The details page needs the selected appointment's information.
export async function getAppointment(appointmentId) {
    return apiRequest(`/api/appointments/${appointmentId}`);
}

// createAppointment → books a new appointment.
// Why? → Admin and Receptionist users can create appointments.
export async function createAppointment(appointmentData) {
    return apiRequest("/api/appointments", {
        method: "POST",
        body: JSON.stringify(appointmentData),
    });
}

// updateAppointment → updates an existing appointment.
// Why? → Admin and Receptionist users can modify appointments.
export async function updateAppointment(appointmentId, appointmentData) {
    return apiRequest(`/api/appointments/${appointmentId}`, {
        method: "PUT",
        body: JSON.stringify(appointmentData),
    });
}

// deleteAppointment → deletes an appointment.
// Why? → Admin and Receptionist users can delete appointments.
export async function deleteAppointment(appointmentId) {
    return apiRequest(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
    });
}

/*
 * CONSULTATION API FUNCTIONS
 *
 * A consultation stores the symptoms, diagnosis, treatment,
 * and notes recorded by a doctor for an appointment.
 */

// Retrieve all consultations from the backend.
export async function getConsultations() {
    return apiRequest("/api/consultations");
}

// Retrieve one consultation using its MongoDB ID.
export async function getConsultation(consultationId) {
    return apiRequest(`/api/consultations/${consultationId}`);
}

// Create a consultation for an existing appointment.
export async function createConsultation(consultationData) {
    return apiRequest("/api/consultations", {
        method: "POST",
        body: JSON.stringify(consultationData),
    });
}

// Update an existing consultation.
export async function updateConsultation(
    consultationId,
    consultationData
) {
    return apiRequest(`/api/consultations/${consultationId}`, {
        method: "PUT",
        body: JSON.stringify(consultationData),
    });
}

// Delete a consultation. The backend restricts this to Admin users.
export async function deleteConsultation(consultationId) {
    return apiRequest(`/api/consultations/${consultationId}`, {
        method: "DELETE",
    });
}

/*
 * PRESCRIPTION API FUNCTIONS
 *
 * A prescription belongs to a consultation and contains
 * one or more medicines.
 */

// Retrieve all prescriptions from the backend.
export async function getPrescriptions() {
    return apiRequest("/api/prescriptions");
}

// Retrieve one prescription using its MongoDB ID.
export async function getPrescription(prescriptionId) {
    return apiRequest(`/api/prescriptions/${prescriptionId}`);
}

// Create a prescription for an existing consultation.
// Send a new prescription to the backend API.
export function createPrescription(prescriptionData) {
    return apiRequest("/api/prescriptions", {
        method: "POST",
        body: JSON.stringify(prescriptionData),
    });
}

// Update an existing prescription.
export async function updatePrescription(
    prescriptionId,
    prescriptionData
) {
    return apiRequest(`/api/prescriptions/${prescriptionId}`, {
        method: "PUT",
        body: JSON.stringify(prescriptionData),
    });
}

// Delete a prescription. The backend restricts this to Admin users.
export async function deletePrescription(prescriptionId) {
    return apiRequest(`/api/prescriptions/${prescriptionId}`, {
        method: "DELETE",
    });
}


/*
 * BILLING API FUNCTIONS
 *
 * These functions connect the Billing UI to the existing backend.
 * apiRequest automatically includes the authentication token.
 */

// Retrieve all billing records, newest first.
export async function getBillings() {
    return apiRequest("/api/billing");
}

// Retrieve one billing record using its MongoDB ID.
export async function getBilling(billingId) {
    return apiRequest(`/api/billing/${billingId}`);
}

// Create a bill for an existing consultation.
export async function createBilling(billingData) {
    return apiRequest("/api/billing", {
        method: "POST",
        body: JSON.stringify(billingData),
    });
}

// Update an existing bill.
// The backend recalculates the total from the charge fields.
export async function updateBilling(billingId, billingData) {
    return apiRequest(`/api/billing/${billingId}`, {
        method: "PUT",
        body: JSON.stringify(billingData),
    });
}

// Export apiRequest for any future frontend API functions
// that need the common request behavior directly.
export default apiRequest;