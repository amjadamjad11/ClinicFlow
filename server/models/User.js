const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        password:{
            type:String,
            required:true,
            minlength:6,
        },
        role:{
            type:String,
            required:true,
            enum:["Admin", "Doctor", "Receptionist"],
            default: "Receptionist",
        },
    },
    {
        timestamps:true,
    }
);

userSchema.pre("save",async function (){
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password,12);
});

const User = mongoose.model("user",userSchema);

module.exports = User;