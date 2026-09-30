\# ClinicFlow Patient \& Doctor Management



\## Overview



ClinicFlow provides separate modules for managing \*\*patients\*\* and \*\*doctors\*\*.



Both modules use:



\- Express.js routes

\- Controller-based business logic

\- Mongoose models

\- MongoDB Atlas

\- JWT authentication

\- Role-Based Access Control (RBAC)



The modules form the foundation for the appointment, consultation, prescription, billing, and patient-history workflows.



\---



\# Patient Management



\## Patient Model



The Patient model stores the core information required to manage a patient's clinic record.



\### Patient Fields



| Field | Description |

|---|---|

| `name` | Patient's full name |

| `dateOfBirth` | Patient's date of birth |

| `gender` | `Male`, `Female`, or `Other` |

| `phone` | Patient's 10-digit phone number |

| `email` | Patient email address |

| `address` | Patient address |

| `medicalHistory` | Patient medical history |

| `createdAt` | Record creation timestamp |

| `updatedAt` | Last modification timestamp |



MongoDB timestamps are enabled for patient records.



\---



\## Patient API



The patient routes are available under:



```http

/api/patients

