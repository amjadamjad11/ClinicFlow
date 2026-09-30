require("dotenv").config();

const connectDB = require("./config/db");

const Patient = require("./models/Patient");

const testPatient = async () => {
    try{
        await connectDB();
        const patient = await Patient.create({
                name:"Test  Patient",
                dateOfBirth: new Date("1990-01-01"),
                gender:"Male",
                phone:"1234567890",
                email:"test@example.com",
                address:"Kochi",
                medicalHistory:"No known allergies",
        });

        console.log("Patient created successfully!");
        console.log(patient);

    }catch(error){
        console.error("patient creation failed:",error.message);
    }finally{
        process.exit();
    }
};
testPatient();