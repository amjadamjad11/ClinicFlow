# Dashboard & Analytics

## Overview

ClinicFlow provides a centralized dashboard summary API for monitoring key clinic operations.

The dashboard combines information from:

- Patients
- Doctors
- Appointments
- Billing
- Monthly activity
- Doctor appointment statistics
- Upcoming appointments
- Recent appointments

The dashboard is designed to provide a single API response that can later be consumed by the frontend dashboard.

---

## Dashboard API

### Endpoint

```http
GET /api/dashboard/summary