const Billing = require("../models/Billing");
const Consultation = require("../models/Consultation");
const Appointment = require("../models/Appointment");

// populateBilling → adds related consultation, appointment, patient, and doctor data.
const populateBilling = (query) => {
  return query.populate({
    path: "consultation",
    populate: {
      path: "appointment",
      populate: [
        { path: "patient", select: "name phone" },
        { path: "doctor", select: "name specialization" },
      ],
    },
  });
};

// CREATE BILLING
const createBilling = async (req, res) => {
  try {
    const {
      consultation,
      consultationFee,
      medicineCharges = 0,
      otherCharges = 0,
      paymentStatus,
      paymentMethod,
      notes,
    } = req.body;

    // consultation → identifies which consultation this bill belongs to.
    if (!consultation) {
      return res.status(400).json({
        status: "error",
        message: "Consultation is required",
      });
    }

    const existingConsultation = await Consultation.findById(consultation);

    if (!existingConsultation) {
      return res.status(404).json({
        status: "error",
        message: "Consultation not found",
      });
    }

    // Appointment → verifies that the consultation has a valid appointment.
    const existingAppointment = await Appointment.findById(
      existingConsultation.appointment
    );

    if (!existingAppointment) {
      return res.status(404).json({
        status: "error",
        message: "Appointment linked to this consultation was not found",
      });
    }

    // Prevents multiple billing records for one consultation.
    const existingBilling = await Billing.findOne({
      consultation,
    });

    if (existingBilling) {
      return res.status(409).json({
        status: "error",
        message: "A billing record already exists for this consultation",
      });
    }

    // Calculates the final amount on the server.
    const totalAmount =
      Number(consultationFee || 0) +
      Number(medicineCharges || 0) +
      Number(otherCharges || 0);

    const billing = await Billing.create({
      consultation,
      consultationFee,
      medicineCharges,
      otherCharges,
      totalAmount,
      paymentStatus,
      paymentMethod,
      notes,
    });

    const populatedBilling = await populateBilling(
      Billing.findById(billing._id)
    );

    res.status(201).json({
      status: "success",
      data: populatedBilling,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// GET ALL BILLINGS
const getBillings = async (req, res) => {
  try {
    const billings = await populateBilling(
      Billing.find().sort({ createdAt: -1 })
    );

    res.status(200).json({
      status: "success",
      results: billings.length,
      data: billings,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// GET ONE BILLING
const getBilling = async (req, res) => {
  try {
    const billing = await populateBilling(
      Billing.findById(req.params.id)
    );

    if (!billing) {
      return res.status(404).json({
        status: "error",
        message: "Billing record not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: billing,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// UPDATE BILLING
const updateBilling = async (req, res) => {
  try {
    const existingBilling = await Billing.findById(req.params.id);

    if (!existingBilling) {
      return res.status(404).json({
        status: "error",
        message: "Billing record not found",
      });
    }

    // Uses the existing value when a charge is not included in the update.
    const consultationFee =
      req.body.consultationFee ?? existingBilling.consultationFee;

    const medicineCharges =
      req.body.medicineCharges ?? existingBilling.medicineCharges;

    const otherCharges =
      req.body.otherCharges ?? existingBilling.otherCharges;

    // Recalculates the total instead of trusting the client.
    const totalAmount =
      Number(consultationFee || 0) +
      Number(medicineCharges || 0) +
      Number(otherCharges || 0);

    // Keeps the original consultation relationship unchanged.
    const updateData = {
      ...req.body,
      consultation: existingBilling.consultation,
      totalAmount,
    };

    const billing = await Billing.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    const populatedBilling = await populateBilling(
      Billing.findById(billing._id)
    );

    res.status(200).json({
      status: "success",
      data: populatedBilling,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// DELETE BILLING
const deleteBilling = async (req, res) => {
  try {
    const billing = await Billing.findByIdAndDelete(req.params.id);

    if (!billing) {
      return res.status(404).json({
        status: "error",
        message: "Billing record not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Billing record deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createBilling,
  getBillings,
  getBilling,
  updateBilling,
  deleteBilling,
};