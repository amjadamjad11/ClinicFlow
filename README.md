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


## v1.4.0 — Frontend Patient Management

### Patient Management Features

The frontend now provides the initial patient-management workflow.

#### Patient List

- Displays patients retrieved from the ClinicFlow backend.
- Shows patient name, date of birth, gender, phone number, and email.
- Provides navigation to create a new patient.
- Provides navigation to individual patient records.

#### Create Patient

- Provides a React form for registering new patients.
- Sends patient information to the backend Patient API.
- Displays success and error messages.
- Clears the form after successful creation.
- Newly created patients appear in the patient list.

#### Patient Details

- Uses the patient's MongoDB `_id` through a dynamic React Router route.
- Retrieves the selected patient's information from the backend.
- Displays personal and medical information.
- Provides navigation back to the patient list.

### Frontend Patient Flow

```text
Patient List
    ↓
Create Patient
    ↓
POST /api/patients
    ↓
MongoDB
    ↓
Patient List

#### Edit Patient

- Provides an edit form for existing patient records.
- Loads the patient's current information before editing.
- Allows authorized users to update patient information.
- Sends changes to the backend using the Patient update API.
- Redirects to the updated patient details after a successful save.
- Changes are persisted in MongoDB.

#### Delete Patient

- Provides an Admin-only patient deletion control.
- Requires confirmation before permanently deleting a patient.
- Sends the deletion request to the backend Patient API.
- Handles the backend `204 No Content` response correctly.
- Redirects to the patient list after successful deletion.
- Deleted patients no longer appear in the patient list.
- Frontend role checks improve the user experience, while backend RBAC provides the actual authorization.

### Complete Patient CRUD Workflow

ClinicFlow now supports the complete initial frontend CRUD workflow:

```text
Create
  ↓
POST /api/patients
  ↓
MongoDB

Read
  ↓
GET /api/patients
GET /api/patients/:id

Update
  ↓
PUT /api/patients/:id
  ↓
MongoDB

Delete
  ↓
DELETE /api/patients/:id
  ↓
MongoDB


### Reusable Button Component

- Created `client/src/components/Button.jsx`.
- Added `primary`, `secondary`, and `danger` button variants.
- Added matching CSS styles in `client/src/styles/global.css`.
- Supports configurable button type, disabled state, click handler, and child content.
- Integrated the reusable primary button into `CreatePatientPage.jsx`.
- Verified frontend lint and production build successfully.



## v1.5.0 — Frontend UI Foundation

### Global Styling

- Added `client/src/styles/global.css` as the shared stylesheet.
- Established consistent typography, spacing, links, buttons, forms, tables, and page layout.
- Added responsive styling for smaller screens.
- Fixed form input text visibility by explicitly setting readable text and background colors.
- Added visible focus states and disabled-field styling.

### Reusable UI Components

Created reusable React components in `client/src/components/`:

- `Button.jsx` — configurable button with primary, secondary, and danger variants.
- `Input.jsx` — reusable labelled input supporting input types, required fields, patterns, and autocomplete.
- `Select.jsx` — reusable labelled dropdown with configurable options.
- `Textarea.jsx` — reusable labelled multiline text field.

### Patient Form Integration

- Refactored `CreatePatientPage.jsx` to use the reusable Button, Input, Select, and Textarea components.
- Preserved the existing React form state and change-handling logic.
- Preserved required-field and 10-digit phone validation.
- Preserved the existing backend patient-creation API integration.
- Added consistent styling across all seven patient fields.
- Verified successful patient creation and confirmed that the new patient appears in the Patients list.

### Verification

- `npm run lint` — passed with zero warnings and zero errors.
- `npm run build` — production build completed successfully.
- Browser test — patient creation and patient-list visibility verified.



### Doctor API Integration

- Added frontend API functions for listing and retrieving doctors.
- Added functions for creating, updating, and deleting doctor records.
- Added a function for retrieving a doctor's appointment schedule.
- Reused the shared API request service for JWT authentication and response handling.
- Existing backend role-based access control remains responsible for authorization.


### Doctor List UI

- Added a Doctors page that retrieves records through the shared API service.
- Displayed doctor name, specialization, phone, email, and experience.
- Added loading, error, and empty states.
- Registered the authenticated `/doctors` route.
- Added Doctors navigation to the application navbar.
- Doctor details navigation will be completed in a subsequent step.


