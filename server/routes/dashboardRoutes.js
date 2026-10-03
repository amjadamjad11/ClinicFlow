const express = require("express");
// express → framework used to create HTTP API routes.

const {
    getDashboardSummary,
} = require("../controllers/dashboardController");
// Dashboard controller → generates the clinic statistics.

const authMiddleware = require("../middleware/authMiddleware");
// authMiddleware → verifies the JWT.

const roleMiddleware = require("../middleware/roleMiddleware");
// roleMiddleware → checks the user's role.

const asyncHandler = require("../middleware/asyncHandler");
// asyncHandler → forwards dashboard errors to errorMiddleware.

const router = express.Router();
// Router → groups Dashboard API routes.

router.get(
    "/summary",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    asyncHandler(getDashboardSummary)
);

module.exports = router;