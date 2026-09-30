const express = require("express");

const{
    getDashboardSummary,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/summary",
  authMiddleware,
  roleMiddleware("Admin", "Doctor", "Receptionist"),
  getDashboardSummary
);

module.exports = router;