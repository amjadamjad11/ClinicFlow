const express = require("express")

const{
    createAppointment,getAppointments,getAppointment,updateAppointment,deleteAppointment,
} = require("../controllers/appointmentController");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Receptionist"),
    createAppointment
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    getAppointments
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    getAppointment
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Receptionist"),
    updateAppointment
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    deleteAppointment
);

module.exports = router;