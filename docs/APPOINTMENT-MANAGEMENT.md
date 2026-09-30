\# ClinicFlow Appointment Management



\## Overview



ClinicFlow provides an appointment management module for scheduling and tracking appointments between patients and doctors.



The appointment system connects:



\- Patients

\- Doctors

\- Appointment schedules

\- Consultations

\- Prescriptions

\- Billing

\- Patient history



The module also includes validation, appointment status management, double-booking prevention, search, filtering, sorting, pagination, authentication, and role-based access control.



\---



\# Appointment Model



Each appointment contains references to the patient and doctor involved.



\### Appointment Fields



| Field | Description |

|---|---|

| `patient` | Reference to the Patient document |

| `doctor` | Reference to the Doctor document |

| `appointmentDate` | Date and time of the appointment |

| `status` | Current appointment status |

| `reason` | Reason for the appointment |

| `createdAt` | Record creation timestamp |

| `updatedAt` | Last modification timestamp |



The appointment model uses MongoDB references to connect appointments with patient and doctor records.



\---



\# Appointment Status



ClinicFlow supports the following appointment statuses:



| Status | Meaning |

|---|---|

| `Scheduled` | Appointment has been created and scheduled |

| `Confirmed` | Appointment has been confirmed |

| `Completed` | Appointment has been completed |

| `Cancelled` | Appointment has been cancelled |



The default status for a newly created appointment is:



```text

Scheduled

