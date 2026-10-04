// DashboardPage → first authenticated page in ClinicFlow.
// Why? → We need a real private page to verify that
// ProtectedRoute correctly blocks unauthenticated users.

import { useAuth } from "../context/useAuth";

function DashboardPage() {
    // useAuth → gets information about the currently logged-in user.
    // Why? → The dashboard can display personalized information.
    const { user } = useAuth();

    return (
        <main>
            <section>
                <h1>ClinicFlow Dashboard</h1>

                <p>
                    Welcome, {user.name}.
                </p>

                <p>
                    Role: {user.role}
                </p>

                <p>
                    You are successfully authenticated.
                </p>
            </section>
        </main>
    );
}

export default DashboardPage;