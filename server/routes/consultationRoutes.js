const express = require("express");
// express → framework used to create HTTP API routes.

const {
    createConsultation,
    getConsultations,
    getConsultation,
    updateConsultation,
    deleteConsultation,
} = require("../controllers/consultationController");
// Consultation controllers → contain the business logic for Consultation APIs.

const authMiddleware = require("../middleware/authMiddleware");
// authMiddleware → verifies that the request contains a valid JWT.

const roleMiddleware = require("../middleware/roleMiddleware");
// roleMiddleware → checks whether the logged-in user's role is allowed.

const asyncHandler = require("../middleware/asyncHandler");
// asyncHandler → forwards rejected async controller errors
// to the centralized error middleware.

const router = express.Router();
// Router → groups all Consultation-related API routes.


// CREATE CONSULTATION
router.post(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Doctor"),
    asyncHandler(createConsultation)
);


// GET ALL CONSULTATIONS
router.get(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    asyncHandler(getConsultations)
);


// GET ONE CONSULTATION
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    asyncHandler(getConsultation)
);


// UPDATE CONSULTATION
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Doctor"),
    asyncHandler(updateConsultation)
);


// DELETE CONSULTATION
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    asyncHandler(deleteConsultation)
);


module.exports = router;
// Exports the Consultation router so server.js can mount it.