const User = require("../models/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const registerUser = async(req , res) => {
    try{
        const {name,email,password,role}=req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                status:"error",
                message:"Name,email and password are required",
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

         if (!emailRegex.test(email)) {
            return  res.status(400).json({
                status:"error",
                message:"Please provide valid email address",
            });
         }
         if (password.length < 6) {
            return res.status(400).json({
                status:"error",
                message:"Password must be at least 6 character", 
            });
         }
         if(role && role !== "Receptionist"){
            return res.status(403).json({
                status:"error",
                message:"You cannot register with this role"
            });
         }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(409).json({
                status:"error",
                message:"User with this email already exist",
            });
        }
        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        res.status(201).json({
            status:"success",
            data:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            },
        });
    }catch(error){
        res.status(400).json({
            status:"error",
            message:error.message,
        });
    }
};

const loginUser = async (req,res) => {
    try{
        const {email,password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status:"error",
                message:"Email and password are required",
            });
        }


        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                status:"error",
                message:"Invalid email or password",
            });
        }
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );
        if(!isPasswordCorrect){
            return res.status(401).json({
                status:"error",
                message:"Invalid email or password",
            });
        }
        const token = jwt.sign(
            {id:user._id,
            role: user.role,},
            process.env.JWT_SECRET,
            {
                expiresIn:"1d",
            }
        );
        res.status(200).json({
            status:"success",
            data:{
                token,
                user:{
                    id:user._id,
                    name:user.name,
                    role:user.role,
                },
            },
        });
    }catch(error){
        res.status(500).json({
            status:"error",
            message:error.message,
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
};