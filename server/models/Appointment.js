const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    appointmentDate:{
        type: Date,
        required: true,
        validate:{
            validator:function(value){
                return value >= new Date();
            },
                message:"Appointment date cannot be in the past"
        },
    },
    status:{
        type:String,
        enum:["Scheduled","Confirmed","Completed","Cancelled"],
        default:"Scheduled",
    },
    reason:{
        type:String,
        required:true,
    },
},
{
    timestamps: true,
}
);

const Appointment = mongoose.model("Appointment",appointmentSchema);

module.exports = Appointment;