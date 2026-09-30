const mongoose = require("mongoose");
// mongoose → connects this temporary script to MongoDB.

require("dotenv").config();
// dotenv → loads environment variables from the root .env file.

const User = require("../server/models/User");
// ../ → moves from scripts/ back to the project root.
// User → accesses the ClinicFlow User collection.

const deleteDoctorTestUser = async () => {
  try {
    // Read the test user's email from the command line.
    const email = process.argv[2];

    if (!email) {
      console.error(
        "Usage: node scripts/deleteDoctorTestUser.js <email>"
      );
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    // connect() → connects this script to MongoDB using the protected .env value.

    const result = await User.deleteOne({ email });
    // deleteOne() → removes only the temporary test account matching this email.

    console.log(`Deleted users: ${result.deletedCount}`);
  } catch (error) {
    console.error("Failed to delete Doctor test user:", error.message);
  } finally {
    await mongoose.disconnect();
    // disconnect() → closes the temporary MongoDB connection.
  }
};

deleteDoctorTestUser();
// Starts the test-user deletion process.