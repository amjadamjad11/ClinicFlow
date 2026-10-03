const express = require("express");
// express → framework used to create HTTP API routes.

const {
    createPrescription,
    getPrescriptions,
    getPrescription,
    updatePrescription,
    deletePrescription,
} = require("../controllers/prescriptionController");
// Prescription controllers → contain Prescription business logic.

const authMiddleware = require("../middleware/authMiddleware");
// authMiddleware → verifies the JWT.

const roleMiddleware = require("../middleware/roleMiddleware");
// roleMiddleware → checks the user's role.

const asyncHandler = require("../middleware/asyncHandler");
// asyncHandler → forwards rejected async errors to errorMiddleware.

const router = express.Router();
// Router → groups Prescription API endpoints.


// CREATE
router.post(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Doctor"),
    asyncHandler(createPrescription)
);


// GET ALL
router.get(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    asyncHandler(getPrescriptions)
);


// GET ONE
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    asyncHandler(getPrescription)
);


// UPDATE
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Doctor"),
    asyncHandler(updatePrescription)
);


// DELETE
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    asyncHandler(deletePrescription)
);


module.exports = router;