const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
    {
        appointment:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Appointment",
            required:true,
        },
        symptoms:{
            type:String,
            required:true,
            trim:true,
        },
        diagnosis:{
            type:String,
            required:true,
            trim:true,
        },
        treatment:{
            type:String,
            trim:true,
        },
        notes:{
            type:String,
            trim:true,
        },
    },
    {
        timestamps:true,
    }
);

const Consultation = mongoose.model("Consultation",consultationSchema);

module.exports = Consultation;