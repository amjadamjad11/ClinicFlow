const Doctor = require("../models/Doctor");
// Doctor → gives access to the Doctor MongoDB model.

const Appointment = require("../models/Appointment");
// Appointment → used to retrieve a doctor's schedule.


// CREATE DOCTOR
const createDoctor = async (req, res) => {
    const doctor = await Doctor.create(req.body);

    res.status(201).json({
        status: "success",
        data: doctor,
    });
};


// GET ALL DOCTORS
const getDoctors = async (req, res) => {
    const doctors = await Doctor.find();

    res.status(200).json({
        status: "success",
        results: doctors.length,
        data: doctors,
    });
};


// GET ONE DOCTOR
const getDoctor = async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
        return res.status(404).json({
            status: "error",
            message: "Doctor not found",
        });
    }

    res.status(200).json({
        status: "success",
        data: doctor,
    });
};


// GET DOCTOR SCHEDULE
const getDoctorSchedule = async (req, res) => {
    // Verify that the requested doctor exists.
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
        return res.status(404).json({
            status: "error",
            message: "Doctor not found",
        });
    }

    // Get appointments belonging to this doctor.
    const appointments = await Appointment.find({
        doctor: req.params.id,
    })
        .populate("patient", "name phone email")
        .sort({ appointmentDate: 1 });

    res.status(200).json({
        status: "success",
        doctor: {
            id: doctor._id,
            name: doctor.name,
            specialization: doctor.specialization,
        },
        results: appointments.length,
        data: appointments,
    });
};


// UPDATE DOCTOR
const updateDoctor = async (req, res) => {
    const doctor = await Doctor.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!doctor) {
        return res.status(404).json({
            status: "error",
            message: "Doctor not found",
        });
    }

    res.status(200).json({
        status: "success",
        data: doctor,
    });
};


// DELETE DOCTOR
const deleteDoctor = async (req, res) => {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
        return res.status(404).json({
            status: "error",
            message: "Doctor not found",
        });
    }

    // 204 → successful deletion with no response body.
    res.status(204).send();
};


module.exports = {
    createDoctor,
    getDoctors,
    getDoctor,
    getDoctorSchedule,
    updateDoctor,
    deleteDoctor,
};