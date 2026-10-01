\# Billing Management



\## Overview



ClinicFlow Billing Management handles billing records associated with completed clinical consultations.



The billing workflow connects:



Appointment → Consultation → Billing



Each consultation can have only one billing record.



\---



\## Billing Data Model



A billing record contains:



\- `consultation` — Reference to the related consultation.

\- `consultationFee` — Doctor consultation fee.

\- `medicineCharges` — Charges for prescribed medicines.

\- `otherCharges` — Additional charges.

\- `totalAmount` — Server-calculated total amount.

\- `paymentStatus` — Pending, Paid, or Cancelled.

\- `paymentMethod` — Cash, Card, UPI, or Insurance.

\- `notes` — Optional billing notes.

\- `createdAt` / `updatedAt` — Automatically managed timestamps.



\### Total Amount Calculation



The server calculates:



```text

totalAmount =

consultationFee +

medicineCharges +

otherCharges

