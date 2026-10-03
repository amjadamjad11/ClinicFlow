const express = require("express");
// express → framework used to create HTTP API routes.

const {
    createBilling,
    getBillings,
    getBilling,
    updateBilling,
    deleteBilling,
} = require("../controllers/billingController");
// Billing controllers → contain Billing business logic.

const authMiddleware = require("../middleware/authMiddleware");
// authMiddleware → verifies the JWT.

const roleMiddleware = require("../middleware/roleMiddleware");
// roleMiddleware → checks the user's role.

const asyncHandler = require("../middleware/asyncHandler");
// asyncHandler → forwards rejected async errors to errorMiddleware.

const router = express.Router();
// Router → groups Billing API endpoints.


// CREATE BILLING
router.post(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Receptionist"),
    asyncHandler(createBilling)
);


// GET ALL BILLING
router.get(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    asyncHandler(getBillings)
);


// GET ONE BILLING
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    asyncHandler(getBilling)
);


// UPDATE BILLING
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Receptionist"),
    asyncHandler(updateBilling)
);


// DELETE BILLING
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    asyncHandler(deleteBilling)
);


module.exports = router;