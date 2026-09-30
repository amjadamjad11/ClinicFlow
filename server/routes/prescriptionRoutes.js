const express = require("express");
// express → framework used to create HTTP API routes.

const {
  createPrescription,
  getPrescriptions,
  getPrescription,
  updatePrescription,
  deletePrescription,
} = require("../controllers/prescriptionController");
// Imports the Prescription controller functions.

const authMiddleware = require("../middleware/authMiddleware");
// authMiddleware → verifies that the request contains a valid JWT.

const roleMiddleware = require("../middleware/roleMiddleware");
// roleMiddleware → checks whether the logged-in user's role is allowed.

const router = express.Router();
// Creates a separate group of Prescription routes.

// CREATE
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Doctor"),
  createPrescription
);
// POST /api/prescriptions → Admin and Doctor can create prescriptions.

// GET ALL
router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Doctor", "Receptionist"),
  getPrescriptions
);
// GET /api/prescriptions → All authenticated roles can view prescriptions.

// GET ONE
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Doctor", "Receptionist"),
  getPrescription
);
// GET /api/prescriptions/:id → All authenticated roles can view one prescription.

// UPDATE
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Doctor"),
  updatePrescription
);
// PUT /api/prescriptions/:id → Admin and Doctor can update prescriptions.

// DELETE
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deletePrescription
);
// DELETE /api/prescriptions/:id → Only Admin can delete prescriptions.

module.exports = router;
// Exports the router so server.js can use these routes.