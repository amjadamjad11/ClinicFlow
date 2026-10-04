// api.js → central place for communicating with the ClinicFlow backend.
// Why? → Keeping API requests here prevents pages and components
// from becoming filled with backend communication logic.

const API_URL = import.meta.env.VITE_API_URL;

// AUTH_STORAGE_KEY → must match the key used by AuthContext.
// Why? → This lets the API service retrieve the JWT saved after login.
const AUTH_STORAGE_KEY = "clinicflow_auth";

// apiRequest → reusable function for sending HTTP requests to ClinicFlow.
async function apiRequest(endpoint, options = {}) {
    // Read the authentication data saved by AuthContext.
    // sessionStorage → keeps the JWT available after page refreshes
    // during the current browser session.
    const storedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);

    // Convert the stored JSON string into a JavaScript object.
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
    const data = await response.json();

    // HTTP status codes outside 200–299 mean the request failed.
    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}

// loginUser → sends login credentials to the existing ClinicFlow backend.
// Why? → This connects the React login page to the authentication API.
export async function loginUser(email, password) {
    return apiRequest("/api/auth/login", {
        method: "POST",

        body: JSON.stringify({
            email,
            password,
        }),
    });
}

export default apiRequest;