// App → root component of the ClinicFlow frontend.
// Why? → React Router controls which page is displayed,
// while AppLayout provides the shared application structure.

import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import PatientsPage from "./pages/PatientsPage";
import CreatePatientPage from "./pages/CreatePatientPage";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import EditPatientPage from "./pages/EditPatientPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* AppLayout → shared structure used by ClinicFlow pages. */}
                <Route element={<AppLayout />}>

                    {/* Public home page. */}
                    <Route path="/" element={<HomePage />} />

                    {/* Public login page. */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* ProtectedRoute → blocks unauthenticated users. */}
                    <Route element={<ProtectedRoute />}>

                        {/* /dashboard → accessible only after authentication. */}
                        <Route
                            path="/dashboard"
                            element={<DashboardPage />}
                        />

                        <Route
                            path="/patients"
                            element={<PatientsPage />}
                        />

                        <Route
                            path="/patients/create"
                            element={<CreatePatientPage />}
                        />

                        <Route
                            path="/patients/:id"
                            element={<PatientDetailsPage />}
                        />

                        <Route
                            path="/patients/:id/edit"
                            element={<EditPatientPage />}
                        />

                    </Route>

                    {/* Unknown URLs display the 404 page. */}
                    <Route path="*" element={<NotFoundPage />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;