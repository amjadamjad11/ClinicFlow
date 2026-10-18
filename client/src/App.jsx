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
import DoctorsPage from "./pages/DoctorsPage";
import CreateDoctorPage from "./pages/CreateDoctorPage";
import DoctorDetailsPage from "./pages/DoctorDetailsPage";
import DoctorSchedulePage from "./pages/DoctorSchedulePage";
import EditDoctorPage from "./pages/EditDoctorPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import CreateAppointmentPage from "./pages/CreateAppointmentPage";
import AppointmentDetailsPage from "./pages/AppointmentDetailsPage";
import EditAppointmentPage from "./pages/EditAppointmentPage";
import ConsultationsPage from "./pages/ConsultationsPage";
import CreateConsultationPage from "./pages/CreateConsultationPage";
import PrescriptionsPage from "./pages/PrescriptionsPage";
import CreatePrescriptionPage from "./pages/CreatePrescriptionPage";
import ConsultationDetailsPage from "./pages/ConsultationDetailsPage";
import PrescriptionDetailsPage from "./pages/PrescriptionDetailsPage";

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

                        <Route
                            path="/prescriptions/:id"
                            element={<PrescriptionDetailsPage />}
                        />

                        <Route
                            path="/consultations/:id"
                            element={<ConsultationDetailsPage />}
                        />

                        <Route path="/prescriptions" element={<PrescriptionsPage />} />
                        <Route
                        path="/prescriptions/create"
                        element={<CreatePrescriptionPage />}
                        />

                        <Route
                            path="/consultations"
                            element={<ConsultationsPage />}
                        />

                        <Route
                            path="/consultations/create"
                            element={<CreateConsultationPage />}
                        />

                        <Route
                            path="/appointments/:id/edit"
                            element={<EditAppointmentPage />}
                        />

                        <Route
                            path="/appointments/:id"
                            element={<AppointmentDetailsPage />}
                        />

                        <Route
                            path="/appointments/create"
                            element={<CreateAppointmentPage />}
                        />

                        <Route
                            path="/appointments"
                            element={<AppointmentsPage />}
                        />

                        <Route
                            path="/doctors/:id/edit"
                            element={<EditDoctorPage />}
                        />

                        <Route
                            path="/doctors/:id/schedule"
                            element={<DoctorSchedulePage />}
                        />

                        <Route
                            path="/doctors/:id"
                            element={<DoctorDetailsPage />}
                        />

                        <Route
                            path="/doctors/create"
                            element={<CreateDoctorPage />}
                        />

                        <Route
                            path="/doctors"
                            element={<DoctorsPage />}
                        />

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