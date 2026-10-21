
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { getDashboardSummary } from "../services/api";
import "./DashboardPage.css";

// Displays a loading message, error, or live clinic dashboard.
function DashboardPage() {
    const { user } = useAuth();

    // Stores the dashboard data returned by the backend.
    const [dashboard, setDashboard] = useState(null);

    // Tracks whether the initial API request is running.
    const [loading, setLoading] = useState(true);

    // Stores an error message if the request fails.
    const [error, setError] = useState("");

    useEffect(() => {
        // Prevents state updates if this page unmounts before the request finishes.
        let isActive = true;

        async function loadDashboard() {
            try {
                setLoading(true);
                setError("");

                const response = await getDashboardSummary();

                if (isActive) {
                    // The backend wraps dashboard information inside data.
                    setDashboard(response?.data ?? null);
                }
            } catch (requestError) {
                if (isActive) {
                    setError(
                        requestError.message ||
                            "Unable to load dashboard information."
                    );
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        }

        loadDashboard();

        return () => {
            isActive = false;
        };
    }, []);

    // Formats dates safely for display.
    function formatDate(value) {
        if (!value) return "Date unavailable";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return date.toLocaleString();
    }

    // Formats currency in Indian rupees.
    function formatCurrency(value) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number(value) || 0);
    }

    if (loading) {
        return (
            <main className="dashboard-page">
                <p className="dashboard-message" role="status">
                    Loading your clinic dashboard...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="dashboard-page">
                <section className="dashboard-error" role="alert">
                    <h1>Unable to load dashboard</h1>
                    <p>{error}</p>
                    <button
                        className="dashboard-retry"
                        onClick={() => window.location.reload()}
                    >
                        Try again
                    </button>
                </section>
            </main>
        );
    }

    if (!dashboard) {
        return (
            <main className="dashboard-page">
                <p className="dashboard-message">
                    No dashboard information is available.
                </p>
            </main>
        );
    }

    const {
        patients = {},
        doctors = {},
        appointments = {},
        billing = {},
        appointmentStats = {},
        billingStats = {},
        monthlyStats = {},
        doctorStats = [],
    } = dashboard;

    const statCards = [
        {
            label: "Total Patients",
            value: patients.total ?? 0,
            detail: "Registered patients",
            icon: "♙",
            tone: "blue",
        },
        {
            label: "Total Doctors",
            value: doctors.total ?? 0,
            detail: "Registered doctors",
            icon: "✚",
            tone: "green",
        },
        {
            label: "Today's Appointments",
            value: appointments.today ?? 0,
            detail: "Scheduled for today",
            icon: "▦",
            tone: "purple",
        },
        {
            label: "Total Appointments",
            value: appointments.total ?? 0,
            detail: "All appointment records",
            icon: "◷",
            tone: "orange",
        },
        {
            label: "Pending Bills",
            value: billing.pending ?? 0,
            detail: "Awaiting payment",
            icon: "₹",
            tone: "red",
        },
        {
            label: "Paid Revenue",
            value: formatCurrency(billing.totalRevenue),
            detail: "From paid bills",
            icon: "↗",
            tone: "teal",
        },
    ];

    return (
        <main className="dashboard-page">
            <header className="dashboard-header">
                <div>
                    <p className="dashboard-eyebrow">CLINIC OVERVIEW</p>
                    <h1>Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Welcome back, {user?.name || "User"}. Here's your
                        clinic's latest overview.
                    </p>
                </div>

                <div className="dashboard-date">
                    <span>Today</span>
                    <strong>
                        {new Date().toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </strong>
                </div>
            </header>

            <section
                className="dashboard-stats-grid"
                aria-label="Clinic statistics"
            >
                {statCards.map((stat) => (
                    <article
                        className="dashboard-stat-card"
                        key={stat.label}
                    >
                        <div className="dashboard-stat-top">
                            <span>{stat.label}</span>
                            <span
                                className={`dashboard-stat-icon ${stat.tone}`}
                                aria-hidden="true"
                            >
                                {stat.icon}
                            </span>
                        </div>

                        <strong className="dashboard-stat-value">
                            {stat.value}
                        </strong>

                        <p>{stat.detail}</p>
                    </article>
                ))}
            </section>

            <section className="dashboard-panels-grid">
                <article className="dashboard-panel">
                    <div className="dashboard-panel-header">
                        <div>
                            <h2>Today's Appointments</h2>
                            <p>Patients scheduled to visit today</p>
                        </div>
                        <span className="dashboard-count">
                            {appointments.today ?? 0}
                        </span>
                    </div>

                    {appointments.todayList?.length ? (
                        <div className="dashboard-list">
                            {appointments.todayList.map((appointment) => (
                                <div
                                    className="dashboard-appointment-row"
                                    key={appointment._id}
                                >
                                    <div className="dashboard-avatar">
                                        {(appointment.patient?.name || "P")
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div className="dashboard-appointment-info">
                                        <strong>
                                            {appointment.patient?.name ||
                                                "Unknown patient"}
                                        </strong>
                                        <span>
                                            Dr.{" "}
                                            {appointment.doctor?.name ||
                                                "Unassigned"}
                                        </span>
                                        <span>
                                            {formatDate(
                                                appointment.appointmentDate
                                            )}
                                        </span>
                                    </div>

                                    <span
                                        className={`dashboard-status status-${String(
                                            appointment.status || "scheduled"
                                        ).toLowerCase()}`}
                                    >
                                        {appointment.status || "Scheduled"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="dashboard-empty">
                            No appointments scheduled for today.
                        </p>
                    )}
                </article>

                <article className="dashboard-panel">
                    <div className="dashboard-panel-header">
                        <div>
                            <h2>Appointment Status</h2>
                            <p>Overview of appointment records</p>
                        </div>
                    </div>

                    <div className="dashboard-breakdown">
                        {[
                            {
                                label: "Scheduled",
                                value: appointmentStats.Scheduled ?? 0,
                                tone: "scheduled",
                            },
                            {
                                label: "Confirmed",
                                value: appointmentStats.Confirmed ?? 0,
                                tone: "confirmed",
                            },
                            {
                                label: "Completed",
                                value: appointmentStats.Completed ?? 0,
                                tone: "completed",
                            },
                            {
                                label: "Cancelled",
                                value: appointmentStats.Cancelled ?? 0,
                                tone: "cancelled",
                            },
                        ].map((item) => (
                            <div className="dashboard-breakdown-row" key={item.label}>
                                <div className="dashboard-breakdown-label">
                                    <span
                                        className={`dashboard-dot ${item.tone}`}
                                    />
                                    <span>{item.label}</span>
                                </div>
                                <strong>{item.value}</strong>
                            </div>
                        ))}
                    </div>

                    <div className="dashboard-panel-divider" />

                    <h3 className="dashboard-subheading">
                        Monthly Performance
                    </h3>

                    <div className="dashboard-monthly-grid">
                        <div>
                            <span>Appointments</span>
                            <strong>{monthlyStats.appointments ?? 0}</strong>
                        </div>
                        <div>
                            <span>Completed</span>
                            <strong>{monthlyStats.completed ?? 0}</strong>
                        </div>
                        <div>
                            <span>Monthly Revenue</span>
                            <strong>
                                {formatCurrency(monthlyStats.revenue)}
                            </strong>
                        </div>
                    </div>
                </article>
            </section>

            <section className="dashboard-panels-grid">
                <article className="dashboard-panel">
                    <div className="dashboard-panel-header">
                        <div>
                            <h2>Upcoming Appointments</h2>
                            <p>Next scheduled visits</p>
                        </div>
                    </div>

                    {appointments.upcoming?.length ? (
                        <div className="dashboard-list">
                            {appointments.upcoming.map((appointment) => (
                                <div
                                    className="dashboard-appointment-row"
                                    key={appointment._id}
                                >
                                    <div className="dashboard-avatar">
                                        {(appointment.patient?.name || "P")
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div className="dashboard-appointment-info">
                                        <strong>
                                            {appointment.patient?.name ||
                                                "Unknown patient"}
                                        </strong>
                                        <span>
                                            Dr.{" "}
                                            {appointment.doctor?.name ||
                                                "Unassigned"}
                                        </span>
                                        <span>
                                            {formatDate(
                                                appointment.appointmentDate
                                            )}
                                        </span>
                                    </div>

                                    <span
                                        className={`dashboard-status status-${String(
                                            appointment.status || "scheduled"
                                        ).toLowerCase()}`}
                                    >
                                        {appointment.status || "Scheduled"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="dashboard-empty">
                            No upcoming appointments found.
                        </p>
                    )}
                </article>

                <article className="dashboard-panel">
                    <div className="dashboard-panel-header">
                        <div>
                            <h2>Billing Overview</h2>
                            <p>Current payment status</p>
                        </div>
                    </div>

                    <div className="dashboard-billing-total">
                        <span>Total paid revenue</span>
                        <strong>
                            {formatCurrency(billing.totalRevenue)}
                        </strong>
                    </div>

                    <div className="dashboard-breakdown">
                        <div className="dashboard-breakdown-row">
                            <div className="dashboard-breakdown-label">
                                <span className="dashboard-dot completed" />
                                <span>Paid bills</span>
                            </div>
                            <strong>{billingStats.Paid ?? 0}</strong>
                        </div>

                        <div className="dashboard-breakdown-row">
                            <div className="dashboard-breakdown-label">
                                <span className="dashboard-dot scheduled" />
                                <span>Pending bills</span>
                            </div>
                            <strong>{billingStats.Pending ?? 0}</strong>
                        </div>

                        <div className="dashboard-breakdown-row">
                            <div className="dashboard-breakdown-label">
                                <span className="dashboard-dot cancelled" />
                                <span>Cancelled bills</span>
                            </div>
                            <strong>{billingStats.Cancelled ?? 0}</strong>
                        </div>
                    </div>
                </article>
            </section>

            <section className="dashboard-panel dashboard-doctors-panel">
                <div className="dashboard-panel-header">
                    <div>
                        <h2>Doctor Activity</h2>
                        <p>Appointment counts by doctor</p>
                    </div>
                </div>

                {doctorStats.length ? (
                    <div className="dashboard-doctors-grid">
                        {doctorStats.map((item) => (
                            <div
                                className="dashboard-doctor-card"
                                key={item.doctor?._id || item.doctor?.name}
                            >
                                <div className="dashboard-doctor-avatar">
                                    {(item.doctor?.name || "D")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                                <div>
                                    <strong>
                                        {item.doctor?.name || "Unknown doctor"}
                                    </strong>
                                    <span>
                                        {item.doctor?.specialization ||
                                            "General practice"}
                                    </span>
                                </div>
                                <div className="dashboard-doctor-count">
                                    <strong>{item.appointmentCount ?? 0}</strong>
                                    <span>appointments</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="dashboard-empty">
                        No doctor activity is available yet.
                    </p>
                )}
            </section>
        </main>
    );
}

export default DashboardPage;
