const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    specialization:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
        match: /^[0-9]{10}$/,
    },
    email:{
        type:String,
    },
    licenseNumber:{
        type:String,
        required:true,
        unique:true,
    },
    experience:{
        type:Number,
        required:true,
        min:0,
    },
},
{
    timestamps: true,
}
);

const Doctor = mongoose.model("Doctor",doctorSchema);

module.exports = Doctor;
