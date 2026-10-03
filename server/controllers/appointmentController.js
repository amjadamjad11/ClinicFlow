const Appointment = require("../models/Appointment");
// Appointment → gives us access to the Appointment MongoDB model.


// CREATE APPOINTMENT
const createAppointment = async (req, res) => {
    // asyncHandler catches unexpected errors and forwards them
    // to the centralized error middleware.
    const appointment = await Appointment.create(req.body);

    res.status(201).json({
        status: "success",
        data: appointment,
    });
};


// GET ALL APPOINTMENTS
const getAppointments = async (req, res) => {
    // Find all appointments from MongoDB.
    const appointments = await Appointment.find()
        .populate("patient", "name phone email")
        .populate("doctor", "name specialization")
        .sort({ appointmentDate: -1 });

    res.status(200).json({
        status: "success",
        data: appointments,
    });
};


// GET ONE APPOINTMENT
const getAppointment = async (req, res) => {
    // Find one appointment using the ID from the URL.
    const appointment = await Appointment.findById(req.params.id)
        .populate("patient", "name phone email")
        .populate("doctor", "name specialization");

    // Return 404 when the appointment does not exist.
    if (!appointment) {
        return res.status(404).json({
            status: "error",
            message: "Appointment not found",
        });
    }

    res.status(200).json({
        status: "success",
        data: appointment,
    });
};


// UPDATE APPOINTMENT
const updateAppointment = async (req, res) => {
    // Find the appointment and update it.
    // runValidators → makes Mongoose apply schema validation
    // to the updated values.
    const appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    // Return 404 when the appointment does not exist.
    if (!appointment) {
        return res.status(404).json({
            status: "error",
            message: "Appointment not found",
        });
    }

    res.status(200).json({
        status: "success",
        data: appointment,
    });
};


// DELETE APPOINTMENT
const deleteAppointment = async (req, res) => {
    // Find and remove the appointment from MongoDB.
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    // Return 404 when the appointment does not exist.
    if (!appointment) {
        return res.status(404).json({
            status: "error",
            message: "Appointment not found",
        });
    }

    // 204 means the resource was successfully deleted
    // and the response intentionally contains no body.
    res.status(204).send();
};


module.exports = {
    createAppointment,
    getAppointments,
    getAppointment,
    updateAppointment,
    deleteAppointment,
};
// Exports all Appointment controllers so appointmentRoutes.js
// can connect them to API endpoints.