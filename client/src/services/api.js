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

// Export apiRequest for any future frontend API functions
// that need the common request behavior directly.
export default apiRequest;