# ClinicFlow

> A full-stack clinic management and appointment platform built with the MERN stack.

ClinicFlow is a modular healthcare management application designed to manage core clinic workflows such as patient management, doctor management, appointments, consultations, prescriptions, billing, authentication, role-based access control, and analytics.

The project is being developed with a focus on clean architecture, secure API design, maintainability, and real-world software engineering practices.

---

## Features

### Authentication & Authorization

- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Role-based access control
- Admin, Doctor, and Receptionist roles
- Protected API routes

### Patient Management

- Create patients
- View patients
- View individual patient details
- Update patient information
- Delete patients
- Patient medical history

### Doctor Management

- Create doctors
- View doctors
- View individual doctor details
- Update doctor information
- Delete doctors
- Doctor specialization and experience management

### Appointment Management

- Create appointments
- View appointments
- View individual appointments
- Update appointments
- Delete appointments
- Appointment status management
- Doctor conflict detection
- Search appointments
- Filter appointments
- Sort appointments
- Pagination
- Date-range filtering

### Consultation Management

- Create consultations
- View consultations
- Update consultations
- Delete consultations
- Consultation linked to appointments
- Symptoms and diagnosis tracking
- Treatment and notes

### Prescription Management

- Create prescriptions
- Multiple medicines per prescription
- Dosage and frequency tracking
- Duration and instructions
- Prescription linked to consultations

### Billing

- Consultation fees
- Medicine charges
- Additional charges
- Automatic total calculation
- Payment status
- Payment method
- Billing linked to consultations

### Dashboard & Analytics

- Patient statistics
- Doctor statistics
- Appointment statistics
- Billing statistics
- Today's appointments
- Upcoming appointments
- Recent appointments
- Monthly statistics
- Doctor-wise appointment statistics

---

# Technology Stack

## Backend

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| MongoDB Atlas | Database |
| Mongoose | MongoDB object modeling |
| JWT | Authentication |
| bcrypt | Password hashing |
| dotenv | Environment configuration |

## Frontend

The React frontend will be developed as a later phase.

Planned technologies:

- React
- React Router
- Axios
- Context API / state management
- CSS / component-based UI

---

# Architecture

ClinicFlow follows a modular full-stack architecture.

```text
                         ClinicFlow
                             |
              +--------------+--------------+
              |                             |
              v                             v
        React Client                   Express API
                                             |
                                    +--------+--------+
                                    |                 |
                                    v                 v
                               Middleware        API Routes
                                    |                 |
                                    |                 v
                                    |            Controllers
                                    |                 |
                                    +--------+--------+
                                             |
                                             v
                                         Mongoose
                                             |
                                             v
                                       MongoDB Atlas



## Frontend Development

### v1.1.0 — Frontend Foundation

The ClinicFlow frontend has been initialized using React and Vite.

#### Frontend Stack

- React 19
- Vite 8
- JavaScript (ES Modules)
- Oxlint for linting

#### Frontend Development Server

The React frontend runs independently from the backend:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:5000



### v1.3.0 — Frontend Authentication

ClinicFlow frontend authentication has been connected to the existing backend authentication API.

#### Authentication Architecture

The frontend now uses React Context to maintain authentication state across the application.

```text
LoginPage
    ↓
Authentication API
    ↓
JWT + User Information
    ↓
AuthContext
    ↓
Application Components

### v1.3.0 — Frontend Authentication

ClinicFlow frontend authentication has been connected to the existing backend authentication API.

#### Authentication Architecture

The frontend uses React Context to maintain authentication state across the application.

```text
LoginPage
    ↓
Authentication API
    ↓
JWT + User Information
    ↓
AuthContext
    ↓
ProtectedRoute / Application Components