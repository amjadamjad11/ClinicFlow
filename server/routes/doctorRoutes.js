const express = require("express");
// express → framework used to create HTTP API routes.

const {
    createDoctor,
    getDoctors,
    getDoctor,
    getDoctorSchedule,
    updateDoctor,
    deleteDoctor,
} = require("../controllers/doctorController");
// Doctor controllers → contain Doctor business logic.

const authMiddleware = require("../middleware/authMiddleware");
// authMiddleware → verifies the JWT.

const roleMiddleware = require("../middleware/roleMiddleware");
// roleMiddleware → checks the user's role.

const asyncHandler = require("../middleware/asyncHandler");
// asyncHandler → forwards rejected async errors to errorMiddleware.

const router = express.Router();
// Router → groups all Doctor API routes.


// CREATE DOCTOR
router.post(
    "/",
    authMiddleware,
    roleMiddleware("Admin"),
    asyncHandler(createDoctor)
);


// GET ALL DOCTORS
router.get(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    asyncHandler(getDoctors)
);


// GET DOCTOR SCHEDULE
router.get(
    "/:id/schedule",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    asyncHandler(getDoctorSchedule)
);


// GET ONE DOCTOR
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    asyncHandler(getDoctor)
);


// UPDATE DOCTOR
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    asyncHandler(updateDoctor)
);


// DELETE DOCTOR
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    asyncHandler(deleteDoctor)
);


module.exports = router;