### Doctor Registration UI

- Added a doctor registration form using reusable Input and Button components.
- Added fields for name, specialization, phone, email, license number, and experience.
- Added phone-number pattern validation and numeric conversion for experience.
- Added loading and API error states during submission.
- Redirects to the Doctors directory after successful registration.
- Added the protected `/doctors/create` route and a registration link.
- Doctor creation remains restricted to Admin users by backend role-based access control.


### Doctor Details UI

- Added a doctor details page using the existing `getDoctor()` API function.
- Displayed professional details, including specialization, contact information, license number, and experience.
- Added loading and error states.
- Registered the protected `/doctors/:id` route.
- Displayed the Edit Doctor option only to Admin users.
- Added navigation to the planned doctor schedule page.


### Doctor Editing UI

- Added an Edit Doctor page to update existing doctor records.
- Loads the current doctor's information through the `getDoctor()` API function.
- Uses controlled form inputs to keep displayed values synchronized with React state.
- Saves changes through the `updateDoctor()` API function.
- Validates the 10-digit phone number and non-negative numeric experience before submitting.
- Converts experience to a number before sending the update to the backend.
- Displays loading and API error states and returns to the doctor's details page after a successful update.
- Backend Admin-only authorization remains responsible for enforcing update permissions.


### Doctor Deletion UI

- Added an Admin-only Delete Doctor action to the doctor details page.
- Displays a browser confirmation prompt before deletion.
- Disables the delete button and displays a progress label while the request runs.
- Uses the `deleteDoctor()` API function to call the backend.
- Navigates back to the doctors list after successful deletion.
- Displays an error if the delete request fails.
- Backend authorization remains responsible for enforcing Admin-only deletion.
- Note: associated appointment records are not automatically deleted by this UI.


### Doctor Details UI

- Added a doctor details page using the `getDoctor()` API function.
- Displays professional details, including specialization, contact information, license number, and experience.
- Includes loading and error states.
- Registered the protected `/doctors/:id` route.
- Displays Edit Doctor and Delete Doctor actions only to Admin users.
- Provides navigation to the doctor's appointment schedule and the Doctors directory.
- Requires backend authorization to enforce permissions.

### Doctor Appointment Schedule UI

- Added a page to display a doctor's appointment schedule through `getDoctorSchedule()`.
- Displays appointment dates, patient information, reason, and status.
- Includes loading, error, and empty states.
- Registered the `/doctors/:id/schedule` route.
- Uses the backend to retrieve appointments associated with the selected doctor.

### Doctor Editing UI

- Added an Edit Doctor page to update existing doctor records.
- Loads existing information through `getDoctor()`.
- Uses controlled form inputs to keep displayed values synchronized with React state.
- Saves changes through `updateDoctor()`.
- Validates the 10-digit phone number and non-negative experience value.
- Converts experience to a number before submitting the update.
- Displays loading and API error states.
- Returns to the doctor's details page after a successful update.
- Relies on backend Admin-only authorization to enforce update permissions.

### Doctor Deletion UI

- Added an Admin-only Delete Doctor action to the doctor details page.
- Requests confirmation before deleting a doctor.
- Disables the delete button and displays progress while the request runs.
- Uses `deleteDoctor()` to send the deletion request.
- Redirects to the Doctors directory after successful deletion.
- Displays an error if the request fails.
- Relies on backend authorization to enforce Admin-only deletion.
- Associated appointments are not automatically deleted by this UI.


## v1.7.0 — Appointment Management UI

### Appointment API Integration

- Added `getAppointments()` to retrieve all appointments.
- Added `getAppointment()` to retrieve an individual appointment.
- Added `createAppointment()` to submit a new appointment.
- Added `updateAppointment()` to update an existing appointment.
- Added `deleteAppointment()` to delete an appointment.
- Reused the shared `apiRequest()` service for authentication and response handling.
- Appointment authorization remains enforced by the backend role-based access control middleware.

### Verification

- Frontend lint and production build checked after the API integration.


## v1.7.0 — Appointment Management UI

### Appointment API Integration

