
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const jwt = require("jsonwebtoken");

// Use a test-only JWT secret. Never put real credentials in tests.
process.env.JWT_SECRET = "clinicflow-automated-test-secret";

// Mock the controller before importing the routes.
// This prevents tests from accessing the real MongoDB database.
const controllerPath = require.resolve("../server/controllers/patientController");

require.cache[controllerPath] = {
    id: controllerPath,
    filename: controllerPath,
    loaded: true,
    exports: {
        createPatient: (req, res) => {
            res.status(201).json({
                status: "success",
                data: { name: req.body.name },
            });
        },
        getPatients: (_req, res) => {
            res.status(200).json({
                status: "success",
                data: [],
            });
        },
        getPatient: (_req, res) => res.status(200).json({ status: "success" }),
        updatePatient: (_req, res) => res.status(200).json({ status: "success" }),
        deletePatient: (_req, res) => res.status(204).end(),
        getPatientHistory: (_req, res) => res.status(200).json({ status: "success" }),
    },
};

// Import the actual patient routes, using the mocked controller above.
const patientRoutes = require("../server/routes/patientRoutes");

// Create a separate Express app for testing.
// It does not start the real ClinicFlow server or connect to MongoDB.
const app = express();
app.use(express.json());
app.use("/api/patients", patientRoutes);

// Port 0 asks the operating system to assign an available port.
const server = app.listen(0);
const address = server.address();
const baseUrl = `http://127.0.0.1:${address.port}/api/patients`;

// Create short-lived JWTs for test users with different roles.
function createToken(role) {
    return jwt.sign(
        { id: `test-${role.toLowerCase()}`, role },
        process.env.JWT_SECRET,
        { expiresIn: "5m" }
    );
}

test("patient creation rejects requests without a token", async () => {
    const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Test Patient" }),
    });

    assert.equal(response.status, 401);
    assert.equal(
        (await response.json()).message,
        "Authentication required"
    );
});

test("Doctor cannot create a patient", async () => {
    const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${createToken("Doctor")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "Test Patient" }),
    });

    assert.equal(response.status, 403);
    assert.equal((await response.json()).message, "Access denied");
});

test("Receptionist can reach the patient-creation handler", async () => {
    const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${createToken("Receptionist")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "Test Patient" }),
    });

    assert.equal(response.status, 201);

    const body = await response.json();
    assert.equal(body.status, "success");
    assert.equal(body.data.name, "Test Patient");
});

test("Admin can reach the patient-creation handler", async () => {
    const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${createToken("Admin")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "Test Patient" }),
    });

    assert.equal(response.status, 201);
});

test("Doctor can access the patient list", async () => {
    const response = await fetch(baseUrl, {
        headers: {
            Authorization: `Bearer ${createToken("Doctor")}`,
        },
    });

    assert.equal(response.status, 200);

    const body = await response.json();
    assert.deepEqual(body.data, []);
});

// Close the temporary HTTP server after all tests finish.
// Cleanup is handled separately, so it is not counted as an application test.
after(async () => {
    await new Promise((resolve, reject) => {
        server.close((error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
});
