const Prescription = require("../models/Prescription");
// Prescription → gives access to the Prescription MongoDB model.

const Consultation = require("../models/Consultation");
// Consultation → verifies that the requested consultation exists.


// populatePrescription → keeps population logic reusable.
const populatePrescription = (query) => {
    return query.populate({
        path: "consultation",
        populate: {
            path: "appointment",
            populate: [
                {
                    path: "patient",
                    select: "name phone",
                },
                {
                    path: "doctor",
                    select: "name specialization",
                },
            ],
        },
    });
};


// CREATE PRESCRIPTION
const createPrescription = async (req, res) => {
    const { consultation, medicines } = req.body;

    // Consultation is required.
    if (!consultation) {
        return res.status(400).json({
            status: "error",
            message: "Consultation is required",
        });
    }

    // At least one medicine must be supplied.
    if (!Array.isArray(medicines) || medicines.length === 0) {
        return res.status(400).json({
            status: "error",
            message: "At least one medicine is required",
        });
    }

    // Verify that the consultation exists.
    const existingConsultation = await Consultation.findById(consultation);

    if (!existingConsultation) {
        return res.status(404).json({
            status: "error",
            message: "Consultation not found",
        });
    }

    // Prevent duplicate prescriptions for one consultation.
    const existingPrescription = await Prescription.findOne({
        consultation,
    });

    if (existingPrescription) {
        return res.status(409).json({
            status: "error",
            message: "A prescription already exists for this consultation",
        });
    }

    const prescription = await Prescription.create(req.body);

    const populatedPrescription = await populatePrescription(
        Prescription.findById(prescription._id)
    );

    res.status(201).json({
        status: "success",
        data: populatedPrescription,
    });
};


// GET ALL PRESCRIPTIONS
const getPrescriptions = async (req, res) => {
    const prescriptions = await populatePrescription(
        Prescription.find().sort({ createdAt: -1 })
    );

    res.status(200).json({
        status: "success",
        results: prescriptions.length,
        data: prescriptions,
    });
};


// GET ONE PRESCRIPTION
const getPrescription = async (req, res) => {
    const prescription = await populatePrescription(
        Prescription.findById(req.params.id)
    );

    if (!prescription) {
        return res.status(404).json({
            status: "error",
            message: "Prescription not found",
        });
    }

    res.status(200).json({
        status: "success",
        data: prescription,
    });
};


// UPDATE PRESCRIPTION
const updatePrescription = async (req, res) => {
    const prescription = await Prescription.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!prescription) {
        return res.status(404).json({
            status: "error",
            message: "Prescription not found",
        });
    }

    const populatedPrescription = await populatePrescription(
        Prescription.findById(prescription._id)
    );

    res.status(200).json({
        status: "success",
        data: populatedPrescription,
    });
};


// DELETE PRESCRIPTION
const deletePrescription = async (req, res) => {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);

    if (!prescription) {
        return res.status(404).json({
            status: "error",
            message: "Prescription not found",
        });
    }

    res.status(204).send();
};


module.exports = {
    createPrescription,
    getPrescriptions,
    getPrescription,
    updatePrescription,
    deletePrescription,
};