- Added `getAppointments()` to retrieve all appointments.
- Added `getAppointment()` to retrieve an individual appointment.
- Added `createAppointment()` to create an appointment.
- Added `updateAppointment()` to update an appointment.
- Added `deleteAppointment()` to delete an appointment.
- Reused the shared `apiRequest()` service for authentication and response handling.
- Kept appointment permissions enforced by backend role-based access control.

### Verification

- `npm run lint` — passed with zero warnings and zero errors.
- `npm run build` — production build completed successfully.


## v1.7.0 — Appointment Management UI

### Appointment API Integration
- Added API functions to retrieve all appointments and individual appointments.
- Added API functions to create, update, and delete appointments.
- Reused the shared `apiRequest()` service for authentication and response handling.
- Kept appointment permissions enforced by backend role-based access control.

### Appointment Directory
- Created the appointment listing page.
- Displayed appointment date and time, patient, doctor, reason, and status.
- Added loading, error, and empty-state messages.
- Added navigation to the appointment directory for authenticated users.
- Added a booking link for Admin and Receptionist roles.

### Verification
- `npm run lint` — passed with zero warnings and zero errors.
- `npm run build` — production build completed successfully.

## v1.7.0 — Appointment Management UI

### Appointment API Integration
- Added `getAppointments()` to retrieve all appointments.
- Added `getAppointment()` to retrieve an individual appointment.
- Added `createAppointment()` to create appointments.
- Added `updateAppointment()` to update appointments.
- Added `deleteAppointment()` to delete appointments.
- Reused the shared `apiRequest()` service for authentication and response handling.

### Appointment Directory
- Created the appointment listing page.
- Displayed appointment date and time, patient, doctor, reason, and status.
- Added loading, error, and empty-state messages.
- Added navigation to the appointment directory.
- Added a booking link for Admin and Receptionist users.

### Appointment Booking
- Created an appointment booking form.
- Added patient and doctor dropdowns populated from the backend.
- Integrated a popup calendar and time selector using `react-datepicker`.
- Added validation for future appointment dates and required fields.
- Connected the booking form to the existing appointment API.
- Redirected users to the appointment directory after successful booking.

### Verification
- Appointment creation tested successfully.
- Confirmed that the newly created appointment appears in the appointment directory.
- `npm run lint` — passed with zero warnings and zero errors.
- `npm run build` — production build completed successfully.

## v1.7.0 — Appointment Management UI

### Appointment API Integration
- Added `getAppointments()` to retrieve appointment records.
- Added `getAppointment()` to retrieve an individual appointment.
- Added `createAppointment()` to create appointments.
- Added `updateAppointment()` to update existing appointments.
- Added `deleteAppointment()` to delete appointments.
- Reused the shared API request service for authentication and response handling.

### Appointment Directory
- Created an appointment listing page.
- Displayed appointment date and time, patient, doctor, reason, and status.
- Added loading, error, and empty states.
- Added navigation to appointment details.
- Provided appointment booking access for Admin and Receptionist users.

### Appointment Booking
- Created an appointment booking form.
- Populated patient and doctor dropdowns from backend data.
- Integrated a popup calendar and time selector using `react-datepicker`.
- Added required-field validation and future-date/time restrictions.
- Connected the booking form to the appointment API.
- Redirected users after successful booking.

### Appointment Details
- Created an appointment details page.
- Displayed appointment information and associated patient and doctor details.
- Added an Edit Appointment link for authorized users.
- Added a confirmation prompt before permanent deletion.
- Redirected users to the appointment directory after successful deletion.

### Edit Appointment
- Created a dedicated appointment editing page.
- Loaded the existing appointment and available patient and doctor records.
- Allowed authorized users to update the patient, doctor, date, time, reason, and status.
- Added loading, saving, and error states.
- Redirected users to appointment details after successful updates.

### Verification
- Appointment creation tested successfully.
- Confirmed that newly created appointments appear in the directory.
- Appointment editing tested successfully.
- Appointment deletion tested successfully, including removal from the directory.
- `npm run lint` — passed with zero warnings and zero errors.
- `npm run build` — production build completed successfully.


### Consultation and Prescription API Integration

- Added reusable frontend API functions for consultation CRUD operations.
- Added reusable frontend API functions for prescription CRUD operations.
- Reused the shared `apiRequest()` function for authentication headers, JSON requests, and API error handling.
- Connected the API service to the existing `/api/consultations` and `/api/prescriptions` backend endpoints.

