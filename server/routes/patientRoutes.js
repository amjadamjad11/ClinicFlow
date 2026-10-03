const express = require("express");
// express → creates the router used to define Patient API endpoints.

const {
    createPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient,
    getPatientHistory,
} = require("../controllers/patientController");
// Patient controllers → contain the actual business logic for Patient APIs.

const router = express.Router();
// Router → groups all Patient-related API routes in one module.

const authMiddleware = require("../middleware/authMiddleware");
// authMiddleware → verifies that the user has a valid JWT token.

const roleMiddleware = require("../middleware/roleMiddleware");
// roleMiddleware → checks whether the logged-in user's role is allowed.

const asyncHandler = require("../middleware/asyncHandler");
// asyncHandler → forwards rejected async controller errors
// to the centralized error middleware.

router.post(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Receptionist"),
    asyncHandler(createPatient)
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    asyncHandler(getPatients)
);

router.get(
    "/:id/history",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    asyncHandler(getPatientHistory)
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    asyncHandler(getPatient)
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Receptionist"),
    asyncHandler(updatePatient)
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    asyncHandler(deletePatient)
);

module.exports = router;
// Exports the Patient router so server.js can mount it at /api/patients.