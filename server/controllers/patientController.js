const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Consultation = require("../models/Consultation");
const Prescription = require("../models/Prescription");
const Billing = require("../models/Billing");

const createPatient = async (req , res) => {
    try{
        const patient = await Patient.create(req.body);
        res.status(201).json({
            status: "success",
            data: patient,
        });
    }catch(error){
        res.status(400).json({
            status:"error",
            message: error.message,
        });
    }
};

const getPatients = async (req, res) =>{
    try{
        const patient = await Patient.find();
        res.status(200).json({
            status: "success",
            data: patient,
        });
    }catch(error){
        res.status(400).json({
            status:"error",
            message: error.message,
        });
    }
};

const getPatient = async (req, res) => {
    try{
        const patient = await Patient.findById(req.params.id);

        if (!patient){
            return res.status(404).json({
                status: "error",
                message: "Patient not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: patient,
        });
    }catch(error){
        res.status(400).json({
            status:"error",
            message: error.message,
        });
    }
};

const updatePatient = async (req, res) => {
    try{
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if(!patient){
            return res.status(404).json({
                status: "error",
                message: "Patient not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: patient,
        });
    }catch(error){
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

const deletePatient = async (req, res) => {
    try{
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if(!patient){
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
    }catch(error){
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};
const getPatientHistory = async (req, res) => {
  try {
    // req.params.id → gets the patient ID from /api/patients/:id/history.
    const patientId = req.params.id;

    // Find the patient first so we don't return history for a nonexistent patient.
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

    // Get consultation IDs so prescriptions and billing can be retrieved.
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

    return res.status(200).json({
      status: "success",
      data: {
        patient,
        appointments,
        consultations,
        prescriptions,
        billing,
      },
    });
  } catch (error) {
    console.error("Get patient history error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to retrieve patient history",
    });
  }
};

module.exports = {
    createPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient,
    getPatientHistory,
};