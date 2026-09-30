const dns = require("dns");
// dns → Node.js built-in DNS module.
// We use it because MongoDB Atlas SRV DNS resolution
// requires Google's DNS resolver in our current environment.

dns.setServers(["8.8.8.8"]);
// setServers() → tells Node.js which DNS server to use.
// 8.8.8.8 → Google's public DNS resolver.
// This allows Node.js to resolve the MongoDB Atlas SRV record.

const mongoose = require("mongoose");
// mongoose → library that allows Node.js to communicate with MongoDB.

const connectDB = async () => {
  // async → allows us to use await for the database connection.

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    // mongoose.connect() → connects our application to MongoDB Atlas.
    // process.env.MONGODB_URI → gets the connection string from .env.

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
    // process.exit(1) → stops the application because the database
    // connection is required for ClinicFlow to work.
  }
};

module.exports = connectDB;
// Exports connectDB so server.js and other files can use it.