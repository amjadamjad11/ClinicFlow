const express = require("express");
// express → framework used to create HTTP API routes.

const {
  createConsultation,
  getConsultations,
  getConsultation,
  updateConsultation,
  deleteConsultation,
} = require("../controllers/consultationController");
// Imports the functions that handle Consultation API operations.

const authMiddleware = require("../middleware/authMiddleware");
// authMiddleware → verifies that the request contains a valid JWT.

const roleMiddleware = require("../middleware/roleMiddleware");
// roleMiddleware → checks whether the logged-in user's role is allowed.

const router = express.Router();
// Creates a separate group of Consultation routes.

router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Doctor"),
  createConsultation
);
// POST /api/consultations → Admin and Doctor can create consultations.

router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Doctor", "Receptionist"),
  getConsultations
);
// GET /api/consultations → All authenticated roles can view consultations.

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Doctor", "Receptionist"),
  getConsultation
);
// GET /api/consultations/:id → All authenticated roles can view one consultation.

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Doctor"),
  updateConsultation
);
// PUT /api/consultations/:id → Admin and Doctor can update consultations.

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteConsultation
);
// DELETE /api/consultations/:id → Only Admin can delete consultations.

module.exports = router;
// Exports the router so server.js can use these routes.