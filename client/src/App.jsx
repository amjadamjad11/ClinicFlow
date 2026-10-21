import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

// Load page components only when their routes are visited.
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const PatientsPage = lazy(() => import("./pages/PatientsPage"));
const CreatePatientPage = lazy(() => import("./pages/CreatePatientPage"));
const PatientDetailsPage = lazy(() => import("./pages/PatientDetailsPage"));
const EditPatientPage = lazy(() => import("./pages/EditPatientPage"));

const DoctorsPage = lazy(() => import("./pages/DoctorsPage"));
const CreateDoctorPage = lazy(() => import("./pages/CreateDoctorPage"));
const DoctorDetailsPage = lazy(() => import("./pages/DoctorDetailsPage"));
const DoctorSchedulePage = lazy(() => import("./pages/DoctorSchedulePage"));
const EditDoctorPage = lazy(() => import("./pages/EditDoctorPage"));

const AppointmentsPage = lazy(() => import("./pages/AppointmentsPage"));
const CreateAppointmentPage = lazy(() => import("./pages/CreateAppointmentPage"));
const AppointmentDetailsPage = lazy(() => import("./pages/AppointmentDetailsPage"));
const EditAppointmentPage = lazy(() => import("./pages/EditAppointmentPage"));

const ConsultationsPage = lazy(() => import("./pages/ConsultationsPage"));
const CreateConsultationPage = lazy(() => import("./pages/CreateConsultationPage"));
const ConsultationDetailsPage = lazy(() => import("./pages/ConsultationDetailsPage"));

const PrescriptionsPage = lazy(() => import("./pages/PrescriptionsPage"));
const CreatePrescriptionPage = lazy(() => import("./pages/CreatePrescriptionPage"));
const PrescriptionDetailsPage = lazy(() => import("./pages/PrescriptionDetailsPage"));

const BillingPage = lazy(() => import("./pages/BillingPage"));
const BillingDetailsPage = lazy(() => import("./pages/BillingDetailsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

function App() {
    return (
        <BrowserRouter>
            <Suspense
                fallback={
                    <div role="status" aria-live="polite">
                        Loading page...
                    </div>
                }
            >
                <Routes>
                    {/* Shared layout for ClinicFlow pages. */}
                    <Route element={<AppLayout />}>
                        {/* Public pages. */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />

                        {/* Protected pages require authentication. */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/profile" element={<ProfilePage />} />

                            <Route path="/billing/:id" element={<BillingDetailsPage />} />
                            <Route path="/billing" element={<BillingPage />} />

                            <Route path="/prescriptions/:id" element={<PrescriptionDetailsPage />} />
                            <Route path="/prescriptions" element={<PrescriptionsPage />} />
                            <Route path="/prescriptions/create" element={<CreatePrescriptionPage />} />

                            <Route path="/consultations/:id" element={<ConsultationDetailsPage />} />
                            <Route path="/consultations" element={<ConsultationsPage />} />
                            <Route path="/consultations/create" element={<CreateConsultationPage />} />

                            <Route path="/appointments/:id/edit" element={<EditAppointmentPage />} />
                            <Route path="/appointments/:id" element={<AppointmentDetailsPage />} />
                            <Route path="/appointments/create" element={<CreateAppointmentPage />} />
                            <Route path="/appointments" element={<AppointmentsPage />} />

                            <Route path="/doctors/:id/edit" element={<EditDoctorPage />} />
                            <Route path="/doctors/:id/schedule" element={<DoctorSchedulePage />} />
                            <Route path="/doctors/:id" element={<DoctorDetailsPage />} />
                            <Route path="/doctors/create" element={<CreateDoctorPage />} />
                            <Route path="/doctors" element={<DoctorsPage />} />

                            <Route path="/dashboard" element={<DashboardPage />} />

                            <Route path="/patients" element={<PatientsPage />} />
                            <Route path="/patients/create" element={<CreatePatientPage />} />
                            <Route path="/patients/:id/edit" element={<EditPatientPage />} />
                            <Route path="/patients/:id" element={<PatientDetailsPage />} />
                        </Route>

                        {/* Unknown URLs display the 404 page. */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
