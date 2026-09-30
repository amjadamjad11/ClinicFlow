const Consultation = require("../models/Consultation");

const Appointment = require("../models/Appointment");

const createConsultation = async (req, res) => {
  try {
    const { appointment } = req.body;

    if (!appointment) {
      return res.status(400).json({
        status: "error",
        message: "Appointment is required",
      });
    }

    const existingAppointment = await Appointment.findById(appointment);
    if (!existingAppointment) {
      return res.status(404).json({
        status: "error",
        message: "Appointment not found",
      });
    }

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
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
const getConsultations = async(req,res) => {
    try{
        const consultations = await Consultation.find()
        .sort({createdAt:-1})
        .populate({
            path:"appointment",
            populate:[
                {path:"patient",
                select:"name phone",},
                {
                    path:"doctor",
                    select:"name specialization",
                },
            ],
        });
        res.status(200).json({
            status:"success",
            results:consultations.length,
            data:consultations,
        });
    }catch(error){
        res.status(500).json({
            status:"error",
            message:error.message,
        });
    }
};
const getConsultation = async(req,res)=>{
    try{
        const consultation = await Consultation.findById(req.params.id).populate({
            path:"appointment",
            populate:[
                {
                    path:"patient",
                    select:"name phone"
                },
                {
                    path:"doctor",
                    select:"name specialization"
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
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

const updateConsultation = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndDelete(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        status: "error",
        message: "Consultation not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Consultation deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createConsultation,
  getConsultations,
  getConsultation,
  updateConsultation,
  deleteConsultation,
};