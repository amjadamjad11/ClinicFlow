const mongoose = require("mongoose");
// mongoose → connects this temporary script to MongoDB.

require("dotenv").config();
// dotenv → loads environment variables from the root .env file.

const User = require("../server/models/User");
// ../ → moves from scripts/ back to the project root.
// User → uses the same User model as the ClinicFlow application.

const createAdminUser = async () => {
  try {
    // Read test credentials from the command line instead of storing them in source code.
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
      console.error(
        "Usage: node scripts/createAdminTestUser.js <email> <password>"
      );
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    // connect() → connects this script to MongoDB using the protected .env value.

    const existingUser = await User.findOne({ email });
    // findOne() → checks whether a user with this email already exists.

    if (existingUser) {
      console.log("Admin test user already exists.");
      return;
    }

    await User.create({
      name: "RBAC Test Admin",
      email,
      password,
      role: "Admin",
    });
    // User.create() → creates the Admin user.
    // The User model automatically hashes the password before saving.

    console.log("Admin test user created successfully.");
    console.log(`Email: ${email}`);
    console.log("Password: [provided securely at runtime]");
  } catch (error) {
    console.error("Failed to create Admin test user:", error.message);
  } finally {
    await mongoose.disconnect();
    // disconnect() → closes the temporary MongoDB connection.
  }
};

createAdminUser();
// Starts the Admin test-user creation process.