const Prescription = require("../models/Prescription");
// Prescription → gives us access to the Prescription MongoDB model.

const Consultation = require("../models/Consultation");
// Consultation → lets us verify that the requested consultation exists.

// populatePrescription → keeps the population logic in one reusable function.
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
// populate → replaces referenced IDs with useful related documents.

// CREATE PRESCRIPTION
const createPrescription = async (req, res) => {
  try {
    const { consultation, medicines } = req.body;

    // Check whether consultation was provided.
    if (!consultation) {
      return res.status(400).json({
        status: "error",
        message: "Consultation is required",
      });
    }

    // Check whether at least one medicine was provided.
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

    // Check whether this consultation already has a prescription.
    const existingPrescription = await Prescription.findOne({
      consultation,
    });

    if (existingPrescription) {
      return res.status(409).json({
        status: "error",
        message: "A prescription already exists for this consultation",
      });
    }

    // Create the prescription after all checks pass.
    const prescription = await Prescription.create(req.body);

    // Populate consultation, patient and doctor information.
    const populatedPrescription = await populatePrescription(
      Prescription.findById(prescription._id)
    );

    res.status(201).json({
      status: "success",
      data: populatedPrescription,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// GET ALL PRESCRIPTIONS
const getPrescriptions = async (req, res) => {
  try {
    // Find all prescriptions and show newest ones first.
    const prescriptions = await populatePrescription(
      Prescription.find().sort({ createdAt: -1 })
    );

    res.status(200).json({
      status: "success",
      results: prescriptions.length,
      data: prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// GET ONE PRESCRIPTION
const getPrescription = async (req, res) => {
  try {
    const prescription = await populatePrescription(
      Prescription.findById(req.params.id)
    );

    // Return 404 if the prescription doesn't exist.
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
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// UPDATE PRESCRIPTION
const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // Return 404 if the prescription doesn't exist.
    if (!prescription) {
      return res.status(404).json({
        status: "error",
        message: "Prescription not found",
      });
    }

    // Get the updated prescription with related information.
    const populatedPrescription = await populatePrescription(
      Prescription.findById(prescription._id)
    );

    res.status(200).json({
      status: "success",
      data: populatedPrescription,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// DELETE PRESCRIPTION
const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);

    // Return 404 if the prescription doesn't exist.
    if (!prescription) {
      return res.status(404).json({
        status: "error",
        message: "Prescription not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Prescription deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createPrescription,
  getPrescriptions,
  getPrescription,
  updatePrescription,
  deletePrescription,
};
// Exports all controller functions so the routes can use them.