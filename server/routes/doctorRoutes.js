const express = require('express');

const{createDoctor,getDoctors,getDoctor,updateDoctor,deleteDoctor} = require('../controllers/doctorController');

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/",
    authMiddleware,
    roleMiddleware("Admin"),
    createDoctor
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("Admin","Doctor","Receptionist"),
    getDoctors
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin","Doctor","Receptionist"),
    getDoctor
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    updateDoctor
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    deleteDoctor
);

module.exports = router;