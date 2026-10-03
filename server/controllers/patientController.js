const Patient = require("../models/Patient");
// Patient → gives us access to the Patient MongoDB model.

const Appointment = require("../models/Appointment");
// Appointment → used to retrieve the patient's appointment history.

const Consultation = require("../models/Consultation");
// Consultation → used to retrieve consultations connected to appointments.

const Prescription = require("../models/Prescription");
// Prescription → used to retrieve prescriptions connected to consultations.

const Billing = require("../models/Billing");
// Billing → used to retrieve billing records connected to consultations.


// CREATE PATIENT
const createPatient = async (req, res) => {
    // asyncHandler catches unexpected errors and sends them
    // to the centralized error middleware.
    const patient = await Patient.create(req.body);

    res.status(201).json({
        status: "success",
        data: patient,
    });
};


// GET ALL PATIENTS
const getPatients = async (req, res) => {
    // Find all patients from MongoDB.
    const patients = await Patient.find();

    res.status(200).json({
        status: "success",
        data: patients,
    });
};


// GET ONE PATIENT
const getPatient = async (req, res) => {
    // Find a patient using the ID from the URL.
    const patient = await Patient.findById(req.params.id);

    // Return 404 when the requested patient doesn't exist.
    if (!patient) {
        return res.status(404).json({
            status: "error",
            message: "Patient not found",
        });
    }

    res.status(200).json({
        status: "success",
        data: patient,
    });
};


// UPDATE PATIENT
const updatePatient = async (req, res) => {
    // Find the patient and update it.
    // runValidators → makes Mongoose apply schema validation
    // to the updated values.
    const patient = await Patient.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    // Return 404 when the requested patient doesn't exist.
    if (!patient) {
        return res.status(404).json({
            status: "error",
            message: "Patient not found",
        });
    }

    res.status(200).json({
        status: "success",
        data: patient,
    });
};


// DELETE PATIENT
const deletePatient = async (req, res) => {
    // Find and remove the patient from MongoDB.
    const patient = await Patient.findByIdAndDelete(req.params.id);

    // Return 404 when the requested patient doesn't exist.
    if (!patient) {
        return res.status(404).json({
            status: "error",
            message: "Patient not found",
        });
    }

    res.status(204).json({
        status: "success",
        message: "Patient deleted successfully",
        data: patient,
    });
};


// GET PATIENT HISTORY
const getPatientHistory = async (req, res) => {
    // req.params.id → gets the patient ID from
    // /api/patients/:id/history.
    const patientId = req.params.id;

    // Find the patient first so we don't return history
    // for a nonexistent patient.
    const patient = await Patient.findById(patientId);

    if (!patient) {
        return res.status(404).json({
            status: "error",
            message: "Patient not found",
        });
    }

    // Find all appointments belonging to this patient.
    const appointments = await Appointment.find({
        patient: patientId,
    })
        .populate("doctor", "name specialization")
        .sort({ appointmentDate: -1 });

    // Get appointment IDs so consultations can be connected through them.
    const appointmentIds = appointments.map(
        (appointment) => appointment._id
    );

    // Find consultations belonging to the patient's appointments.
    const consultations = await Consultation.find({
        appointment: { $in: appointmentIds },
    })
        .populate({
            path: "appointment",
            populate: [
                {
                    path: "patient",
                    select: "name phone email",
                },
                {
                    path: "doctor",
                    select: "name specialization",
                },
            ],
        })
        .sort({ createdAt: -1 });

    // Get consultation IDs so prescriptions and billing
    // can be retrieved.
    const consultationIds = consultations.map(
        (consultation) => consultation._id
    );

    // Find prescriptions connected to those consultations.
    const prescriptions = await Prescription.find({
        consultation: { $in: consultationIds },
    })
        .populate({
            path: "consultation",
            populate: {
                path: "appointment",
                populate: {
                    path: "doctor",
                    select: "name specialization",
                },
            },
        })
        .sort({ createdAt: -1 });

    // Find billing records connected to those consultations.
    const billing = await Billing.find({
        consultation: { $in: consultationIds },
    })
        .populate({
            path: "consultation",
            populate: {
                path: "appointment",
                populate: {
                    path: "doctor",
                    select: "name specialization",
                },
            },
        })
        .sort({ createdAt: -1 });

    res.status(200).json({
        status: "success",
        data: {
            patient,
            appointments,
            consultations,
            prescriptions,
            billing,
        },
    });
};


module.exports = {
    createPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient,
    getPatientHistory,
};
// Exports all Patient controller functions so patientRoutes.js
// can connect them to API endpoints.