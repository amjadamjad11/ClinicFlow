require("dotenv").config();

const connectDB = require("../../server/config/db");

const Appointment = require("../../server/models/Appointment");

const createTestAppointment = async() =>{
    try{
        await connectDB();

        const appointment = await Appointment.create({
            patient: "6a9bd1ecc1cb7852580a2fa6",

            doctor: "6a9cfa37340c693e9301f686",

            appointmentDate: new Date("2026-09-10T10:00:00"),

            reason: "Skin consultation",
        });

        console.log("Appointment created successfully:");
        console.log(appointment);
    }catch(error){
        console.error("Appointment creation failed:",error.message);
    }
};

createTestAppointment();