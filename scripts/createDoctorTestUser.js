const dns = require("dns");

// Use Google's DNS resolver so MongoDB Atlas SRV records resolve reliably
// in this local development environment.
dns.setServers(["8.8.8.8"]);

const mongoose = require("mongoose");
// mongoose → connects this temporary script to MongoDB.

require("dotenv").config();
// dotenv → loads environment variables from the root .env file.

const User = require("../server/models/User");
// ../ → moves from scripts/ back to the project root.
// User → uses the same User model as the ClinicFlow application.

const createDoctorUser = async () => {
  try {
    // Read test credentials from the command line instead of storing them in source code.
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
      console.error(
        "Usage: node scripts/createDoctorTestUser.js <email> <password>"
      );
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    // connect() → connects this script to MongoDB using the protected .env value.

    const existingUser = await User.findOne({ email });
    // findOne() → checks whether a user with this email already exists.

    if (existingUser) {
      console.log("Doctor test user already exists.");
      return;
    }

    await User.create({
      name: "RBAC Test Doctor",
      email,
      password,
      role: "Doctor",
    });
    // User.create() → creates the Doctor user.
    // The User model automatically hashes the password before saving.

    console.log("Doctor test user created successfully.");
    console.log(`Email: ${email}`);
    console.log("Password: [provided securely at runtime]");
  } catch (error) {
    console.error("Failed to create Doctor test user:", error.message);
  } finally {
    await mongoose.disconnect();
    // disconnect() → closes the temporary MongoDB connection.
  }
};

createDoctorUser();
// Starts the Doctor test-user creation process.