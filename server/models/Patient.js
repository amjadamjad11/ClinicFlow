const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },

    dateOfBirth:{
        type: Date,
        required: true,
    },
    gender:{
        type: String,
        required: true,
        enum: ['Male','Female','other'],
    },
    phone:{
        type:String,
        required: true,
        match: /^[0-9]{10}$/,
    },
    email:{
        type: String,
    },
    address:{
        type: String,
    },
    medicalHistory:{
        type: String,
    },
},
    {
        timestamps: true,
    }
);
const Patient = mongoose.model('Patient',patientSchema);
module.exports = Patient;