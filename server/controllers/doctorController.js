const Doctor = require('../models/Doctor');

const createDoctor = async (req, res) => {
    try{
        const doctor = await Doctor.create(req.body);

        res.status(201).json({
            status:"success",
            data:doctor,
        });
    }catch(error){
        res.status(400).json({
            status:"error",
            message:error.message
        });
    }
};

const getDoctors = async (req, res) => {
    try{
        const doctors = await Doctor.find();

        res.status(200).json({
            status:"success",
            results: doctors.length,
            data: doctors,
        });
    }catch(error){
        res.status(500).json({
            status:"error",
            message:error.message,
        });
    }
};

const getDoctor = async (req, res) => {
    try{
        const doctor =  await Doctor.findById(req.params.id);

        if(!doctor){
            return res.status(404).json({
                status:"error",
                message:"Doctor not found",
            });
        }
        res.status(200).json({
            status:"success",
            data:doctor,
        });

    }catch(error){
        res.status(400).json({
            status:"error",
            message:error.message,
        });
    }
};

const updateDoctor = async (req, res) => {
    try{
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true,
                runValidators:true,
            }
        );
        if(!doctor){
            return res.status(404).json({
                status:"error",
                message:"Doctor not found",
            });
        }
        res.status(200).json({
            status:"success",
            data:doctor,
        });
    }catch(error){
        res.status(400).json({
            status:"error",
            message:error.message,
        });
    }
};

const deleteDoctor = async (req, res) => {
    try{
        const doctor = await Doctor.findByIdAndDelete(req.params.id);

        if(!doctor){

            return res.status(404).json({
                status:"error",
                message:"Doctor not found",
            });            
        }
        res.status(200).json({
            status:"success",
            message:"Doctor deleted successfully",
            data:doctor,
        });
    }catch(error){
        res.status(400).json({
            status:"error",
            message:error.message,
        });
    }
};

module.exports = {
    createDoctor,
    getDoctors,
    getDoctor,
    updateDoctor,
    deleteDoctor,
}