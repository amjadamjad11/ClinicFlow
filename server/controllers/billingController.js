const Billing = require("../models/Billing");
// Billing → gives access to billing records.

const Consultation = require("../models/Consultation");
// Consultation → verifies the consultation connected to the bill.

const Appointment = require("../models/Appointment");
// Appointment → verifies the appointment connected to the consultation.


// Reusable population logic.
const populateBilling = (query) => {
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


// CREATE BILLING
const createBilling = async (req, res) => {
    const {
        consultation,
        consultationFee,
        medicineCharges = 0,
        otherCharges = 0,
        paymentStatus,
        paymentMethod,
        notes,
    } = req.body;

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

    const existingAppointment = await Appointment.findById(
        existingConsultation.appointment
    );

    if (!existingAppointment) {
        return res.status(404).json({
            status: "error",
            message: "Appointment linked to this consultation was not found",
        });
    }

    // Prevent duplicate billing records.
    const existingBilling = await Billing.findOne({
        consultation,
    });

    if (existingBilling) {
        return res.status(409).json({
            status: "error",
            message: "A billing record already exists for this consultation",
        });
    }

    // Calculate the total on the server.
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
};


// GET ALL BILLINGS
const getBillings = async (req, res) => {
    const billings = await populateBilling(
        Billing.find().sort({ createdAt: -1 })
    );

    res.status(200).json({
        status: "success",
        results: billings.length,
        data: billings,
    });
};


// GET ONE BILLING
const getBilling = async (req, res) => {
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
};


// UPDATE BILLING
const updateBilling = async (req, res) => {
    const existingBilling = await Billing.findById(req.params.id);

    if (!existingBilling) {
        return res.status(404).json({
            status: "error",
            message: "Billing record not found",
        });
    }

    const consultationFee =
        req.body.consultationFee ?? existingBilling.consultationFee;

    const medicineCharges =
        req.body.medicineCharges ?? existingBilling.medicineCharges;

    const otherCharges =
        req.body.otherCharges ?? existingBilling.otherCharges;

    // Recalculate the total instead of trusting client input.
    const totalAmount =
        Number(consultationFee || 0) +
        Number(medicineCharges || 0) +
        Number(otherCharges || 0);

    // Keep the original consultation relationship unchanged.
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
};


// DELETE BILLING
const deleteBilling = async (req, res) => {
    const billing = await Billing.findByIdAndDelete(req.params.id);

    if (!billing) {
        return res.status(404).json({
            status: "error",
            message: "Billing record not found",
        });
    }

    res.status(204).send();
};


module.exports = {
    createBilling,
    getBillings,
    getBilling,
    updateBilling,
    deleteBilling,
};