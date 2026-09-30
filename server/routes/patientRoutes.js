const express = require("express")

const {createPatient,getPatients,getPatient,updatePatient,deletePatient,getPatientHistory,} = require("../controllers/patientController");

const router  = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/",
    authMiddleware,
    roleMiddleware("Admin", "Receptionist")
    ,createPatient
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    getPatients
);

router.get(
  "/:id/history",
  authMiddleware,
  roleMiddleware("Admin", "Doctor", "Receptionist"),
  getPatientHistory
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Doctor", "Receptionist"),
    getPatient
);
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Receptionist"),
    updatePatient
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    deletePatient
);

module.exports = router;