
const express = require("express");

const {
    registerUser,
    loginUser,
    getCurrentUser,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
// authMiddleware verifies the JWT before the profile is returned.

const asyncHandler = require("../middleware/asyncHandler");
// asyncHandler forwards errors from async controllers to error middleware.

const router = express.Router();

// Public routes: users can register or log in without an existing token.
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route: only a user with a valid JWT can view their profile.
router.get("/me", authMiddleware, asyncHandler(getCurrentUser));

module.exports = router;
