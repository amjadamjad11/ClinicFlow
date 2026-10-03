const Consultation = require("../models/Consultation");
// Consultation → gives access to the Consultation MongoDB model.

const Appointment = require("../models/Appointment");
// Appointment → used to verify that the consultation belongs to a valid appointment.


// CREATE CONSULTATION
const createConsultation = async (req, res) => {
    const { appointment } = req.body;

    // Appointment is required because every consultation
    // must belong to an appointment.
    if (!appointment) {
        return res.status(400).json({
            status: "error",
            message: "Appointment is required",
        });
    }

    // Verify that the referenced appointment exists.
    const existingAppointment = await Appointment.findById(appointment);

    if (!existingAppointment) {
        return res.status(404).json({
            status: "error",
            message: "Appointment not found",
        });
    }

    // Prevent multiple consultations for the same appointment.
    const existingConsultation = await Consultation.findOne({
        appointment,
    });

    if (existingConsultation) {
        return res.status(409).json({
            status: "error",
            message: "A consultation already exists for this appointment",
        });
    }

    const consultation = await Consultation.create(req.body);

    // Populate related patient and doctor information
    // before sending the response.
    const populatedConsultation = await consultation.populate({
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
    });

    res.status(201).json({
        status: "success",
        data: populatedConsultation,
    });
};


// GET ALL CONSULTATIONS
const getConsultations = async (req, res) => {
    // Get newest consultations first and populate related data.
    const consultations = await Consultation.find()
        .sort({ createdAt: -1 })
        .populate({
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
        });

    res.status(200).json({
        status: "success",
        results: consultations.length,
        data: consultations,
    });
};


// GET ONE CONSULTATION
const getConsultation = async (req, res) => {
    const consultation = await Consultation.findById(req.params.id)
        .populate({
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
        });

    if (!consultation) {
        return res.status(404).json({
            status: "error",
            message: "Consultation not found",
        });
    }

    res.status(200).json({
        status: "success",
        data: consultation,
    });
};


// UPDATE CONSULTATION
const updateConsultation = async (req, res) => {
    // runValidators → ensures updated values still follow
    // the Mongoose schema rules.
    const consultation = await Consultation.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    ).populate({
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
    });

    if (!consultation) {
        return res.status(404).json({
            status: "error",
            message: "Consultation not found",
        });
    }

    res.status(200).json({
        status: "success",
        data: consultation,
    });
};


// DELETE CONSULTATION
const deleteConsultation = async (req, res) => {
    const consultation = await Consultation.findByIdAndDelete(req.params.id);

    if (!consultation) {
        return res.status(404).json({
            status: "error",
            message: "Consultation not found",
        });
    }

    // 204 → successful deletion with no response body.
    res.status(204).send();
};


module.exports = {
    createConsultation,
    getConsultations,
    getConsultation,
    updateConsultation,
    deleteConsultation,
};