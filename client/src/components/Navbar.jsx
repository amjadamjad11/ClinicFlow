// Navbar → shared navigation component for ClinicFlow.
// Why? → Users need a consistent way to move between
// different sections of the application.

import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav> 
          <Link to="/">
                ClinicFlow
            </Link>

            <div>
                <Link to="/">
                    Home
                </Link>
                <Link to="/login">
                    Login
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;