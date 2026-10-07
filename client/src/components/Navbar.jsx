// Navbar → shared navigation component for ClinicFlow.
// Why? → Users need a consistent way to move between
// different sections of the application.

import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar() {
    // useAuth → accesses the current authentication state.
    // Why? → The Navbar needs to display different controls
    // depending on whether the user is logged in.
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <nav>
            {/* ClinicFlow → application logo/name that links to the home page. */}
            <Link to="/">ClinicFlow</Link>

            <div>
                {/* Home → public page available to everyone. */}
                <Link to="/">Home</Link>

                {!isAuthenticated ? (
                    // Login → shown when there is no authenticated user.
                    <Link to="/login">Login</Link>
                ) : (
                    <>
                        {/* Dashboard → private page available after authentication. */}
                        <Link to="/dashboard">Dashboard</Link>

                        <Link to="/patients">Patients</Link>

                        {/* Display the authenticated user's name and role. */}
                        <span>
                            {user.name} ({user.role})
                        </span>

                        {/* logout → clears authentication and sessionStorage data. */}
                        <button type="button" onClick={logout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;