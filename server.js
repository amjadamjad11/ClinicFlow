const dns = require("dns");
// dns → Node.js built-in DNS module.
// Why? → We need to control which DNS resolver Node.js uses.

dns.setServers(["8.8.8.8"]);
// setServers → configures the DNS server used by Node.js.
// 8.8.8.8 → Google's public DNS resolver.
// Why? → Our testing proved this resolver can resolve MongoDB Atlas SRV records.

require("dotenv").config();
// dotenv → loads values from our .env file.
// Why? → Our MongoDB connection string is stored in .env.

const express = require("express");
// express → backend framework for Node.js.
// Why? → We use Express to create the ClinicFlow API.
const helmet = require("helmet");
const connectDB = require("./server/config/db");
// connectDB → our MongoDB connection function.
// Why? → ClinicFlow needs MongoDB before the API starts.

const Patient = require("./server/models/Patient");

const Doctor = require("./server/models/Doctor");

const patientRoutes = require("./server/routes/patientRoutes");

const doctorRoutes = require("./server/routes/doctorRoutes");

const appointmentRoutes = require("./server/routes/appointmentRoutes");

const authRoutes = require("./server/routes/authRoutes");

const consultationRoutes = require("./server/routes/consultationRoutes");

const prescriptionRoutes = require("./server/routes/prescriptionRoutes");

const billingRoutes = require("./server/routes/billingRoutes");

const dashboardRoutes = require("./server/routes/dashboardRoutes");

const errorMiddleware = require("./server/middleware/errorMiddleware");

const app = express();

app.use(helmet());

const PORT = 5000;

app.use(express.json({ limit: "10kb" }));

app.use("/api/patients", patientRoutes);

app.use("/api/doctors", doctorRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/consultations", consultationRoutes);

app.use("/api/prescriptions", prescriptionRoutes);

app.use("/api/billing", billingRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("ClinicFlow API is running!");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "ClinicFlow API is healthy!",
  });
});

app.use((req, res, next) => {
  // This middleware handles requests that did not match any ClinicFlow route.
  // Why? → APIs should return a consistent JSON 404 response instead of Express's default HTML response.
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);

  error.statusCode = 404;

  next(error);
});

app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`ClinicFlow server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start ClinicFlow:", error.message);
  }
};

startServer();