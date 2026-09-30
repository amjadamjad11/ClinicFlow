const express = require("express");
// express → framework used to create HTTP API routes.

const {
  createBilling,
  getBillings,
  getBilling,
  updateBilling,
  deleteBilling,
} = require("../controllers/billingController");
// Imports Billing controller functions.

const authMiddleware = require("../middleware/authMiddleware");
// authMiddleware → verifies that the request contains a valid JWT.

const roleMiddleware = require("../middleware/roleMiddleware");
// roleMiddleware → checks whether the logged-in user's role is allowed.

const router = express.Router();
// Creates a separate group of Billing routes.


// CREATE BILLING
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Receptionist"),
  createBilling
);
// POST /api/billing → Admin and Receptionist can create billing records.


// GET ALL BILLING RECORDS
router.get(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Doctor", "Receptionist"),
  getBillings
);
// GET /api/billing → All authenticated roles can view billing records.


// GET ONE BILLING RECORD
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Doctor", "Receptionist"),
  getBilling
);
// GET /api/billing/:id → All authenticated roles can view one billing record.


// UPDATE BILLING
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Receptionist"),
  updateBilling
);
// PUT /api/billing/:id → Admin and Receptionist can update billing records.


// DELETE BILLING
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  deleteBilling
);
// DELETE /api/billing/:id → Only Admin can delete billing records.


module.exports = router;
// Exports the router so server.js can use the Billing routes.