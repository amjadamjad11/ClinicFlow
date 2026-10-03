require("dotenv").config();

const connectDB = require("../../server/config/db");

const Doctor = require("../../server/models/Doctor");

const testDoctor = async () => {
    try{
        await connectDB();

        const doctor = await Doctor.create({
            name: "Dr. Arun Kumar",
            specialization: "Cardiology",
            phone: "9876543210",
            email: "arun@example.com",
            licenseNumber: "TEST-LIC-001",
            experience: 10,
        });
        console.log("Doctor created successfully!");
        console.log(doctor);
    }catch(error){
        console.error("Doctor creation failed:",error.message);
    }finally{
        process.exit();
    }
};
testDoctor();