# Patient History & Doctor Schedule

## Overview

ClinicFlow v0.8.0 introduces two related features:

1. **Patient History** — provides a consolidated view of a patient's clinical and billing history.
2. **Doctor Schedule** — provides a chronological list of appointments assigned to a doctor.

These features build on the existing Patient, Doctor, Appointment, Consultation, Prescription, and Billing modules.

---

# 1. Patient History

## Endpoint

```text
GET /api/patients/:id/history