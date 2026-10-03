const express = require("express");
// express → creates the router used to define Appointment API endpoints.

const {
    createAppointment,
    getAppointments,
    getAppointment,
    updateAppointment,
    deleteAppointment,
} = require("../controllers/appointmentController");
// Appointment controllers → contain the business logic for Appointment APIs.

const router = express.Router();
// Router → groups all Appointment-related API routes.

const authMiddleware = require("../middleware/authMiddleware");
// authMiddleware → verifies that the user has a valid JWT token.

const roleMiddleware = require("../middleware/roleMiddleware");
// roleMiddleware → checks whether the logged-in user's role is allowed.

const asyncHandler = require("../middleware/asyncHandler");
// asyncHandler → forwards rejected async controller errors
// to the centralized error middleware.


// CREATE APPOINTMENT
router.post(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Receptionist"),
    asyncHandler(createAppointment)
);


// GET ALL APPOINTMENTS
router.get(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    asyncHandler(getAppointments)
);


// GET ONE APPOINTMENT
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    asyncHandler(getAppointment)
);


// UPDATE APPOINTMENT
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Receptionist"),
    asyncHandler(updateAppointment)
);


// DELETE APPOINTMENT
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Receptionist"),
    asyncHandler(deleteAppointment)
);


module.exports = router;
// Exports the Appointment router so server.js can mount it at /api/appointments.