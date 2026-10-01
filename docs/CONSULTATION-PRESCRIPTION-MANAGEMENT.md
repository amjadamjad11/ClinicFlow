# Consultation & Prescription Management

## Overview

ClinicFlow v0.5.0 introduces Consultation and Prescription Management.

The module extends the appointment workflow into clinical documentation:

Appointment → Consultation → Prescription

A consultation records the clinical assessment associated with an appointment. A prescription records the medicines provided as part of that consultation.

---

## 1. Consultation Management

### Purpose

A Consultation represents the clinical information recorded after a patient's appointment.

Each consultation is associated with exactly one appointment.

### Consultation Data Model

| Field | Type | Required | Description |
|---|---|---:|---|
| appointment | ObjectId | Yes | Reference to the related Appointment |
| symptoms | String | Yes | Symptoms reported or observed |
| diagnosis | String | Yes | Doctor's diagnosis |
| treatment | String | No | Treatment information |
| notes | String | No | Additional consultation notes |
| createdAt | Date | Automatic | Creation timestamp |
| updatedAt | Date | Automatic | Last update timestamp |

### Relationship

```text
Appointment
    │
    └── Consultation
            │
            ├── Symptoms
            ├── Diagnosis
            ├── Treatment
            └── Notes