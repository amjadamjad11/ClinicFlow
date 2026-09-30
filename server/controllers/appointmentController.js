const Appointment = require("../models/Appointment");

const createAppointment = async (req, res) =>{
    try{
        const existingAppointment = await Appointment.findOne({
            doctor:req.body.doctor,
            appointmentDate: req.body.appointmentDate,
            status:{$ne: "Cancelled"},
        });

        if(existingAppointment){
            return res.status(409).json({
                status:"error",
                message:"Doctor already has an appointment at this time"
            });
        }


        const appointment = await Appointment.create(req.body);

        res.status(201).json({
            status:"success",
            data:appointment,
        });
    }catch(error){
        res.status(400).json({
            status:"error",
            message:error.message,
        })
    }
};

const getAppointments = async (req , res) =>{
    try{

        const {status , doctor , patient, from , to , sort , search ,page=1,
            limit=10,
        } = req.query;
        const filter = {};

        const allowedStatuses = [
            "Scheduled",
            "Confirmed",
            "Completed",
            "Cancelled",
        ];

        if(status){
            if(!allowedStatuses.includes(status)){
                return res.status(400).json({
                    status:"error",
                    message:"Invalid appointment status",
                });
            }
            filter.status = status;
        }
        if(doctor){
            filter.doctor=doctor;
        }
        if(patient){
            filter.patient=patient;
        }

        if(search){
            const Patient = require("../models/Patient");
            const Doctor = require("../models/Doctor");

            const searchRegex = new RegExp(search,"i");

            const matchingPatients = await Patient.find({
                name:searchRegex,
            }).select("_id");
            
            const matchingDoctors = await Doctor.find({
                name: searchRegex,
            }).select("_id");

            const patientIds = matchingPatients.map((patient) => patient._id);
            const doctorIds = matchingDoctors.map((doctor) => doctor._id);

            filter.$or = [
                { reason: searchRegex },
                { patient: { $in: patientIds } },
                { doctor: { $in: doctorIds } },
            ];

        }

        if(from || to){
            filter.appointmentDate = {};

            if(from){
                const fromDate = new Date(`${from}T00:00:00.000Z`);

                if(Number.isNaN(fromDate.getTime())){
                    return res.status(400).json({
                        status:"error",
                        message:"Invalid 'from' date.Use YYYY-MM-DD"
                    });
                }
                filter.appointmentDate.$gte = fromDate;
            }
            if(to){
                const toDate = new Date(`${to}T00:00:00.000Z`);

                if (Number.isNaN(toDate.getTime())) {
                    return res.status(400).json({
                        status:"error",
                        message:"Invalid 'to' date. use YYYY-MM-DD",
                    });
                }
                toDate.setUTCDate(toDate.getUTCDate()+1);
                filter.appointmentDate.$lt = toDate;
            }
            if(
                filter.appointmentDate.$gte &&
                filter.appointmentDate.$lt &&
                filter.appointmentDate.$gte >= filter.appointmentDate.$lt
            ){
                return res.status(400).json({
                    status:"error",
                    message:"'from' date must be before 'to' date",
                });
            }
        }

        let sortOption = {};

        const allowedSortFields = ["appointmentDate", "createdAt", "status"];

        if(sort){

            const sortField = sort.startsWith("-")
            ? sort.substring(1)
            : sort;

            if (!allowedSortFields.includes(sortField)) {
                return res.status(400).json({
                    status:"error",
                    message:`Invalid sort field.Allowed fields:" ${allowedSortFields.join(
                        ","
                    )}`,
                });
            }

            if(sort.startsWith("-")){
                sortOption[sort.substring(1)] = -1;
            }else{
                sortOption[sort] = 1;
            }
        }else{
            sortOption.appointmentDate = 1;
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        if(
            !Number.isInteger(pageNumber) ||
            !Number.isInteger(limitNumber) ||
            pageNumber < 1 ||
            limitNumber <1
        ){
            return res.status(400).json({
                status: "error",
                message:"Page and limit must be positive integers",
            });
        }

        if(limitNumber > 100){
            return res.status(400).json({
                status:"error",
                message:"Limit cannot be greater than 100",
            });
        }

        const skip = (pageNumber - 1) * limitNumber;

        const totalAppointments = await Appointment.countDocuments(filter);

        const appointments = await Appointment.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber)
        .populate("patient", "name phone")
        .populate("doctor", "name specialization");

        const totalPages = Math.ceil(totalAppointments/limitNumber);

        res.status(200).json({
            status: "success",
            results:appointments.length,

            pagination: {
                currentPage: pageNumber,
                limit:limitNumber,
                totalAppointments,
                totalPages,
            },

            data:appointments,
        });
    }catch(error){
        res.status(500).json({
            status: "error",
            message:error.message,
        });
    }
};

const getAppointment = async(req,res) =>{
    try{
        const appointment = await Appointment.findById(req.params.id)
        .populate("patient", "name phone")
        .populate("doctor", "name specialization");

        if(!appointment){
            return res.status(404).json({
                status:"error",
                message:"Appointment not found",
            });
        }
        res.status(200).json({
            status:"success",
            data:appointment,
        });
    }catch(error){
        res.status(400).json({
            status:"error",
            message:error.message,
        });
    }
};

const updateAppointment = async (req,res) => {
    try{
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true,
                runValidators: true,
            }
        );
        if(!appointment){
            return res.status(404).json({
                status:"error",
                message:"Appointment not found",
           });
        }
        res.status(200).json({
            status:"success",
            data:appointment,
        });
    }catch(error){
            res.status(400).json({
                status:"error",
                message:error.message,
            });
    }
}

const deleteAppointment = async(req,res) => {
    try{
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if(!appointment){
            return res.status(404).json({
                status:"error",
                message:"Appointment not found",
            });
        }

        res.status(200).json({
            status:"success",
            message:"Appointment deleted successfully",
            data:appointment,
        });
    }catch(error){
        res.status(400).json({
            status:"error",
            message:error.message,
        });
    }
};

module.exports={
    createAppointment,
    getAppointments,
    getAppointment,
    updateAppointment,
    deleteAppointment,
};