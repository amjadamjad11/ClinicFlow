const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Create a new doctor
const createDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.create(req.body);

        res.status(201).json({
            status: "success",
            data: doctor,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message
        });
    }
};

// Get all doctors
const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();

        res.status(200).json({
            status: "success",
            results: doctors.length,
            data: doctors,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

// Get a single doctor
const getDoctor = async (req, res) => {
    try {
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

    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

// Get all appointments belonging to a doctor
const getDoctorSchedule = async (req, res) => {
    try {
        // Check that the requested doctor exists before searching appointments.
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                status: "error",
                message: "Doctor not found",
            });
        }

        // Populate patient details so the schedule is useful to the frontend.
        // Sorting by appointmentDate creates a chronological doctor schedule.
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

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};

// Update a doctor
const updateDoctor = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

// Delete a doctor
const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                status: "error",
                message: "Doctor not found",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Doctor deleted successfully",
            data: doctor,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

module.exports = {
    createDoctor,
    getDoctors,
    getDoctor,
    getDoctorSchedule,
    updateDoctor,
    deleteDoctor,
};