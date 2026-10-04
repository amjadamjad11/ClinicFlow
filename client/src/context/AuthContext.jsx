// AuthContext → shared authentication state for ClinicFlow.
// Why? → Multiple pages and components need to know
// whether a user is logged in and who the current user is.

import { createContext, useState } from "react";

// AuthContext → stores authentication information shared across the app.
const AuthContext = createContext(null);

// AUTH_STORAGE_KEY → name used to store authentication data in sessionStorage.
// Why? → The login state needs to survive browser refreshes.
const AUTH_STORAGE_KEY = "clinicflow_auth";

// AuthProvider → makes authentication state available to child components.
// Why? → Wrapping the application with this provider allows
// any component to access login/logout information.
export function AuthProvider({ children }) {
    // Read previously stored authentication data when the application starts.
    // sessionStorage → browser storage that survives page refreshes
    // but is cleared when the browser session ends.
    const storedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);

    // Convert the stored JSON string back into a JavaScript object.
    const initialAuth = storedAuth ? JSON.parse(storedAuth) : null;

    // token → stores the JWT received from the ClinicFlow backend.
    const [token, setToken] = useState(initialAuth?.token ?? null);

    // user → stores the logged-in user's basic information.
    const [user, setUser] = useState(initialAuth?.user ?? null);

    // login → saves authentication information in React state
    // and sessionStorage so refreshes do not immediately log the user out.
    const login = (loginData) => {
        setToken(loginData.token);
        setUser(loginData.user);

        // Store only the authentication data required by the frontend.
        // Never store the user's password.
        sessionStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({
                token: loginData.token,
                user: loginData.user,
            })
        );
    };

    // logout → clears authentication from React state and browser storage.
    const logout = () => {
        setToken(null);
        setUser(null);

        // Remove the stored authentication information.
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
    };

    // isAuthenticated → simple boolean used by pages
    // to determine whether a user is currently logged in.
    const isAuthenticated = Boolean(token);

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// AuthContext → exported so the custom useAuth hook can access it.
export default AuthContext;