**Verification:** `npm run build` completed successfully.



## Consultation Management UI

Implemented the initial consultation management interface in the ClinicFlow frontend.

### Features
- View consultation records, including appointment date, patient, doctor, symptoms, and diagnosis.
- Open a form to create a consultation for an existing appointment.
- Record symptoms, diagnosis, treatment, and additional notes.
- Exclude appointments that already have a consultation from the selection list.
- Display loading and error messages when retrieving or saving data.
- Restrict consultation creation links to Admin and Doctor roles in the UI.
- Register protected consultation routes and add consultation navigation.

### Frontend Files
- `client/src/pages/ConsultationsPage.jsx`
- `client/src/pages/CreateConsultationPage.jsx`
- `client/src/App.jsx`
- `client/src/components/Navbar.jsx`

### Verification
- `npm run build` completed successfully.
- Vite transformed 370 modules without build errors.

### Pending Testing
- Verify consultation retrieval against the running backend.
- Verify consultation creation with a test appointment.
- Verify duplicate consultation prevention and role permissions.

## Consultation Management UI

Implemented and tested the consultation management interface in the ClinicFlow frontend.

### Features
- View consultation records with appointment date, patient, doctor, symptoms, and diagnosis.
- Create a consultation for an existing appointment.
- Record symptoms, diagnosis, treatment, and additional notes.
- Exclude appointments that already have a consultation from the appointment selection list.
- Display loading and error messages while retrieving or saving data.
- Restrict consultation creation options in the UI to Admin and Doctor roles.
- Add protected consultation routes and consultation navigation.

### Frontend Files
- `client/src/pages/ConsultationsPage.jsx`
- `client/src/pages/CreateConsultationPage.jsx`
- `client/src/App.jsx`
- `client/src/components/Navbar.jsx`
- `client/src/services/api.js`

### Verification
- `npm run build` completed successfully.
- The Consultations page loaded successfully in the browser.
- A test consultation was created successfully.
- The saved consultation appeared in the consultation list.

### Remaining Tests
- Verify that duplicate consultations are prevented.
- Verify role-based access for consultation actions.
- Implement and test the prescription management UI.

## Prescription Management UI

Implemented the prescription management interface in the ClinicFlow frontend.

### Features
- View prescriptions with patient, doctor, diagnosis, medicines, and notes.
- Create a prescription linked to an existing consultation.
- Add multiple medicines to one prescription.
- Record medicine name, dosage, frequency, duration, and optional instructions.
- Add optional prescription notes.
- Exclude consultations that already have a prescription from the selection list.
- Display loading, validation, and API error messages.
- Register protected prescription routes and add prescription navigation.

### Frontend Files
- `client/src/pages/PrescriptionsPage.jsx`
- `client/src/pages/CreatePrescriptionPage.jsx`
- `client/src/App.jsx`
- `client/src/components/Navbar.jsx`
- `client/src/services/api.js`

### Verification
- Record the result of `npm run build`.
- Record the result of prescription listing and creation tests.
- Verify multiple medicines can be saved in one prescription.
- Verify a consultation with an existing prescription cannot be selected again.


## Consultation and Prescription Management UI

Implemented and tested the initial consultation and prescription interfaces.

### Consultation Management
- View consultation records with appointment, patient, doctor, symptoms, and diagnosis.
- Create consultations using existing appointments.
- Prevent selection of appointments that already have consultations.
- Display loading and error messages.

### Prescription Management
- Select a consultation that does not already have a prescription.
- Add multiple medicines to a prescription.
- Record medicine name, dosage, frequency, duration, and optional instructions.
- Add optional prescription notes.
- Validate required fields before submission.
- Save prescriptions through the backend API.
- Display saved prescriptions in the prescription list.

### Technical Fix
- Corrected consultation selection so the frontend sends the consultation ID rather than a React event object.
- Verified that prescription creation succeeds and the saved record appears in the list.
- Confirmed that `npm run build` completes successfully.

### Files
- `client/src/pages/ConsultationsPage.jsx`
- `client/src/pages/CreateConsultationPage.jsx`
- `client/src/pages/PrescriptionsPage.jsx`
- `client/src/pages/CreatePrescriptionPage.jsx`
- `client/src/services/api.js`
- `client/src/App.jsx`
- `client/src/components/Navbar.jsx`
