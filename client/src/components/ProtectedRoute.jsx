// ProtectedRoute → protects ClinicFlow routes from unauthenticated access.
// Why? → Users should not be able to access private application pages
// without first logging into ClinicFlow.

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function ProtectedRoute() {
    // useAuth → gets the current authentication status.
    // Why? → We need to know whether the user is allowed to continue.
    const { isAuthenticated } = useAuth();

    // Navigate → redirects unauthenticated users to the login page.
    // Outlet → displays the protected route when authentication succeeds.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;